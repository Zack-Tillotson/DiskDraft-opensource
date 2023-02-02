import api from './api';
import actionTypes from './actionTypes';

/////////// Event handlers //////////

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

function onComplete(dispatch, dataType) {
  return function(result) {
    if(!result) {
      dispatch({
        ...result,
        type: actionTypes.dataUpdated,
        dataType,
      });
    } else {
      onError(dispatch, dataType)(result);
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

////////////// Actions /////////////

function syncConnection() {
  return function(dispatch, getState) {
    return api.syncConnection(onDataReceived(dispatch, 'syncConnection'));
  }
}

function requestAuth(service) {
  return function(dispatch, getState) {
    return api.requestAuth(service, onError(dispatch, 'Auth'));
  }
}

function unauth(service) {
  return function(dispatch, getState) {
    return api.requestUnauth();
  }
}

function syncPath(path, dataType) {
  return function(dispatch, getState) {
    return api.syncData(path, dataType, onDataReceived(dispatch, dataType));
  }
}

function unsyncPath(dataType) {
  return function (dispatch, getState) {
    return api.endSyncData(dataType);
  }
}

function pushData(path, dataType, data) {
  return function (dispatch, getState) {
    return api.pushData(path, data, onDataReceived(dispatch, dataType));
  }
}

function setData(path, dataType, value) {
  return function (dispatch, getState) {
    return api.setData(path, value, onComplete(dispatch, dataType));
  }
}

function updateData(path, dataType, updateFn) {
  return function (dispatch, getState) {
    return api.updateData(path, updateFn, onComplete(dispatch, dataType));
  }
}

function deleteData(path, dataType) {
  return function (dispatch, getState) {
    return api.deleteData(path, onError(dispatch, dataType));
  }
}

export default {
  syncConnection,
  requestAuth,
  unauth,
  syncPath,
  unsyncPath,
  pushData,
  setData,
  updateData,
  deleteData,
}