export default (state) => {
  const authProvider = state.firebase.authInfo && state.firebase.authInfo.provider || '';
  const isFullyConnected = state.firebase.dataConnected && state.firebase.connected;
  return {
    ...state.firebase,
    authProvider,
    isFullyConnected,
  };
}