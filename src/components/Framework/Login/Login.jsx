import React from 'react';
import InlineCss from "react-inline-css";

import Page from '../Page';
import LoginForm from '../LoginForm';

import styles from './styles';

class Login extends React.Component {
  render() {
    return (
      <InlineCss stylesheet={styles} componentName="container">
        <Page showNavigation={false}>
          <div className="loginContainer">
            <LoginForm />
            <div className="loginReqExpl">
              <h1>New To DiskDraft?</h1>
              <div className="subhead">Securely connect to DiskDraft through one of these popular services.</div>
              <div className="extras">
                <h3>FAQ</h3>
                <div className="extraItem">
                  <h4>Do I need to register?</h4>
                  <div>No, we're not a commercial organization and don't want your information! We ask you to log only as a means of protecting you.</div>
                </div>
                <div className="extraItem">
                  <h4>What does it cost?</h4>
                  <div>This is a free service!</div>
                </div>
                <div className="extraItem">
                  <h4>Are there technical requirements?</h4>
                  <div>Please use an up-to-date browser, enable third-party cookies, and have a stable internet connection.</div>
                </div>
                <div className="extraItem">
                  <h4>Who can I ask for help?</h4>
                  <div>Please email us at <a href="mailto:ccDiskDraft@gmail.com">ccDiskDraft@gmail.com</a> with any questions or comments.</div>
                </div>
              </div>
            </div>
          </div>
        </Page>
      </InlineCss>
    );
  }
}

export default Login;