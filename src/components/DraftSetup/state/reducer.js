import pipeline from 'redux-pipeline';

import actionTypes from './actionTypes';
import firebaseActionTypes from '../../../firebase/actionTypes';

import {defaultColumnValues} from '../columnTypes';

import settings from './reducers/settings';
import players from './reducers/players';
import wizard from './reducers/wizard';
import columns from './reducers/columns';
import teams from './reducers/teams';

function draftMeta(state = {}, action) {
  if(action.type === firebaseActionTypes.dataReceived && action.dataType === 'draftMeta') {
    const {data = state} = action;
    const {path = '/'} = action;
    const pathKey = path.split('/')[1];
    return {...data, pathKey};
  }
  return state;
}

function organization(state = {}, action) {
  if(action.type === firebaseActionTypes.dataReceived && action.dataType === 'organization') {
    const {events, config} = action.data;
    return {events, ...config};
  }
  return state; 
}

function userOrganization(state = {}, action) {
  if(action.type === firebaseActionTypes.dataReceived && action.dataType === 'userOrganization') {
    return action.data;
  }
  return state; 
}

const defaultIsSyncedState = {
  draftMeta: false,
  organization: false,
}

function isSynced(state = defaultIsSyncedState, action) {
  if(action.type === firebaseActionTypes.dataReceived) {
    const {dataType} = action;
    if(Object.keys(defaultIsSyncedState).indexOf(dataType) >= 0) {
      return {
        ...state,
        [dataType]: true
      };
    }
  }
  return state;
}

function noOpReducer(state = undefined) {
  return state;
}

function createReducer(reducerShape, activeReducers, isBase = false) {
  return function(state = {}, action) {
    const pipelineState = {};
    Object.keys(reducerShape).forEach(attr => {
      const reducer = activeReducers[attr] || noOpReducer;

      if(action.type === actionTypes.reset && isBase) {
        state = {};
      }

      pipelineState[attr] = reducer(state[attr], action, state);
    });
    return pipelineState;
  }
}

const reducerShape = {
  isSynced,
  draftMeta,
  organization,
  userOrganization,
  wizard,
  columns,
  teams,
  settings,
  players,
};

const stage1 = createReducer(reducerShape, {
  isSynced,
  draftMeta,
  organization,
  userOrganization,
  wizard,
  settings,
}, true);

const stage2 = createReducer(reducerShape, {
  columns,
  teams,
});

const stage3 = createReducer(reducerShape, {
  players,
});

export default pipeline(stage1, stage2, stage3);