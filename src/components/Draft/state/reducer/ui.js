// Used to keep track of low order UI state such as what tab is selected,
// what player is selected, etc

import {combineReducers} from 'redux';

import actionTypes from '../actionTypes';
import firebaseActionTypes from '../../../../firebase/actionTypes';

function contextTeamId(state = 0, action) {

  if(action.type === actionTypes.selectContextTeam) {
    return action.payload.teamId;
  } else if(action.type === firebaseActionTypes.dataReceived && action.dataType === 'contextTeamId') {
    return action.data || state;
  }
  return state;
}

function selectedPlayerId(state = null, action) {
  if(action.type === actionTypes.selectPlayer) {
    return parseInt(action.payload.playerId) || null;
  }
  return state;
}

function selectedTeamId(state = null, action) {
  if(action.type === actionTypes.selectTeam) {
    return parseInt(action.payload.teamId) || null;
  } else if(action.type === actionTypes.draftPlayer) {
    return null;
  }
  return state;
}

function selectedTab(state = 'Players', action) {
  if(action.type === actionTypes.selectTab) {
    return action.payload.tabName || state;
  }
  return state;
}

const defaultPlayersTabOptions = {
  showAll: false,
  showVectorLimited: false,
  showNote: {0: false, 1: false, '-1': false, '-2': false, 3: false, '-3': false},
  sorts: [],
}
function playersTabOptions(state = defaultPlayersTabOptions, action) {
  if(action.type === actionTypes.filterPlayers) {

    if(action.payload.name === 'note') {
      return {
        ...state,
        showNote: {
          ...state.showNote,
          [action.payload.value]: !state.showNote[action.payload.value],
        },
      }
    } else {
      return {
        ...state,
        [action.payload.name]: action.payload.value || false,
      }
    }
  } else if(action.type === actionTypes.sortPlayers) {
    return {
      ...state,
      sorts: [
        ...state.sorts.filter(item => !item.startsWith(action.payload.value.split('.')[0])),
        action.payload.value,
      ],
    }
  } else if(action.type === firebaseActionTypes.dataReceived && action.dataType === 'privateUserInfo') {
    const {data = {}} = action;
    const {privateUserInfo = {}} = data;
    const {sorts = []} = privateUserInfo;
    return {...state, sorts}
  }
  return state;
}

const defaultTeamsTabOptions = {
  activeTeam: 0,
  activeStat: 0,
}
function teamsTabOptions(state = defaultTeamsTabOptions, action) {
  if(action.type === actionTypes.viewTeamRoster) {
    return {
      ...state,
      activeTeam: action.payload.teamId,
    }
  } else if(action.type === actionTypes.viewTeamStat) {
    return {
      ...state,
      activeStat: action.payload.statId,
    }
  }
  return state;
}

const defaultRightRailOptions = {
  expandedDetail: false,
}
function rightRailOptions(state = defaultRightRailOptions, action) {
  if(action.type === actionTypes.toggleSection && action.payload.section === 'playerDetail') {
    return {
      ...state,
      expandedDetail: !state.expandedDetail,
    }
  }
  return state;
}

const defaultDashboardOptions = {
  searchTerm: '',
  teamNameEditId: 0,
  teamBaggageAssignId: 0,
  topScoreFormOpen: false,
  topScoreCsrf: '',
  topScoreClientId: '',
  topScoreAjax: {
    inProgress: false,
    success: false,
    teamCount: 0,
    results: [],
  }
}
function dashboardTabOptions(state = defaultDashboardOptions, action) {
  if(action.type === actionTypes.searchPlayers) {
    return {
      ...state,
      searchTerm: action.payload.term,
    }
  } else if(action.type === actionTypes.selectPlayer) {
    return {
      ...state,
      searchTerm: '',
    }
  } else if(action.type === actionTypes.toggleEditTeamName) {
    return {
      ...state,
      teamNameEditId: action.payload.teamId || -0,
      teamBaggageAssignId: 0,
    }
  } else if(action.type === actionTypes.toggleAssignBaggage) {
    return {
      ...state,
      teamNameEditId: 0,
      teamBaggageAssignId: action.payload.teamId || 0,
    }
  } else if(action.type === actionTypes.toggleTopScoreForm) {
    return {
      ...state,
      topScoreFormOpen: !state.topScoreFormOpen,
    }
  } else if(action.type === actionTypes.updateApiCsrf) {
    return {
      ...state,
      topScoreCsrf: action.payload.csrf,
    }
  } else if(action.type === actionTypes.updateApiClientId) {
    return {
      ...state,
      topScoreClientId: action.payload.clientId,
    }
  } else if(action.type === actionTypes.topScoreUpdate) {

    const {isPre} = action.payload;

    if(isPre) {
      const {teamCount} = action.payload;

      return {
        ...state,
        topScoreAjax: {
          inProgress: true,
          success: false,
          teamCount,
          results: [],
        },
      }

    } else {

      const {success, playerCount, name} = action.payload;
      const {teamCount} = state.topScoreAjax;

      const results = [
        ...state.topScoreAjax.results,
        {success, name, playerCount}
      ];

      const inProgress = results.length < teamCount;
      const overallSuccess = !inProgress && !results.find(result => !result.success);

      return {
        ...state,
        topScoreAjax: {
          inProgress,
          success: overallSuccess,
          teamCount,
          results,
        },
      }
    }

    return {
      ...state,
      topScoreCsrf: action.payload.csrf,
    }
  }
  return state;
}


export default combineReducers({
  contextTeamId,
  selectedPlayerId,
  selectedTeamId,
  selectedTab,
  rightRailOptions,
  playersTabOptions,
  teamsTabOptions,
  dashboardTabOptions,
});
