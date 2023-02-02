import {combineReducers} from 'redux';
import actionTypes from './actionTypes';
import firebaseActionTypes from '../../../firebase/actionTypes';

function isSynced(otherState, action) {
  return !!(
    otherState.organizations.length === 0 ||
    otherState.organizations.find(org => org.pathKey === otherState.activeOrgPath)
  );
}

function organizations(state = [], action) {
  if(action.type === firebaseActionTypes.dataReceived) {

    let match = action.dataType.match(/^organization\.(.+$)/);

    if(match) {

      const orgKey = match[1];
      const organization = action.data;

      if(organization) { // Is it there?

        let events = [];
        if(organization.events) {
          events = Object.keys(organization.events)
            .map(key => organization.events[key])
            .sort((a,b) => new Date(b.regOpen) - new Date(a.regOpen));
        }

        const newOrg = {
          draftKey: '', // Overridden by organization if draft exists
          ...organization,
          events,
          pathKey: orgKey,
          path: `organizations/${orgKey}`,
        }

        return [
          ...state.filter(org => org.pathKey !== orgKey),
          newOrg,
        ];

      } else { // It's gone!
        return state.filter(org => org.pathKey !== orgKey);
      }
    }

    match = action.dataType.match(/^publicUser\.(.+$)/);

    if(match) {
      const uid = match[1];
      const user = action.data;

      if(user) { // Is it there?
        return state.map(organization => {
          const {members} = organization;
          if(uid in members) {
            members[uid] = {
              ...members[uid],
              ...user.self,
            }
          }
          return {
            ...organization,
            members,
          }
        });
      }
    }
  }
  return state;
}

function activeOrgPath(state = '', action) {
  if(state === '' && action.type === firebaseActionTypes.dataReceived) {

    const match = action.dataType.match(/^organization\.(.+$)/);

    if(match) {
      return match[1];
    }

  } else if(action.type === actionTypes.activateOrganization) {
    return action.orgKey;
  }
  return state;
}

const defaultForm = {
  pathKey: undefined,
  requesting: false,
  isRequesting: false,
  inputs: {
    name: '',
    topScoreUrl: '',
    topScoreUser: '',
  },
  validation: {}, // Only if all of these are true is the form valid
}

function organizationForm(state = defaultForm, action) {
  if(action.type === actionTypes.initializeForm) {
    
    const {config = {}, pathKey = ''} = action.organization;
    const {
      name = '',
      topScoreUrl = '',
    } = config;

    const org = action.userOrganizations[pathKey] || {};
    const {topScoreUser = ''} = org;

    return {
      ...defaultForm,
      pathKey,
      isRequesting: false,
      inputs: {
        name,
        topScoreUrl,
        topScoreUser,
      },
    }
  } else if(action.type === firebaseActionTypes.dataReceived && action.dataType === 'newOrganization') {
    return defaultForm;
  } else if(action.type === actionTypes.formSubmissionStarting) {
    if(action.requestType === 'newOrganization' || action.requestType === 'validateOrganizationForm') {
      return {
        ...state,
        isRequesting: true,
      }
    }
  } else if(action.type === actionTypes.formValidation && action.requestType === 'validateOrganizationForm') {
    const {validation} = action;
    return {
      ...state,
      validation: {
        ...validation.reasons,
      },
      isSubmitted: true,
      isRequesting: false,
    }
  }
  return state;
}

function draftMeta(state = {}, action) {

  if(action.type === firebaseActionTypes.dataReceived && action.dataType === 'draftMeta') {
    return action.data || {};
  }

  return state;
}

const defaultUiState = {
  orgEventsPage: 1,
  orgEventsPageSize: 6,
}

function ui(state = defaultUiState, action) {
  if(action.type === actionTypes.paginateOrgEvents) {
    const {orgEventsPage} = state;
    const nextPage = orgEventsPage + action.change;
    return {
      ...state,
      orgEventsPage: nextPage,
    }
  } else if(action.type === actionTypes.activateOrganization) {
    return defaultUiState;
  }
  return state;
}

function members(state = [], action) {

  if(action.type === firebaseActionTypes.dataReceived) {

    const match = action.dataType.match(/^organization\.(.+$)/);

    if(match) {
    }
  }

  return state;
}

const defaultJoinOrgState = {
  addOrgMember: '',
  isRequesting: false,
  joinRequested: false,
  joinSuccessful: false,
}

function joinOrg(state = defaultJoinOrgState, action) {
  if(action.type === actionTypes.newAddMemberLink) {
    return {
      ...state,
      addOrgMember: action.key,
    }
  } else if(action.type === actionTypes.removeNewAddMemberLink) {
    return {
      ...state,
      addOrgMember: '',
    }
  } else if(action.type === actionTypes.claimOrganizationInvite) {
    return {
      ...state,
      addOrgMember: action.joinKey,
      isRequesting: true,
      joinRequested: true,
      joinSuccessful: false,
    }
  } else if(action.type === firebaseActionTypes.dataUpdated) {

    const match = action.dataType.match(/^orgMemberInvite\.(.+$)/);

    if(match) {
      const joinSuccessful = state.addOrgMember === match[1];
      return {
        ...state,
        isRequesting: false,
        joinSuccessful,
      }
    }
  }
  return state;
}

function userOrganizations(state = {}, action) {

  if(action.type === firebaseActionTypes.dataReceived && action.dataType === 'userOrganizations') {
    return action.data;
  }

  return state;
}

const basicReducer = combineReducers({
  organizations,
  activeOrgPath,
  organizationForm,
  draftMeta,
  ui,
  userOrganizations,
  joinOrg,
});

function reducer(state = {}, action) {
  const {
    isSynced: ignoreMe,
    ...basicState
  } = state;

  const nextBasicState = basicReducer(basicState, action);
  const nextIsSynced = isSynced(nextBasicState, action);

  return {
    ...nextBasicState,
    isSynced: nextIsSynced,
  }
}

export default reducer;