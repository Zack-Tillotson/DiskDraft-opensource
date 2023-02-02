import React from 'react';
import PropTypes from 'prop-types';

import InlineCss from "react-inline-css";
import styles from './styles';

import {connect} from 'react-redux';
import dashboardSelector from '../../state/selector';
import dashboardDispatcher from '../../state/dispatcher';

import Layout from '../Layout';

import {withRouter} from 'react-router';
import {Link} from 'react-router-dom';
import Event from '../../Event';

class EventPage extends React.Component {
  static propTypes = {

    // From react-router

    params: PropTypes.object.isRequired,

    // From firebase selector

    firebase: PropTypes.object.isRequired,

    // From local dashboard selector
    organizations: PropTypes.array.isRequired,
    activeOrgPath: PropTypes.string.isRequired, // The key of the currently active organization

  };

  // Lifecylce hooks //

  componentDidMount() {
    this.props.beginDraftMetaSync(this.getActiveEvent().draftKey);
  }

  componentWillReceiveProps(newProps) {
    newProps.beginDraftMetaSync(this.getActiveEvent(newProps).draftKey);
  }

  componentWillUnmount() {
    this.props.endDraftMetaSync();
  }

  // Data management //

  getActiveOrganization = (props = this.props) => {
    const activeOrganization = props.organizations.find(org => org.pathKey === props.params.organizationId);
    return activeOrganization || {};
  };

  getActiveEvent = (props = this.props) => {
    const activeOrganization = this.getActiveOrganization(props);
    const events = activeOrganization.events || [];
    const activeEvent = events.find(eventt => eventt.id == props.params.eventId);
    return activeEvent || {};
  };

  getEventStatus = (props = this.props) => {
    return props.draftMeta;
  };

  // Event handlers //

  handleCreateDraft = (organization, event) => {
    this.props.createDraft(organization, event)
      .then(result => {
        if(result.committed) {
          const draftKey = result.snapshot.val();
          this.props.router.push(`/draftSetup/${draftKey}/`);
        }
      });
  };

  handleViewDraft = (event) => {
    const {draftKey} = event;
    this.props.router.push(`/draft/${draftKey}/`);
  };

  handleViewDraftSetup = (event) => {
    const {draftKey} = event;
    this.props.router.push(`/draftSetup/${draftKey}/`);
  };

  handleRemoveDraft = (organization, event) => {
    this.props.removeDraft(organization, event);
  };

  // Renders //

  render() {

    const eventName = this.getActiveEvent().name || 'Event';

    return (
      <Layout {...this.props}>
        <InlineCss stylesheet={styles} componentName="container">

          <Event
            organization={this.getActiveOrganization()}
            event={this.getActiveEvent()}
            eventStatus={this.getEventStatus()}
            createDraft={this.handleCreateDraft}
            viewDraft={this.handleViewDraft}
            viewDraftSetup={this.handleViewDraftSetup}
            removeDraft={this.handleRemoveDraft} />

        </InlineCss>
      </Layout>
    );
  }
}

export default withRouter(connect(dashboardSelector, dashboardDispatcher)(EventPage));