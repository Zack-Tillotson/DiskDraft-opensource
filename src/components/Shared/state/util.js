import actionTypes from '../../../firebase/actionTypes';
import firebaseSelector from '../../../firebase/selector';

///////// Utility functions ////////

function onDataReceived(dispatch, dataType) {
  return function(result) {
    if(result && !result.error) {
      dispatch({
        ...result,
        type: actionTypes.dataReceived, 
        dataType, 
      });
    } else {
      onError(dispatch, dataType)(result);
    }
  }
}

function onUpdateComplete(dispatch, dataType) {
  return function(error, success, snapshot) {
    if(error || !success) {
      dispatch({
        type: actionTypes.dataReceived, 
        dataType,
        error, 
      });
    } else {
      dispatch({
        type: actionTypes.dataReceived, 
        dataType,
        data: snapshot.val(), 
      });
    }
  }
}

function onError(dispatch, dataType) {
  return function(result) {
    if(result && result.error) {
      dispatch({
        type: actionTypes.dataReceived, 
        dataType, 
        error: result.error,
      });
    } else {
      dispatch({
        type: actionTypes.dataReceived, 
        dataType, 
        error: true,
      });
    }
  }
}

function withFirebase(childFn) {
  return function(...restArgs) {
    return function(dispatch, getState) {
      const state = getState();
      const firebase = firebaseSelector(state);
      return childFn(dispatch, getState, firebase, ...restArgs);
    }
  }
}

export {onDataReceived, onUpdateComplete, onError, withFirebase}
export default {onDataReceived, onUpdateComplete, onError, withFirebase}