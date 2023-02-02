import actionTypes from '../actionTypes';
import firebaseActionTypes from '../../../../firebase/actionTypes';

function draftMeta(state = [], action, nextState) {

  if(action.type === firebaseActionTypes.dataReceived && action.dataType === 'draftMeta') {
    const {data = {}} = action;
    const {draftData = {}} = data;
    const {defaultDraftData = {}} = draftData;
    const {columns = {}, settings = {}} = defaultDraftData;

    return {columns, settings};

  }

  return state; 
}

export default draftMeta;