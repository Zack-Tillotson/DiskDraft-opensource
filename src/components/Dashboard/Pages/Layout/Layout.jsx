import React from 'react';
import PropTypes from 'prop-types';

import InlineCss from "react-inline-css";
import styles from './styles';

import {connect} from 'react-redux';
import dashboardSelector from '../../state/selector';
import dashboardDispatcher from '../../state/dispatcher';

import {withRouter} from 'react-router';
import {Link} from 'react-router-dom';

import Page from '../../../Framework/Page';

import OrganizationForm from '../../OrganizationForm';
import OrganizationLink from '../../OrganizationLink';
import OrganizationTitle from '../../OrganizationTitle';

import EventCard from '../../EventCard';

class Layout extends React.Component {
  static propTypes = {

    // From firebase selector

    firebase: PropTypes.object.isRequired,

    // From local dashboard selector

    isSynced: PropTypes.bool, // Is the organization list synced
    organizations: PropTypes.array.isRequired,
    activeOrgPath: PropTypes.string.isRequired, // The key of the currently active organization

  };

  // Lifecylce hooks //

  componentDidMount() {
    if(this.props.firebase.authInfo) {
      this.props.beginOrganizationListSync();
    }
    if(this.props.activeOrgPath) {
      this.props.beginOrganizationSync(this.props.activeOrgPath);
    }
  }

  componentWillReceiveProps(newProps) {
    if(!this.props.firebase.authInfo && newProps.firebase.authInfo) {
      newProps.beginOrganizationListSync();
    }
    if(!this.props.activeOrgPath && newProps.activeOrgPath) {
      newProps.beginOrganizationSync(newProps.activeOrgPath);
    }
  }

  // Data management //

  handleActiveOrganizationSelect = (orgKey) => {
    if(this.props.activeOrgPath) {
      this.props.endOrganizationSync(this.props.activeOrgPath);
    }
    this.props.activateOrganization(orgKey);
    this.props.router.push('/dashboard/');
  };

  getActiveOrganization = () => {
    return this.props.organizations.find(org => org.pathKey === this.props.activeOrgPath) || {};
  };

  // Renders //

  getNavigation = () => {

    const activeOrganization = this.getActiveOrganization();
    const {organizations} = this.props;

    return (
      <div className="leftColumn">

        <div className="organizationsTitle">
          Organizations
        </div>

        <div className="organizationsPreview">
          {organizations.map(organization => {
            const isActiveClass = organization.pathKey === activeOrganization.pathKey ? 'active' : '';
            return (
              <div className={`organization ${isActiveClass}`} key={organization.path}>
                <OrganizationLink {...organization} onClick={this.handleActiveOrganizationSelect} />
              </div>
            );
          })}
          {organizations.length === 0 && (
            <div className="noOrganizations">
              No Organizations
            </div>
          )}

          <Link to="/dashboard/organizations/">
            <div className="organizationsLink">
              Manage Organizations
            </div>
          </Link>
        </div>
      </div>
    );
  };

  render() {

    const {isSynced, children} = this.props;

    return (
      <InlineCss stylesheet={styles} componentName="container">
        <Page navigation={this.getNavigation()}>
          {!isSynced && (
            <div className="loadingMessage">
              Loading dashboard data...
            </div>
          ) || (
            <div className="postLoadContent">

              <div className="mainContent">

                {children}

              </div>
            </div>
          )}
        </Page>
      </InlineCss>
    );
  }
}

export default withRouter(connect(dashboardSelector, dashboardDispatcher)(Layout));