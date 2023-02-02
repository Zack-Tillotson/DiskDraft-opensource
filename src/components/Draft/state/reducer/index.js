// This reducer works in three parts
//
// 1. The basic state reducers. These are fundamental atoms of the state such as db information or ui selections. When this information changes the whole state is recalculated.
// 2. The pipeline reducers. These are building blocks which are built in order.
// 3. The higher order reducers. These are finished, easily digestable state pieces.

import {combineReducers} from 'redux';
import actionTypes from '../actionTypes';
import firebaseActionTypes from '../../../../firebase/actionTypes';

import firebaseReducer from './firebase';
import {
  sessionsFirebaseReducer,
  settingsFirebaseReducer,
  privateUserFirebaseReducer,
  orgConfigFirebaseReducer,
} from './firebase';
import uiReducer from './ui';
import permissions from './permissions';
import isSynced from './isSynced';

import pipelineReducer from './pipeline';
import higherReducer from './higher';

const basicReducer = combineReducers({

  // Directly from Firebase
  players: firebaseReducer('players', []),
  columns: firebaseReducer('columns', []),
  teams: firebaseReducer('teams', []),
  sessions: sessionsFirebaseReducer,
  meta: firebaseReducer('meta', {}),
  assignedBaggage: firebaseReducer('assignedBaggage', []),
  selections: firebaseReducer('selections', []),
  controls: firebaseReducer('controls', {}),
  joinDraft: firebaseReducer('joinDraft', {}),
  settings: settingsFirebaseReducer,
  privateUser: privateUserFirebaseReducer,
  organization: orgConfigFirebaseReducer,

  // Firebase meta information
  permissions,
  isSynced,

  // UI
  ui: uiReducer,

});

function reducer(state = {}, action) {
  const {basic, higher} = state;

  const nextBasic = basicReducer(basic, action);

  // If none of the basic state has changed then we can keep the higher lvl state
  if(nextBasic === state.basic) {
    return state;
  }

  // Intermediary state which we don't need to store
  const nextPipeline = pipelineReducer(nextBasic, action);

  // Usable state
  const nextHigher = higherReducer(nextBasic, nextPipeline, action);

  return {basic: nextBasic, higher: nextHigher}
}

export default reducer;