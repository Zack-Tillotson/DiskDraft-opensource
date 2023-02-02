import React from 'react';
import PropTypes from 'prop-types';
import InlineCss from "react-inline-css";

import {connect} from 'react-redux';

import styles from './styles';
import selector from './selector';
import dispatcher from '../../../firebase/dispatcher';

class LoginForm extends React.Component {
  static propTypes = {
    authConnected: PropTypes.bool.isRequired,
    isLoggedIn: PropTypes.bool.isRequired,
  };

  render() {

    const services = ['google', 'facebook', 'twitter'];

    return (
      <InlineCss stylesheet={styles} componentName="container">

        {this.props.authConnected && (

          <div className="authConnected">

            <h3>Connect to DiskDraft With:</h3>

            <div className="loginSection">
              {services.map(service => {
                const activeClass = this.props.authProvider == service ? 'active' : '';
                return (
                  <div
                    key={service}
                    className={["loginOption", service, activeClass].join(' ')}
                    onClick={this.props.requestLogin.bind(this, service)}>
                    <div className="serviceName">{service}</div>
                  </div>
                );
              })}
            </div>

            {this.props.isLoggedIn && (
              <div className="logoutSection" onClick={this.props.requestLogout}>
                Logout
              </div>
            )}

          </div>
        )}

        {!this.props.authConnected && (
          <div className="authNotConnected">
            Loading, please wait...
          </div>
        )}

      </InlineCss>
    );
  }
}

export default connect(selector, dispatcher)(LoginForm);