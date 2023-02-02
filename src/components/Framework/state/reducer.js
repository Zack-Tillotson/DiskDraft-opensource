import {combineReducers} from 'redux';
import actionTypes from './actionTypes';

const defaultMenuState = {
  isNavOpen: false,
}

function menu(state = defaultMenuState, action) {
  if(action.type === actionTypes.toggleMenu) {
    return {
      ...state,
      isNavOpen: !state.isNavOpen,
    }
  } else if(action.type === actionTypes.routeChanged) {
    return {
      ...state,
      isNavOpen: false,
    }
  }
  return state;
}

export default combineReducers({
  menu,
});