import React from 'react';
import InlineCss from "react-inline-css";
import {connect} from 'react-redux';

import styles from './styles';
import selector from './selector.js';

class FirebaseStatus extends React.Component {
  render() {
    return (
      <InlineCss stylesheet={styles} componentName="component">
        <table>
          <tbody>
            <tr>
              <td>Connection</td>
              <td>{this.props.connected ? 'Online' : 'Offline'}</td>
            </tr>
            <tr>
              <td>Lag</td>
              <td>{this.props.serverTimeOffset}</td>
            </tr>
            <tr>
              <td>Authentication</td>
              <td>{this.props.isLoggedIn ? 'Authenticated' : 'Unauthenticated'}</td>
            </tr>
            <tr>
              <td>Authentication Provider</td>
              <td>{this.props.authProvider}</td>
            </tr>
            <tr>
              <td>Data</td>
              <td>{this.props.data}</td>
            </tr>
          </tbody>
        </table>
      </InlineCss>
    );
  }
}

export default connect(selector)(FirebaseStatus);