import React from 'react';

import { Provider } from 'react-redux';
import store from './state/store';

import Application from './Application';

export default class extends React.Component {
  render() { 
    return (
      <Provider store={store()}>
        <Application />
      </Provider>
    );
  }
}