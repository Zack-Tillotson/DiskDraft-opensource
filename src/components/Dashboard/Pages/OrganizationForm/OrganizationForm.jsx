import React from 'react';
import PropTypes from 'prop-types';

import InlineCss from "react-inline-css";
import styles from './styles';

import {connect} from 'react-redux';
import dashboardSelector from '../../state/selector';
import dashboardDispatcher from '../../state/dispatcher';

import {Link, withRouter} from 'react-router';
import Layout from '../Layout';
import OrganizationForm from '../../OrganizationForm';

class OrganizationFormPage extends React.Component {
  static propTypes = {

    // From react-router

    params: PropTypes.object.isRequired,

    // From firebase selector

    firebase: PropTypes.object.isRequired,

    // From local dashboard selector
    organizations: PropTypes.array.isRequired,
    userOrganizations: PropTypes.object.isRequired,
    activeOrgPath: PropTypes.string.isRequired, // The key of the currently active organization

  };

  state = {
    isInitialized: false,
  };

  // Lifecylce hooks //

  componentDidMount() {

    const activeOrganization = this.getActiveOrganization();

    if(activeOrganization.pathKey) {
      if(this.props.ensureFormInitialized(activeOrganization, this.props.userOrganizations)) {
        this.setState({isInitialized: true});
      }
    }
  }

  componentWillReceiveProps(newProps) {

    const activeOrganization = this.getActiveOrganization(newProps);

    if(!this.state.isInitialized && !!activeOrganization.pathKey) {
      if(newProps.ensureFormInitialized(activeOrganization, newProps.userOrganizations)) {
        this.setState({isInitialized: true});
      }
    }
  }

  // Data management //

  getActiveOrganization = (props = this.props) => {
    const activeOrg = props.organizations.find(org => org.pathKey === props.params.organizationId);
    return activeOrg || {};
  };

  getIsOwner = () => {
    const {authInfo = {}} = this.props.firebase;
    const {uid} = authInfo;
    const activeOrg = this.getActiveOrganization();
    return !activeOrg.owner || uid === activeOrg.owner;
  };

  // Event handlers //

  handleFormValidation = (organizationData) => {
    this.props.validateOrganizationForm(organizationData);
  };

  handleFormSubmit = (organizationData) => {
    this.props.submitOrganizationForm(organizationData)
      .then(result => this.props.router.push('/dashboard/organizations/'));
  };

  handleDeleteClick = () => {
    if(window.confirm("Deletion is permanent, are you sure?")) {
      this.props.deleteOrganization(this.getActiveOrganization())
        .then(result => {
          this.props.router.push('/dashboard/organizations/');
        });
    }
  };

  // Renders //

  render() {

    const formState = this.props.organizationForm;
    const organizationName = this.getActiveOrganization().name || 'New Organization';

    return (
      <InlineCss stylesheet={styles} componentName="container">
        <Layout {...this.props}>
          {!this.props.isSynced && (
            <div className="loadingMessage">
              Loading dashboard data...
            </div>
          ) || (
            <div className="postLoadContent">
              <OrganizationForm
                key={formState.pathKey}
                form={formState}
                isOwner={this.getIsOwner()}
                onValidate={this.handleFormValidation}
                onSubmit={this.handleFormSubmit}
                onDeleteClick={this.handleDeleteClick} />
            </div>
          )}
        </Layout>
      </InlineCss>
    );
  }
}

export default withRouter(connect(dashboardSelector, dashboardDispatcher)(OrganizationFormPage));