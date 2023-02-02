import React from 'react';
import PropTypes from 'prop-types';

import InlineCss from "react-inline-css";
import styles from './styles';

import {connect} from 'react-redux';
import dashboardSelector from '../../state/selector';
import dashboardDispatcher from '../../state/dispatcher';

import Layout from '../Layout';

import {Link} from 'react-router-dom';

import OrganizationForm from '../../OrganizationForm';
import OrganizationLink from '../../OrganizationLink';
import OrganizationTitle from '../../OrganizationTitle';
import OrganizationMembers from '../../OrganizationMembers';

import EventList from '../../EventList';

class DashboardPage extends React.Component {
  static propTypes = {

    // From firebase selector

    firebase: PropTypes.object.isRequired,

    // From local dashboard selector

    isSynced: PropTypes.bool, // Is the organization list synced
    organizations: PropTypes.array.isRequired,
    activeOrgPath: PropTypes.string.isRequired, // The key of the currently active organization

  };

  // Lifecylce hooks //

  activeOrgPath = null; // Used to monitor and refresh the active organization

  componentDidMount() {
    this.ensureFreshEvents(this.props);
  }

  componentWillReceiveProps(newProps) {
    this.ensureFreshEvents(newProps);
  }

  // Data management //

  // If we have a new active organization then refresh via the topscore API
  ensureFreshEvents = (props) => {
    if(props.activeOrgPath) {
      if(this.activeOrgPath !== props.activeOrgPath) {
        this.activeOrgPath = props.activeOrgPath;
        const activeOrg = props.organizations.find(org => org.pathKey === props.activeOrgPath);
        this.props.refreshOrganizationEvents(activeOrg);
      }
    }
  };

  handleActiveOrganizationSelect = (orgKey) => {
    this.props.activateOrganization(orgKey);
  };

  handleAddOrganizationMember = () => {
    this.props.addOrganizationMember(this.getActiveOrganization());
  };

  handleCloseAddOrganizationMember = () => {
    this.props.closeAddOrganizationMember();
  };

  getActiveOrganization = () => {
    return this.props.organizations.find(org => org.pathKey === this.props.activeOrgPath);
  };

  // Renders //

  render() {

    const activeOrganization = this.getActiveOrganization();
    const {
      organizations,
      isSynced,
      ui,
      joinOrg,
    } = this.props;

    return (
      <Layout {...this.props}>
        <InlineCss stylesheet={styles} componentName="container">

          {activeOrganization && (
            <div className="activeOrganization">

              <OrganizationTitle {...activeOrganization} />

              <h3>List of Events</h3>
              <EventList
                organizationId={activeOrganization.pathKey}
                events={activeOrganization.events}
                ui={ui}
                paginateOrgEvents={this.props.paginateOrgEvents} />

              <h3>Members</h3>
              <OrganizationMembers
                members={activeOrganization.members}
                newMemberKey={joinOrg.addOrgMember}
                onAddMember={this.handleAddOrganizationMember}
                onAddMemberClose={this.handleCloseAddOrganizationMember} />

            </div>
          )}

          {organizations.length === 0 && (
            <div className="noOrganizations">
              <h1>Welcome To DiskDraft</h1>
              <div className="welcomeContainer">
                <h2><i className="material-icons">directions_run</i> Captains</h2>
                <div className="mainPoint">Trying to view a specific draft?</div>
                <div className="subPoint">Use the link your league organizer sent you or go to the <a href="/joinDraft">Join A Draft</a> page and use the code your league organizer sends you.</div>
              </div>
              <div className="welcomeContainer">
                <h2><i className="material-icons">star</i> League Organizers</h2>
                <div className="mainPoint">Has someone already set up an organization in DiskDraft?</div>
                <div className="subPoint">Ask them to create a 'Join Organization' link for you. You could set up your own organization but it's easier to share drafts if you join theirs.</div>
                <div className="mainPoint">Otherwise setup your own organization</div>
                <div className="subPoint">Creating an organization allows you to import league information from your TopScore website, create drafts to share, and run the draft with captains.</div>
                <div className="addLink">
                  <Link to="/dashboard/organizations/form/">
                    <i className="material-icons">add</i> Create Organization
                  </Link>
                </div>
              </div>
            </div>
          )}
        </InlineCss>
      </Layout>
    );
  }
}

export default connect(dashboardSelector, dashboardDispatcher)(DashboardPage);