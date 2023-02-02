import firebaseActionTypes from '../../../../firebase/actionTypes';

const defaultIsSyncedState = {
  draft: false,
}

function isSynced(state = defaultIsSyncedState, action) {
  if(action.type === firebaseActionTypes.dataReceived) {
    const {dataType} = action;
    if(Object.keys(defaultIsSyncedState).indexOf(dataType) >= 0) {
      return {
        ...state,
        [dataType]: true
      };
    }
  }
  return state;
}

export default isSynced;