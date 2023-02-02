import React from 'react';

import InlineCss from "react-inline-css";
import styles from './styles';

import {connect} from 'react-redux';
import dashboardSelector from '../../state/selector';
import dashboardDispatcher from '../../state/dispatcher';

import Page from '../../../Framework/Page';
import LoginForm from '../../../Framework/LoginForm';

class DashboardPage extends React.Component {
  static propTypes = {

  };

  // Lifecylce hooks //

  componentDidMount() {
    if(this.props.firebase.authInfo) {
      this.syncJoinInformation(this.props);
    }    
  }

  componentWillReceiveProps(newProps) {
    if(!this.props.firebase.isLoggedIn && newProps.firebase.isLoggedIn) {
      this.syncJoinInformation(newProps);
    }
  }

  // Data management //

  // If we have a new active organization then refresh via the topscore API
  syncJoinInformation = (props) => {

    const {joinKey} = props.params;
    const {isLoggedIn} = props.firebase;

    if(isLoggedIn && joinKey) {
      this.props.syncJoinInformation(joinKey);
    }
  };

  getActiveOrganization = () => {
    return this.props.organizations.find(org => org.pathKey === this.props.activeOrgPath);
  };

  // Event handlers //

  handleJoinClick = () => {
    this.props.claimOrganizationInvite(this.props.params.joinKey, this.props.activeOrgPath)
    .then(error => {
      if(!error) {
        window.location = `/dashboard/organizations/form/${this.props.activeOrgPath}/`;
      }
    });
  };

  // Renders //

  getOrganizationInfo = () => {
    const organization = this.getActiveOrganization();
    
    if(!organization) {
      return null;
    }

    return (
      <div className="organizationInfo">
        <h3><span className="orgPrompt">Organization:</span> {organization.config.name}</h3>
      </div>
    );
  };

  render() {
    
    const {
      organizations,
      joinOrg,
      firebase,
    } = this.props;

    return (
      <Page showNavigation={false}>
        <InlineCss stylesheet={styles} componentName="container">

          <h1>Join Organization</h1>

          {!firebase.isLoggedIn && (
            <div className="requiresLogin">
              <div className="loginRequirementExplanation">
                You have been invited to join a DiskDraft organization. Please log in to continue.
              </div>
              <LoginForm />
            </div>
          )}

          {firebase.isLoggedIn && !joinOrg.joinSuccessful && (
            <div className="readyToJoin">
              {this.getOrganizationInfo()}
              {joinOrg.isRequesting && (
                <div className="spinner">Joining...</div>
              )}
              {!joinOrg.isRequesting && (
                <div className="joinControls" onClick={this.handleJoinClick}>Join Organization</div>
              )}
            </div>
          )}

          {firebase.isLoggedIn && joinOrg.joinSuccessful && (
            <div className="readyToJoin">
              {this.getOrganizationInfo()}
              <div className="joinMessage">Success</div>
            </div>
          )}

        </InlineCss>
      </Page>
    );
  }
}

export default connect(dashboardSelector, dashboardDispatcher)(DashboardPage);