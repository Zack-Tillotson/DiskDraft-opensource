import actionTypes from './actionTypes';

function toggleMenu() {
  return {type: actionTypes.toggleMenu}
}

function routeChanged() {
  return {type: actionTypes.routeChanged}
}

export default {
  toggleMenu,
  routeChanged,
}