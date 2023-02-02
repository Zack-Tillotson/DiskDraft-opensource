import actionTypes from './actionTypes';

function getInitialState() {
  return {
    isLoggedIn: false,
    authConnected: false,
    dataConnected: false,
    connected: false,
    serverTimeOffset: 0
  }
}

export default (state = getInitialState(), action) => {
  switch(action.type) {
    case actionTypes.dataReceived:
      if(action.path === '.info/auth') {
        return {...state, isLoggedIn: !!action.data.uid, authInfo: action.data, authConnected: true};
      } else if(action.path === '.info/connected') {
        return {...state, connected: action.data};
      } else if(action.path === '.info/serverTimeOffset') {
        return {...state, serverTimeOffset: action.data};
      } else if(action.path === 'connected') {
        return {...state, dataConnected: action.data};
      }
  }
  return state;
}