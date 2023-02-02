import actions from './actions';

export default function(dispatch, ownProps) {
  return {

    toggleMenu() {
      dispatch(actions.toggleMenu());
    },

    routeChanged() {
      dispatch(actions.routeChanged());
      window.scrollTo(0, 0);
    },

  }
}