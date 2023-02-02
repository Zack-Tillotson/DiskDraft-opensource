import React from 'react';

import {connect} from 'react-redux';
import selector from '../../state/selector';
import dispatcher from '../../state/dispatcher';

import Layout from '../Layout';
import EditSettings from '../../components/EditSettings';

class SettingsPage extends React.Component {
  getSettings = (section) => {
    return this.props.settings.filter(setting => setting.location === section);
  };

  // Renders //

  render() {

    return (
      <Layout {...this.props} step="settings">

        <h2>Settings</h2>

        <div className="section">
          <h3>Draft Management</h3>
          <EditSettings
            settings={this.getSettings('draftManagement')}
            onChange={this.props.changeSetting} />
        </div>

        <div className="section">
          <h3>Security</h3>
          <EditSettings
            settings={this.getSettings('security')}
            onChange={this.props.changeSetting} />
        </div>

      </Layout>
    );
  }
}

export default connect(selector, dispatcher)(SettingsPage);