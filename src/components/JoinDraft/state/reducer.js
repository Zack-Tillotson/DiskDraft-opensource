import {combineReducers} from 'redux';

import actionTypes from './actionTypes';
import firebaseActionTypes from '../../../firebase/actionTypes';
import frameworkActionTypes from '../../Framework/state/actionTypes';

const defaultFormState = {
  input: '',
  inProgress: false,
  isError: false,
}

function form(state = defaultFormState, action) {

  if(action.type === frameworkActionTypes.routeChanged) {
    return defaultFormState;
  } else if(action.type === actionTypes.inputChanged) {
    return {
      ...state,
      input: action.payload.input,
      isError: false,
    }
  } else if(action.type === actionTypes.formSubmitted) {

    const {inProgress} = action.payload;
    const isError = !inProgress;
    return {
      ...state,
      inProgress,
      isError,
    }
  }

  return state;
}

export default combineReducers({
  form,
});