import actionTypes from './actionTypes';
import validator from './validator';
import selector from './selector';

import topscoreApi from '../../../topscore-api-js';

import Firebase from 'firebase/app';
import 'firebase/database';
import firebaseApi from '../../../firebase/api';
import firebaseActions from '../../../firebase/actions';
import firebaseSelector from '../../../firebase/selector';

import ga from 'ga';

import {onDataReceived, onUpdateComplete, onError, withFirebase} from '../../Shared/state/util';

////////////// Sync Actions /////////////

const beginSync = withFirebase(function(dispatch, getState, firebase, draftId) {
  const {authInfo = {}} = firebase;
  const {uid} = authInfo;
  if(uid) {
    firebaseApi.updateData(`drafts/${draftId}/sessions/${uid}`, {connected: Firebase.database.ServerValue.TIMESTAMP, allowed: true})
      .then(error => {
        if(!error) {
          firebaseApi.syncData(`drafts/${draftId}`, 'draft', result => {
            if(result.data) {

              onDataReceived(dispatch, 'draft')(result);

              const {sessions = {}} = result.data;
              Object.keys(sessions).forEach(userId => {
                dispatch(firebaseActions.syncPath(`users/${userId}/public`, `users.${userId}`));
              });

              const {organizationKey} = result.data;
              dispatch(firebaseActions.syncPath(`organizations/${organizationKey}/members/${uid}`, `organizationAdmin`));
              dispatch(firebaseActions.syncPath(`organizations/${organizationKey}/config`, `organizationConfig.${organizationKey}`));
              dispatch(firebaseActions.syncPath(`users/${uid}/private/organizations/${organizationKey}`, `privateOrganizationInfo`));

            }
          });

          dispatch(firebaseActions.syncPath(`drafts/${draftId}/sessions/${uid}/teamId`, `contextTeamId`));
          dispatch(firebaseActions.syncPath(`users/${uid}/private/drafts/${draftId}`, `privateUserInfo`));
          dispatch(firebaseActions.syncPath(`users/${uid}/private/players`, `privateUserPlayerInfo`));

        } else {
          onError(dispatch, 'draft');
        }
      });
  }
});

const endSync = withFirebase(function(dispatch, getState, firebase) {
  dispatch(firebaseActions.unsyncPath(`draft`));
  // XXX Leaving the user references hanging
});

// UI Actions

function selectTab(tabName) {
  return {type: actionTypes.selectTab, payload: {tabName}};
}

function selectPlayer(playerId) {
  return {type: actionTypes.selectPlayer, payload: {playerId}};
}

function selectTeam(teamId) {
  return {type: actionTypes.selectTeam, payload: {teamId}};
}

const selectContextTeam = withFirebase(function(dispatch, getState, firebase, teamId) {

  const {authInfo = {}} = firebase;
  const {uid} = authInfo;

  const state = selector(getState());
  const {draftId} = state;

  dispatch({type: actionTypes.selectContextTeam, payload: {teamId}});
  firebaseApi.updateData(`drafts/${draftId}/sessions/${uid}`, {teamId});
});

function filterPlayers(name, value) {
  return {type: actionTypes.filterPlayers, payload: {name, value}};
}

const sortPlayers = withFirebase(function(dispatch, getState, firebase, value) {

  dispatch({type: actionTypes.sortPlayers, payload: {value}});

  const {authInfo = {}} = firebase;
  const {uid} = authInfo;
  const state = selector(getState());

  const {draftId} = state;
  const {sorts} = state.basic.ui.playersTabOptions;

  firebaseApi.updateData(`users/${uid}/private/drafts/${draftId}/privateUserInfo`, {sorts});
});

const updatePlayerAttribute = withFirebase(function(dispatch, getState, firebase, columnId, playerId, value) {

  const {authInfo = {}} = firebase;
  const {uid} = authInfo;
  const state = selector(getState());

  const {draftId, basic: {players, columns}} = state;

  const playerIndex = players.findIndex(player => player.id === playerId);
  const column = columns.find(col => col.id === columnId);
  if(column) {
    const columnType = column.type;

    if(columnType === 'Number' || columnType === 'Vector') {
      value = parseInt(value);
    }
  }

  firebaseApi.updateData(`drafts/${draftId}/players/${playerIndex}`, {[columnId]: value});
});

const updateDraftGroupIds = withFirebase(function(dispatch, getState, firebase, playerId, rawBagDraftIds) {

  const state = selector(getState());
  const {basic: {players}} = state;

  const bagDraftIds = rawBagDraftIds.trim().split(',').map(id => parseInt(id.trim()));

  let baggageGroupId = parseInt(Math.random() * 1000000000) + 100000;

  const bagGroup = [
    players.find(player => player.id === playerId),
    ...players.filter(player => bagDraftIds.indexOf(player.draftId) >= 0),
  ];

  bagGroup.forEach(player => dispatch(updatePlayerAttribute('baggage_group_id', player.id, baggageGroupId)));
});

function viewTeamRoster(teamId) {
  return {type: actionTypes.viewTeamRoster, payload: {teamId}};
}

function viewTeamStat(statId) {
  return {type: actionTypes.viewTeamStat, payload: {statId}};
}

function toggleSection(section) {
  return {type: actionTypes.toggleSection, payload: {section}};
}

function playerSearchTermChanged(term) {
  return {type: actionTypes.searchPlayers, payload: {term}};
}

function toggleEditTeamName(teamId = 0) {
  return {type: actionTypes.toggleEditTeamName, payload: {teamId}};
}

function toggleAssignBaggage(teamId = 0) {
  return {type: actionTypes.toggleAssignBaggage, payload: {teamId}};
}

function toggleTopScoreForm() {
  return {type: actionTypes.toggleTopScoreForm}
}

function updateApiCsrf(csrf) {
  return {type: actionTypes.updateApiCsrf, payload: {csrf}};
}

function updateApiClientId(clientId) {
  return {type: actionTypes.updateApiClientId, payload: {clientId}};
}

// Firebase update actions actions //////////////////

const notePlayer = withFirebase(function(dispatch, getState, firebase, playerId, note) {

  const {authInfo = {}} = firebase;
  const {uid} = authInfo;

  const state = selector(getState());
  const {draftId} = state;

  firebaseApi.updateData(`users/${uid}/private/players/${playerId}`, {note});
});

const draftPlayer = withFirebase(function(dispatch, getState, firebase, playerId, teamId) {

  const {authInfo = {}, serverTimeOffset} = firebase;
  const {uid} = authInfo;

  const state = selector(getState());
  const {draftId, higher: {selectionTimer: {selectionTime: {startTime: priorStartTime}, currentDraftOrder}}} = state;

  const {team: {id: draftOrderTeamId}, overallSelection: selectionOrder} = currentDraftOrder;

  if(!teamId) {
    teamId = draftOrderTeamId;
  }

  const startTime = new Date().getTime() + serverTimeOffset;
  const timeTaken = startTime - (priorStartTime || startTime);

  try {
  firebaseApi.updateData(`drafts/${draftId}/selections/${selectionOrder - 1}`, (data) => {
    if(data) {
      throw new Error('Selection already exists');
    } else {
      return {
        playerId,
        teamId,
        selectionOrder,
        timeTaken,
      }
    }
  }, () => {
    firebaseApi.updateData(`drafts/${draftId}/controls`, function(val) {
      if(!val) {
        val = {active: false};
      }
      return {...val, startTime};
    });
  });

} catch(e) {
  ga('send', {
    hitType: 'event',
    eventAction: 'Draft',
    eventCategory: 'Error/SelectionExists',
  });
}
});

const undoDraftPlayer = withFirebase(function(dispatch, getState, firebase) {

  const {authInfo = {}, serverTimeOffset} = firebase;
  const {uid} = authInfo;

  const state = selector(getState());
  const {draftId, basic: {selections}} = state;

  if(!selections.length) {
    console.log("undoDraftPlayer warning: Attempted to remove the last selection but there are no selections");
  }

  const key = selections.length - 1;
  const lastSelection = selections[key];

  const {timeTaken} = lastSelection;

  const startTime = new Date().getTime() + serverTimeOffset - timeTaken;

  firebaseApi.getRef(`drafts/${draftId}/selections/${key}`).remove();
  firebaseApi.updateData(`drafts/${draftId}/controls`, function(val = {active: false}) {
    return {active: val.active, startTime};
  });
});

const skipDraftPlayer = withFirebase(function(dispatch, getState, firebase, teamId) {
  return dispatch(draftPlayer(-1, teamId));
});

const toggleControlsActive = withFirebase(function(dispatch, getState, firebase, active) {

  const {authInfo = {}, serverTimeOffset = 0} = firebase;
  const {uid} = authInfo;

  const state = selector(getState());
  const {draftId} = state;

  firebaseApi.updateData(`drafts/${draftId}/controls`, function(val) {

    if(!val) {
      val = {};
    }

    const nowTime = new Date().getTime() + serverTimeOffset;

    // Unpausing
    if(active) {

      const startTime = nowTime - (val.priorTime || 0);

      return {
        active,
        startTime,
      }
    }

    // Pausing
    if(!active) { // Pausing

      const priorTime = nowTime - (val.startTime || nowTime);

      return {
        active,
        priorTime,
      }
    }
  });
});

const updateTeamDraftOrder = withFirebase(function(dispatch, getState, firebase, draftOrder) {
  const {authInfo = {}, serverTimeOffset = 0} = firebase;
  const {uid} = authInfo;

  const state = selector(getState());
  const {draftId} = state;

  firebaseApi.updateData(`drafts/${draftId}/teams`, function(val) {
    const ret = val.map(team => ({
      ...team,
      draftId: draftOrder.findIndex(findTeam => findTeam == team.id) + 1,
    }));

    return ret;
  });

});

const updateTeamName = withFirebase(function(dispatch, getState, firebase, teamId, name) {
  const {authInfo = {}, serverTimeOffset = 0} = firebase;
  const {uid} = authInfo;

  const state = selector(getState());
  const {draftId} = state;

  firebaseApi.updateData(`drafts/${draftId}/teams`, function(val) {
    const ret = val.map(team => ({
      ...team,
      name: teamId == team.id ? name : team.name,
    }));

    dispatch(toggleEditTeamName());

    return ret;
  });

});

const assignBaggage = withFirebase(function(dispatch, getState, firebase, shouldAdd, teamId, player) {
  const {authInfo = {}, serverTimeOffset = 0} = firebase;
  const {uid} = authInfo;

  const state = selector(getState());
  const {draftId} = state;

  firebaseApi.updateData(`drafts/${draftId}/assignedBaggage`, function(ret) {

    if(!ret) {
      ret = [];
    }

    ret = ret.filter(assignment => assignment.playerId != player.id &&
      player.baggage.map(bag => bag.id).indexOf(assignment.playerId) === -1
    );

    if(shouldAdd) {
      ret.push({teamId, playerId: player.id});
      ret.push(...player.baggage.map(bag => ({teamId, playerId: bag.id})));
    }

    dispatch(playerSearchTermChanged(''));

    return ret;
  });

});

const changeSetting = withFirebase(function(dispatch, getState, firebase, id, value) {
  const {authInfo = {}, serverTimeOffset = 0} = firebase;
  const {uid} = authInfo;

  const state = selector(getState());
  const {draftId} = state;

  firebaseApi.updateData(`drafts/${draftId}/settings`, settings => {
    return settings.map(setting => {
      if(setting.id === id) {
        return {id, value}
      } else {
        return setting;
      }
    });
  });
});

const toggleJoinDraft = withFirebase(function(dispatch, getState, firebase) {

  const state = selector(getState());
  const {
    draftId,
    higher: {
      dashboardTab: {
        joinDraft,
      },
    },
  } = state;

  if(joinDraft.enabled) {

    firebaseApi.deleteData(`drafts/${draftId}/joinDraft`); // Deleting because it makes the enable/disable logic easier
    firebaseApi.deleteData(`joinDraft/${joinDraft.token.trim().toLowerCase()}`);

  } else {

    let {token} = joinDraft;
    if(!token) {
      const alphas = "ABCDEFGHJKMNPQRSTUVWXYZ";
      token = [0,0,0].map(n => alphas[parseInt(Math.random() * alphas.length)]).join('')
        + '-' + [0,0,0,0].map(n => parseInt(Math.random() * 10)).join('');
    }

    firebaseApi.updateData(`drafts/${draftId}/joinDraft`, {enabled: true, token});
    firebaseApi.updateData(`joinDraft/${token.trim().toLowerCase()}`, draftId);

  }
});

const updateJoinDraftToken = withFirebase(function(dispatch, getState, firebase, token) {

  const state = selector(getState());
  const {
    draftId,
    higher: {
      dashboardTab: {
        joinDraft,
      },
    },
  } = state;

  const enabled = joinDraft.enabled && !!token;
  firebaseApi.updateData(`drafts/${draftId}/joinDraft`, {token, enabled});

  if(joinDraft.enabled) {
    firebaseApi.deleteData(`joinDraft/${joinDraft.token.trim().toLowerCase()}`);

    if(!!token) {
      firebaseApi.setData(`joinDraft/${token.trim().toLowerCase()}`, draftId);
    } else if(joinDraft.enabled && !token) {
      dispatch(toggleJoinDraft);
    }
  }

});

//// TopScore API Actions /////////////////////////////////////////////

const runUpdateTopScore = withFirebase(function(dispatch, getState, firebase) {

  const state = selector(getState());
  const {
    higher: {
      dashboardTab: {
        organization: {
          topScoreUrl,
          topScoreUser,
        },
        topScoreCsrf,
        topScoreClientId,
        teams,
      },
    },
  } = state;

  dispatch({type: actionTypes.topScoreUpdate, payload: {isPre: true, teamCount: teams.length}});

  teams.forEach(({players, id: teamId, name}) => {

    if(players.length === 0) {
      dispatch({type: actionTypes.topScoreUpdate, payload: {isPre: false, success: true, teamId, name, playerCount: 0}});
      return;
    }

    const registrationIds = players.map(({registration_id}) => registration_id).join(',');

    topscoreApi.batchUpdatePlayerTeam({
      url: topScoreUrl,
      registrationIds,
      teamId: teamId,
      queryParams: {
        auth_token: topScoreClientId || topScoreUser,
        api_csrf: topScoreCsrf,
      },
    })
    .then(results => {
      dispatch({type: actionTypes.topScoreUpdate, payload: {isPre: false, success: true, teamId, name, playerCount: players.length}});
    })
    .catch(error => {
      dispatch({type: actionTypes.topScoreUpdate, payload: {isPre: false, success: false, teamId, name, playerCount: players.length, error}});
    });;

  });

});


const clearPlayerNotes = withFirebase(function(dispatch, getState, firebase) {
  const {authInfo = {}} = firebase;
  const {uid} = authInfo;

  firebaseApi.deleteData(`users/${uid}/private/players`);
});

export default {

  beginSync,
  endSync,

  selectTab,
  selectPlayer,
  selectTeam,
  selectContextTeam,
  toggleSection,

  filterPlayers,
  sortPlayers,
  updatePlayerAttribute,
  updateDraftGroupIds,

  viewTeamRoster,
  viewTeamStat,

  notePlayer,
  draftPlayer,
  undoDraftPlayer,
  skipDraftPlayer,

  updateTeamDraftOrder,
  toggleEditTeamName,
  updateTeamName,
  toggleAssignBaggage,
  assignBaggage,
  changeSetting,
  toggleTopScoreForm,
  updateApiCsrf,
  updateApiClientId,
  runUpdateTopScore,
  toggleJoinDraft,
  updateJoinDraftToken,

  toggleControlsActive,
  playerSearchTermChanged,

  clearPlayerNotes,

}
