import actionTypes from './actionTypes';
import validator from './validator';
import selector from './selector';

import topscoreApi from '../../../topscore-api-js';

import Firebase from 'firebase/app';
import 'firebase/database';
import firebaseApi from '../../../firebase/api';
import firebaseActions from '../../../firebase/actions';
import firebaseSelector from '../../../firebase/selector';

import draftSetupActions from '../../DraftSetup/state/actions';

import {onDataReceived, onUpdateComplete, onError, withFirebase} from '../../Shared/state/util';

////////////// Actions /////////////

// TODO: Figure out a smarter way to sync'ing this data. There are key lists
// and separately the data that they point to. This should be done more
// intelligently
const beginOrganizationListSync = withFirebase(function(dispatch, getState, firebase) {
  const {authInfo = {}} = firebase;
  const {uid} = authInfo;
  if(uid) {
    firebaseApi.syncData(`users/${uid}/private/organizations`, 'organizationList', result => {
      if(result.data) {
        onDataReceived(dispatch, 'userOrganizations')(result);
        Object.keys(result.data).forEach(orgKey => {
          firebaseApi.syncData(`organizations/${orgKey}`, `organization.${orgKey}`, result => {
            if(result.data) {
              onDataReceived(dispatch, `organization.${orgKey}`)(result);
              Object.keys(result.data.members).forEach(userId => {
                dispatch(firebaseActions.syncPath(`users/${userId}/public`, `publicUser.${userId}`));
              });
            }
          });
        })
      }
    });
  }
});

const endOrganizationListSync = withFirebase(function(dispatch, getState, firebase) {
  const {authInfo = {}} = firebase;
  const {uid} = authInfo;
  if(uid) {
    return dispatch(firebaseActions.unsyncPath('organizationList'));
  }
});

const beginOrganizationSync = function(organiationId) {
  return function(dispatch, getState) {
    return dispatch(firebaseActions.syncPath(`organizations/${organiationId}`, `organizations.${organiationId}`));
  }
};

const endOrganizationSync = function(organiationId) {
  return function(dispatch, getState) {
    return dispatch(firebaseActions.unsyncPath(`organizations.${organiationId}`));
  }
};

const beginDraftMetaSync = withFirebase(function(dispatch, getState, firebase, pathKey) {
  if(pathKey) {
    return dispatch(firebaseActions.syncPath(`draftSetup/${pathKey}`, 'draftMeta'));
  }
});

const endDraftMetaSync = withFirebase(function(dispatch, getState, firebase) {
  return dispatch(firebaseActions.unsyncPath('draftMeta'));
});

const createDraft = withFirebase(function(dispatch, getState, firebase, organization, event) {
  const dataType = 'newDraftMeta';

  const {authInfo = {}} = firebase;
  const {uid: creator} = authInfo;

  const {id: eventKey} = event;
  const {pathKey: organizationKey} = organization;

  const status = 'prepublished';

  const data = {creator, eventKey, organizationKey, status};

  if(organization.draftSetupConfig) {
    data.draftData = {defaultDraftData: organization.draftSetupConfig};
  }

  return dispatch(firebaseActions.pushData('draftSetup', dataType, data))
    .then(ref => dispatch(firebaseActions
        .updateData(
          `organizations/${organizationKey}/events/${eventKey}/draftKey`,
          dataType,
          preVal => ref.key
        )));
});

// To fully delete a draft we must remove:
//    1. /drafts/[draftId]/
//    2. /draftSetup/[draftId]/
//    3. /organization/[orgdId]/events/[eventId]/draftKey
const removeDraft = withFirebase(function(dispatch, getState, firebase, organization, event) {
  const dataType = 'removeDraft';

  const {authInfo = {}} = firebase;
  const {uid: owner} = authInfo;

  const {id: eventKey, draftKey} = event;
  const {pathKey: organizationKey} = organization;

  dispatch(draftSetupActions.reset());

  dispatch(firebaseActions.deleteData(`draftSetup/${draftKey}`, 'removeDraft.setup'));
  dispatch(firebaseActions.deleteData(`organizations/${organizationKey}/events/${eventKey}/draftKey`, 'removeDraft.orgEvent'));
  return dispatch(firebaseActions.deleteData(`drafts/${draftKey}`, 'removeDraft'));
});

const validateOrganizationForm = withFirebase(function(dispatch, getState, firebase, organization) {
  const requestType = 'validateOrganizationForm';

  dispatch({type: actionTypes.formSubmissionStarting, requestType});

  return validator.organizationForm(organization)
    .then(validation => {
      dispatch({type: actionTypes.formValidation, requestType, validation});
    });
});

const submitOrganizationForm = withFirebase(function(dispatch, getState, firebase, organizationForm) {

  const requestType = 'newOrganization';

  dispatch({type: actionTypes.formSubmissionStarting, requestType});

  const {authInfo = {}} = firebase;
  const {uid} = authInfo;

  if(uid) {

    let {pathKey, name, topScoreUrl, topScoreUser} = organizationForm;
    const config = {name, topScoreUrl};

    let updateRef;

    if(!pathKey) {
      pathKey = firebaseApi.getRef('organizations').push().key;
    }

    const updates = [
      {[`organizations/${pathKey}/owner`]: uid},
      {[`organizations/${pathKey}/config`]: config},
      {[`organizations/${pathKey}/members/${uid}`]: {joined: Firebase.database.ServerValue.TIMESTAMP}},
      {[`users/${uid}/private/organizations/${pathKey}`]: {topScoreUser}},
    ]

    return updates.forEach(update =>
      dispatch(firebaseActions.updateData(
        '/',
        requestType,
        update,
      ))
    );

  } else {
    if(__DEBUG__) {
      console.error('Dashboard action submitNewLeague, no uid found on submit');
    }
  }
});

const refreshOrganizationEvents = withFirebase(function(dispatch, getState, firebase, organization) {

  const {config: {topScoreUrl: url}, path} = organization;

  if(!url || !path) {
    return;
  }

  const requestType = 'organizationEvents';

  const apiParams = {
    url,
    queryParams: {
      per_page: 100,
    },
  };

  return topscoreApi.queryEvents(apiParams)
    .then(result => {

      if(result.error) {
        return result;
      }

      const {events = []} = result;

      // Update the event list in Firebase
      return dispatch(firebaseActions.updateData(
        `${path}/events`,
        requestType,
        (fbEventsObj) => {

          if(!fbEventsObj) {
            fbEventsObj = {};
          }

          // First reshape the events coming from the Topscore API
          // Then for each event in the Topscore list, add/merge into the existing list

          const topscoreEvents = events
            .map(tEvent => {
              const {
                id,
                type,
                name,
                start,
                end,
                reg_open: regOpen,
                reg_close: regClose,
                images: {
                  40: image40,
                  200: image200,
                  370: image370,
                },
                type: eventType,
                slug,
              } = tEvent;
              return {
                id,
                slug,
                type,
                name,
                start,
                end,
                regOpen,
                regClose,
                image40,
                image200,
                image370,
                eventType,
              }
            });

          // Just the firebase events
          let fbEvents = Object.keys(fbEventsObj).map(key => fbEventsObj[key]);

          // Updated firebase events from topscore data
          fbEvents = fbEvents.map(fbEvent => {
            const tEvent = topscoreEvents.find(tEvent => tEvent.id === fbEvent.id) || {};
            return {
              ...fbEvent,
              ...tEvent,
            }
          });

          // Add new topscore events in
          const newTopscoreEvents = topscoreEvents
            .filter(tEvent => !fbEvents.find(fbEvent => tEvent.id === fbEvent.id));
          fbEvents = [...fbEvents, ...newTopscoreEvents];

          // Convert the results back to an object using the event id as the key
          const ret = {};
          fbEvents.forEach(fbEvent => ret[fbEvent.id] = fbEvent);

          return ret;

        }
      ));
    });

});

function activateOrganization(orgKey) {
  return {type: actionTypes.activateOrganization, orgKey}
}

const deleteOrganization = withFirebase(function(dispatch, getState, firebase, organization) {

  const requestType = 'deleteOrganization';

  const {pathKey} = organization;
  const {authInfo = {}} = firebase;
  const {uid} = authInfo;

  const {events} = organization;

  if(events) {
    events.forEach(event => {
      if(event.draftKey) {
          dispatch(firebaseActions.deleteData(`draftSetup/${event.draftKey}`, `${requestType}.event.${event.draftKey}.draftMeta`));
          dispatch(firebaseActions.deleteData(`drafts/${event.draftKey}`, `${requestType}.event.${event.draftKey}.draftMeta`));
      }
    })
  }

  dispatch(firebaseActions.deleteData(`users/${uid}/private/organizations/${pathKey}`, `${requestType}.users`));
  return dispatch(firebaseActions.deleteData(`organizations/${pathKey}`, `${requestType}.organization`));

});

// If the user information checks out then initialize the form, otherwise don't
// do anything
function ensureFormInitialized(organization, userOrganizations) {
  const {pathKey} = organization;
  const userOrg = userOrganizations[pathKey];
  if(pathKey && !!userOrg) {
    return {type: actionTypes.initializeForm, organization, userOrganizations};
  } else {
    return null;
  }
}

function paginateOrgEvents(change) {
  return {type: actionTypes.paginateOrgEvents, change};
}

const addOrganizationMember = withFirebase(function(dispatch, getState, firebase, organization) {
  const requestType = 'addOrganizationMember';

  const {authInfo = {}} = firebase;
  const {uid} = authInfo;

  return dispatch(firebaseActions.pushData('orgMemberInvites', requestType, {
    createDate: Firebase.database.ServerValue.TIMESTAMP,
    organization: organization.pathKey,
  }))
  .then(result => dispatch({type: actionTypes.newAddMemberLink, key: result.key}));

});

function closeAddOrganizationMember() {
  return {type: actionTypes.removeNewAddMemberLink};
}

// 1. Sync the join invite information
// 2. Sync the organization info
const syncJoinInformation = withFirebase(function(dispatch, getState, firebase, joinKey) {
  const requestType = 'addOrganizationMember';

  const {authInfo = {}} = firebase;
  const {uid} = authInfo;

  firebaseApi.syncData(`orgMemberInvites/${joinKey}`, 'orgMemberInvite', result => {
    onDataReceived(dispatch, 'orgMemberInvite')(result);
    if(result.data) {
      const {organization} = result.data;
      dispatch(firebaseActions.syncPath(`organizations/${organization}`, `organization.${organization}`));
    }
  });
});

const claimOrganizationInvite = withFirebase(function(dispatch, getState, firebase, joinKey, orgKey) {
  const requestType = 'claimOrganizationInvite';

  const {authInfo = {}} = firebase;
  const {uid} = authInfo;

  dispatch({type: actionTypes.claimOrganizationInvite, joinKey, uid});

  dispatch(firebaseActions.updateData(`users/${uid}/private/organizations/${orgKey}`, 'orgMemberInvite.privateOrg', {topScoreUser: ''}));
  dispatch(firebaseActions.updateData(`orgMemberInvites/${joinKey}`, 'orgMemberInvite.orgInvite', {claimedBy: uid}));
  return dispatch(firebaseActions.updateData(`organizations/${orgKey}/members/${uid}`, `orgMemberInvite.${joinKey}`,  {joined: Firebase.database.ServerValue.TIMESTAMP}));

});

export default {

  beginOrganizationListSync,
  endOrganizationListSync,

  beginOrganizationSync,
  endOrganizationSync,

  beginDraftMetaSync,
  endDraftMetaSync,

  createDraft,
  removeDraft,

  paginateOrgEvents,

  addOrganizationMember,
  closeAddOrganizationMember,

  submitOrganizationForm,
  validateOrganizationForm,
  ensureFormInitialized,

  deleteOrganization,
  refreshOrganizationEvents,
  activateOrganization,

  syncJoinInformation,
  claimOrganizationInvite,

}