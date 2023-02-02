import topscoreApi from '../../../topscore-api-js';
import papa from 'papaparse';

import actionTypes from './actionTypes';

import Firebase from 'firebase/app';
import 'firebase/database';
import firebaseApi from '../../../firebase/api';
import firebaseActions from '../../../firebase/actions';
import firebaseSelector from '../../../firebase/selector';

import selector from './selector';

import {
  onDataReceived,
  onUpdateComplete,
  onError,
  withFirebase
} from '../../Shared/state/util';

function selectDetailPlayer(playerIndex) {
  return { type: actionTypes.selectDetailPlayer, payload: { playerIndex } };
}

function reset() {
  return { type: actionTypes.reset };
}

////////////// Data sync /////////////

const beginOrganizationSync = withFirebase(function(
  dispatch,
  getState,
  firebase,
  pathKey
) {
  const { authInfo = {} } = firebase;
  const { uid } = authInfo;
  if (uid && pathKey) {
    dispatch(
      firebaseActions.syncPath(`organizations/${pathKey}`, 'organization')
    );
    dispatch(
      firebaseActions.syncPath(
        `users/${uid}/private/organizations/${pathKey}`,
        'userOrganization'
      )
    );
  }
});

const endOrganizationSync = withFirebase(function(
  dispatch,
  getState,
  firebase,
  pathKey
) {
  const { authInfo = {} } = firebase;
  const { uid } = authInfo;
  if (uid && pathKey) {
    dispatch(
      firebaseActions.unsyncPath(`organizations/${pathKey}`, 'organization')
    );
    dispatch(
      firebaseActions.unsyncPath(
        `users/${uid}/organizations/${pathKey}`,
        'userOrganization'
      )
    );
  }
});

const beginDraftSync = withFirebase(function(
  dispatch,
  getState,
  firebase,
  draftId
) {
  if (draftId) {
    return dispatch(
      firebaseActions.syncPath(`draftSetup/${draftId}`, 'draftMeta')
    );
  }
});

const endDraftSync = withFirebase(function(dispatch, getState, firebase) {
  return dispatch(firebaseActions.unsyncPath('draftMeta'));
});

/////////////// Wizard //////////////////

const submitStep = withFirebase(function(
  dispatch,
  getState,
  firebase,
  draftId,
  step
) {
  // TODO validate each step here before putting it to firebase

  return dispatch(
    firebaseActions.updateData(
      `draftSetup/${draftId}/draftData`,
      'draftMeta',
      prevDraftMeta => {
        // We always want to replace what was there before
        const state = selector(getState());
        let { players, columns, teams, settings, wizard } = state;

        const { stepsComplete } = wizard;
        stepsComplete[step] = true;

        players = players.map(player => {
          const ret = {};
          Object.keys(player)
            .filter(attr => !!attr)
            .forEach(attr => (ret[attr] = player[attr] || ''));
          return ret;
        });
        settings = settings.map(setting => ({
          id: setting.id,
          value: setting.value
        }));

        return {
          ...(prevDraftMeta || {}),
          players,
          columns,
          teams,
          settings,
          stepsComplete
        };
      }
    )
  )
    .then(result => {
      dispatch({ type: actionTypes.submitStep, step, success: true });

      const state = selector(getState());
      return state.wizard.stepsComplete[step];
    })
    .catch(result => {
      dispatch({ type: actionTypes.submitStep, step, success: false });

      const state = selector(getState());
      return state.wizard.stepsComplete[step];
    });
});

const skipStep = withFirebase(function(dispatch, getState, firebase, step) {
  const state = selector(getState());
  return state.wizard.stepsComplete[step];
});

const importTopScorePlayers = withFirebase(function(
  dispatch,
  getState,
  firebase,
  draftId
) {
  const { organization, draftMeta, userOrganization } = selector(getState());

  if (!organization.topScoreUrl) {
    return;
  }

  const { topScoreUrl: url } = organization;
  const { topScoreUser: auth_token } = userOrganization;
  const { eventKey: event_id } = draftMeta;

  if (!url) {
    return;
  }

  dispatch({
    type: actionTypes.requestStarting,
    requestType: 'importTopScoreData',
    requestEndpoint: 'players'
  });

  const requestType = 'players';

  const apiParams = {
    url,
    queryParams: {
      per_page: 100,
      event_id,
      auth_token,
      'fields[]': 'Person'
    }
  };

  return topscoreApi
    .getAllItems('/api/registrations', apiParams)
    .then(registrations => {
      // First reshape the events coming from the Topscore API
      // Then for each event in the Topscore list, add/merge into the existing list
      const topscorePlayers = registrations.map(registration => {
        let {
          baggage_group_id,
          is_baggage_user_approved,
          is_baggage_owner_approved,
          status,
          roles,
          team_id,
          Person = {},
          id: registration_id
        } = registration;

        if (!Person) {
          Person = {};
        }

        let {
          id = parseInt(Math.random() * 9999999),
          email_address,
          first_name,
          last_name,
          nickname,
          gender,
          height,
          birth_date,
          images = {}
        } = Person;

        if (!images) {
          images = {};
        }

        if (!is_baggage_user_approved || !is_baggage_owner_approved) {
          baggage_group_id = null;
        }

        const image = images[200];

        const ret = {
          // Registration
          baggage_group_id,
          is_baggage_user_approved,
          is_baggage_owner_approved,
          status,
          roles,
          team_id,
          registration_id,

          // Person
          id,
          email_address,
          first_name,
          last_name,
          nickname,
          gender,
          height,
          birth_date,
          image,

          // Locally used data
          _include: true
        };

        Object.keys(ret).forEach(retKey => (ret[retKey] = ret[retKey] || ''));

        return ret;
      });

      dispatch({
        type: actionTypes.importTopScoreData,
        dataType: requestType,
        players: topscorePlayers,
        success: true
      });

      return topscorePlayers;
    })
    .catch(error =>
      dispatch({
        type: actionTypes.importTopScoreData,
        dataType: requestType,
        error,
        success: false
      })
    );
});

const importCsvData = withFirebase(function(
  dispatch,
  getState,
  firebase,
  targetFile
) {
  dispatch({
    type: actionTypes.requestStarting,
    requestType: 'importTopScoreData',
    requestEndpoint: 'csv'
  });

  const config = {
    header: true,
    skipEmptyLines: true,
    complete: result => {
      const { data, errors, meta } = result;
      const players = data
        .map(player => {
          const idAttr = Object.keys(player).find(
            attr => attr.toLowerCase() === 'id'
          );
          const id = (idAttr && player[idAttr]) || '';
          return { ...player, id };
        })
        .filter(player => player.id)
        .map(player => ({ ...player, roles: player.roles || ['player'] }));
      return dispatch({
        type: actionTypes.csvLoaded,
        dataType: 'players',
        success: true,
        players,
        meta,
        errors
      });
    },
    error: result => {
      const { data, errors, meta } = result;
      return dispatch({
        type: actionTypes.csvLoaded,
        dataType: 'players',
        success: false,
        errors
      });
    }
  };

  papa.parse(targetFile, config);
});

function importOrganizationData() {
  return function(dispatch, getState) {
    const state = selector(getState());
    const orgData = state.draftMeta.draftData.defaultDraftData || {};
    return dispatch({ type: actionTypes.importOrganizationData, orgData });
  };
}

function deleteOrganizationData() {
  return dispatch(
    firebaseActions.deletePath(
      `draftSetup/${draftId}/draftData/defaultDraftData`,
      'deleteDraftMeta'
    )
  );
}

function changeSetting(name, value) {
  return { type: actionTypes.changeSetting, name, value };
}

function updateColumnAttribute(id, attr, value) {
  return { type: actionTypes.updateColumnAttribute, id, attr, value };
}

const importTopScoreTeams = withFirebase(function(
  dispatch,
  getState,
  firebase,
  draftId
) {
  const { organization, draftMeta, userOrganization } = selector(getState());

  if (!organization.topScoreUrl) {
    return;
  }

  const { topScoreUrl: url } = organization;
  const { topScoreUser: auth_token } = userOrganization;
  const { eventKey: event_id } = draftMeta;

  if (!url) {
    return;
  }

  dispatch({
    type: actionTypes.requestStarting,
    requestType: 'importTopScoreData',
    requestEndpoint: 'teams'
  });

  const requestType = 'teams';

  const apiParams = {
    per_page: 100,
    event_id,
    auth_token
  };

  return topscoreApi
    .getPage(url, '/api/teams', apiParams)
    .then(result => {
      if (result.error) {
        return result;
      }

      const { body } = result;

      const { result: teams, status } = body;

      if (status !== 200) {
        return result;
      }

      const topscoreTeams = teams.map(team => {
        let { id, name, color } = team;

        const ret = {
          id,
          name,
          color
        };

        Object.keys(ret).forEach(retKey => (ret[retKey] = ret[retKey] || ''));

        return ret;
      });

      dispatch({
        type: actionTypes.importTopScoreData,
        dataType: requestType,
        teams: topscoreTeams,
        success: true
      });

      return topscoreTeams;
    })
    .catch(error =>
      dispatch({
        type: actionTypes.importTopScoreData,
        dataType: requestType,
        error,
        success: false
      })
    );
});

const publishDraft = withFirebase(function(
  dispatch,
  getState,
  firebase,
  saveConfig
) {
  const { organization, draftMeta } = selector(getState());
  const { organizationKey, draftData, pathKey: draftKey } = draftMeta;
  const event = organization.events[draftMeta.eventKey];

  let { columns: rawColumns, settings, players, teams } = draftData;

  settings = settings.map(setting => ({
    id: setting.id,
    value: setting.value || ''
  }));
  const columns = rawColumns.filter(col => col.include).map(col => {
    const { id, display, order, type, visible, primary } = col;
    return { id, display, order, type, visible, primary };
  });
  players = players.filter(player => player._include).map((player, index) => {
    const ret = {
      draftId: index + 1
    };
    Object.keys(player)
      .filter(attr => {
        if (!attr) {
          return false;
        }
        const col = columns.find(col => col.id === attr);
        return !!col;
      })
      .forEach(attr => {
        let value = player[attr] || '';

        const col = columns.find(col => col.id === attr);
        if (col.type === 'Vector' || col.type === 'Number') {
          value = parseInt(value);
          if (isNaN(value)) {
            value = 0;
          }
        }

        ret[attr] = value;
      });
    return ret;
  });

  teams = teams.map((team, index) => ({
    draftId: index + 1,
    ...team
  }));

  const meta = {
    organizationName: organization.name,
    eventName: event.name,
    eventImage: event.image200
  };

  const updates = [
    {
      path: `drafts/${draftKey}/columns`,
      value: columns,
    },
    {
      path: `drafts/${draftKey}/settings`,
      value: settings
    },
    {
      path: `drafts/${draftKey}/players`,
      value: players
    },
    {
      path: `drafts/${draftKey}/teams`,
      value: teams
    },
    {
      path: `drafts/${draftKey}/meta`,
      value: meta
    },
    {
      path: `drafts/${draftKey}/organizationKey`,
      value: organizationKey
    },
    {
      path: `draftSetup/${draftKey}`,
      value: {
        status: 'published',
        lastPublishDate: Firebase.database.ServerValue.TIMESTAMP
      }
    }
  ];

  if (saveConfig) {
    updates.unshift({
      path: `organizations/${organizationKey}/draftSetupConfig`,
      value: { columns: rawColumns, settings }
    });
  }

  updates.forEach(({ path, value }) => {
    if(typeof value === 'object') {
      dispatch(firebaseActions.updateData(path, 'publishDraft', value));
    } else {
      dispatch(firebaseActions.setData(path, 'publishDraft', value));
    }
  });
});

export default {
  reset,

  beginOrganizationSync,
  endOrganizationSync,
  beginDraftSync,
  endDraftSync,

  submitStep,
  skipStep,

  importTopScorePlayers,
  importCsvData,

  importOrganizationData,
  deleteOrganizationData,
  selectDetailPlayer,

  changeSetting,
  updateColumnAttribute,

  importTopScoreTeams,

  publishDraft
};
