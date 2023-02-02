import actionTypes from '../../../../firebase/actionTypes';
import settingTypes from '../../../DraftSetup/settingTypes';

// These reducers are used to sync low order Firebase data objects. They are
// identified by their dataType name and are pulled as is. Higher order reducers
// can then use them to do more intelligent state transitions.
export default function(dataType, defaultState = null) {
  return function(state = defaultState, action) {
    if(action.type === actionTypes.dataReceived && action.dataType === 'draft') {
      return ensureDataType(action.data[dataType], defaultState) || defaultState;
    }
    return state;
  }
}

function ensureDataType(data, defaultState) {
  if(defaultState instanceof Array && !(data instanceof Array) && !!data) {
    return Object.keys(data).map(key => ({...data[key], key})); // Keeps order
  } else {
    return data;
  }
}

const defaultSettings = {};
settingTypes.forEach(setting => defaultSettings[setting.id] = setting.value);

export function settingsFirebaseReducer(state = defaultSettings, action) {
  if(action.type === actionTypes.dataReceived && action.dataType === 'draft') {
    const settings = {};

    if(action.data.settings) {
      action.data.settings.forEach(setting => settings[setting.id] = setting.value);
    }

    return {...defaultSettings, ...settings};

  }
  return state;
}

export function sessionsFirebaseReducer(state = {}, action) {

  if(action.type === actionTypes.dataReceived && action.dataType === 'draft') {

    const newSessions = {};
    Object.keys(action.data.sessions).forEach(uid => {
      newSessions[uid] = {
        ...state[uid],
        ...action.data.sessions[uid]
      }
    });

    return newSessions;

  } else if(action.type === actionTypes.dataReceived && action.dataType.startsWith('users.')) {

    const uid = action.dataType.slice(6);

    return {
      ...state,
      [uid]: {
        ...state[uid],
        ...action.data,
      }
    }

  }
  return state;
}

export function privateUserFirebaseReducer(state = {}, action) {
  if(action.type === actionTypes.dataReceived && action.dataType === 'privateUserInfo') {
    return {
      ...state,
      ...action.data
    }
  } else if(action.type === actionTypes.dataReceived &&action.dataType === 'privateUserPlayerInfo'){
    return {
      ...state,
      players: action.data,
    }
  }
  return state;
}

export function orgConfigFirebaseReducer(state = {}, action) {

  if(action.type === actionTypes.dataReceived && action.dataType.startsWith('organizationConfig.')) {

    const key = action.dataType.slice('organizationConfig.'.length);

    const {data = {}} = action;

    return {
      ...data,
      key,
    }

    return {};

  } else if(action.type === actionTypes.dataReceived && action.dataType === 'privateOrganizationInfo') {

    return {
      ...state,
      ...action.data,
    }

  }
  return state;
}
