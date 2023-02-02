import React from 'react';
import PropTypes from 'prop-types';

import InlineCss from "react-inline-css";
import styles from './styles';

import {connect} from 'react-redux';
import dashboardSelector from '../../state/selector';
import dashboardDispatcher from '../../state/dispatcher';

import Layout from '../Layout';

import { withRouter} from 'react-router';
import {Link} from 'react-router-dom';
import OrganizationTitle from '../../OrganizationTitle';

class OrganizationsPage extends React.Component {
  static propTypes = {

    // From firebase selector

    firebase: PropTypes.object.isRequired,

    // From local dashboard selector
    organizations: PropTypes.array.isRequired,
    activeOrgPath: PropTypes.string.isRequired, // The key of the currently active organization

    activateOrganization: PropTypes.func,

  };

  // Data management //

  handleOrganizationClick = (orgKey) => {
    this.props.activateOrganization(orgKey);
    this.props.router.push('/dashboard/');
  };

  handleOrganizationEditClick = (orgKey) => {
    this.props.router.push(`/dashboard/organizations/form/${orgKey}/`);
  };

  // Renders //

  render() {

    return (
      <Layout {...this.props}>
        <InlineCss stylesheet={styles} componentName="container">

          <div className="organizationList">
            {this.props.organizations.map(organization => (
              <div className="organization" key={organization.path}>
                <OrganizationTitle
                  {...organization}
                  showNavigationControls={true}
                  onClick={this.handleOrganizationClick}
                  onEditClick={this.handleOrganizationEditClick} />
              </div>
            ))}
            {this.props.organizations.length === 0 && (
              <div className="noOrganizations">
                No Organizations
              </div>
            )}
            <div className="newOrganizations">
              <Link to="/dashboard/organizations/form/">+ Add Organization</Link>
            </div>

          </div>

        </InlineCss>
      </Layout>
    );
  }
}

export default withRouter(connect(dashboardSelector, dashboardDispatcher)(OrganizationsPage));