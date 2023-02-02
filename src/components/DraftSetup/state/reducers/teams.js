import actionTypes from '../actionTypes';
import firebaseActionTypes from '../../../../firebase/actionTypes';

function teams(state = [], action) {
  if(action.type === firebaseActionTypes.dataReceived && action.dataType === 'draftMeta') {
    const {data = {}} = action;
    const {draftData = {}} = data;
    const {teams = {}} = draftData;
    return teams;
  } else if(action.type === actionTypes.importTopScoreData && action.dataType === 'teams' && action.success) {
    const {teams = []} = action;
    return teams;
  }
  return state; 
}

export default teams;