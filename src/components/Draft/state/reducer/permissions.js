// Used to keep track of the user permissions on this draft. i.e. is this user
// an admin or not for this draft's organization.

import {combineReducers} from 'redux';

import actionTypes from '../actionTypes';
import fbActionTypes from '../../../../firebase/actionTypes';

function isAdmin(state = false, action) {
  if(action.type === fbActionTypes.dataReceived && action.dataType === 'organizationAdmin') {
    return !!action.data;
  }
  return state;
}

export default combineReducers({
  isAdmin,
});