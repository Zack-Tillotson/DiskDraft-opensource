import { createStore, applyMiddleware, combineReducers, compose } from 'redux';
import ThunkMiddleware from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';

import rootReducer from './reducer';

const middleware = [
  ThunkMiddleware,
];

export default function configureStore() {
  const store = createStore(rootReducer, composeWithDevTools(applyMiddleware(...middleware)));
  return store;
}