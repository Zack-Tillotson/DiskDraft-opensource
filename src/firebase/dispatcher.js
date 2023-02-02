import actionTypes from './actionTypes';
import actions from './actions';

// Don't use these methods directly, rather rhis dispatcher should be attached to a 'connected' component, ie:
//
// import actions from '../firebase/actions';
// import actions from '../firebase/selector';
// ...
// export default connect(selector, actions)(Page);

const dispatcher = (dispatch) => {

  return {

    monitorConnection() {
      return dispatch(actions.syncConnection());
    },

    syncData(path) {
      return dispatch(actions.syncData(path));
    },

    requestLogin(service) {
      return dispatch(actions.requestAuth(service));
    },

    requestLogout() {
      return dispatch(actions.unauth());
    },
    
  }
}

export default dispatcher;