import React from 'react';

import Page from '../Page';
import LoginForm from '../LoginForm';
import FirebaseStatus from '../FirebaseStatus';

class Preferences extends React.Component {
  render() {
    return (
      <Page>
        <LoginForm />
        <FirebaseStatus />
      </Page>
    );
  }
}

export default Preferences;