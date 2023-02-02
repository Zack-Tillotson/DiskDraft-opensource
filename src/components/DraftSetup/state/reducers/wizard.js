import actionTypes from '../actionTypes';
import firebaseActionTypes from '../../../../firebase/actionTypes';

const defaultWizardState = {
  stepsComplete: {
    players: false,
    columns: false,
    teams: false,
    settings: false,
  },
  isRequesting: false,
  playerStep: {
    topScoreImportSuccessful: null, // Null means not yet attempted, true and false mean success or not
    csvImportSuccessful: null, // Null means not yet attempted, true and false mean success or not
  },
  columnStep: {
    activePlayerIndex: 0,
    orgImport: false,
  },
  teamStep: {
    topScoreImportSuccessful: null, // Null means not yet attempted, true and false mean success or not
  },
}

function wizard(state = defaultWizardState, action) {

  if(action.type === firebaseActionTypes.dataReceived && action.dataType === 'draftMeta') {

    const {data = {}} = action;
    const {draftData = {}} = data;
    const {stepsComplete = defaultWizardState.stepsComplete} = draftData;

    if(stepsComplete) {
      return {
        ...state,
        stepsComplete,
      }
    }

  } else if(action.type === actionTypes.requestStarting) {
    const {requestEndpoint} = action;

    let ret = {
      ...state,
      isRequesting: true,
    }

    if(requestEndpoint && requestEndpoint === 'players') {
      ret = {
        ...ret,
        playerStep: {
          ...ret.playerStep,
          topScoreImportSuccessful: null,
        }
      }
    } else if(requestEndpoint && requestEndpoint === 'teams') {
      ret = {
        ...ret,
        teamStep: {
          ...ret.teamStep,
          topScoreImportSuccessful: null,
        }
      }
    } else if(requestEndpoint && requestEndpoint === 'csv') {
      ret = {
        ...ret,
        playerStep: {
          ...ret.playerStep,
          csvImportSuccessful: null,
        }
      }
    }

    return ret;

  } else if(action.type === actionTypes.importTopScoreData) {
    if(action.dataType === 'players') {
      return {
        ...state,
        isRequesting: false,
        playerStep: {
          ...state.playerStep,
          topScoreImportSuccessful: action.success,
        },
      }
    } else {
      return {
        ...state,
        isRequesting: false,
        teamStep: {
          ...state.teamStep,
          topScoreImportSuccessful: action.success,
        },
      }
    }
  } else if(action.type === actionTypes.csvLoaded) {
    return {
      ...state,
      isRequesting: false,
      playerStep: {
        ...state.playerStep,
        csvImportSuccessful: action.success,
      },
    }
  } else if(action.type === actionTypes.selectDetailPlayer) {
    return {
      ...state,
      columnStep: {
        ...state.columnStep,
        activePlayerIndex: action.payload.playerIndex,
      }
    }
  }

  return state;
}

export default wizard;