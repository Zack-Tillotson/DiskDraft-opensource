import React from 'react';
import PropTypes from 'prop-types';

import InlineCss from "react-inline-css";
import styles from './styles';
import DraftStatus from '../../Shared/components/DraftStatus';
import Image from 'react-imageloader';

class Event extends React.Component {
  static propTypes = {
    organization: PropTypes.object.isRequired,
    event: PropTypes.object.isRequired,
    eventStatus: PropTypes.object.isRequired,
    createDraft: PropTypes.func.isRequired,
    viewDraftSetup: PropTypes.func.isRequired,
    removeDraft: PropTypes.func.isRequired,
  };

  handleCreateClick = () => {
    this.props.createDraft(this.props.organization, this.props.event);
  };

  handleViewClick = () => {
    this.props.viewDraft(this.props.event);
  };

  handleViewSetupClick = () => {
    this.props.viewDraftSetup(this.props.event);
  };

  handleRemoveClick = () => {
    this.props.removeDraft(this.props.organization, this.props.event);
  };

  getDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {month: 'short', day: 'numeric', year: 'numeric'});
  };

  render() {

    const {organization, event, eventStatus} = this.props;

    const eventTypeWord = event.eventType === 'tournament' ? 'Tournament' : 'League';

    return (
      <InlineCss
        stylesheet={styles}
        componentName="container"
        className={`event`}>

        <div className="eventInfo">
          <div className="eventImage">
            <Image className="sessionImg" src={event.image200}>
              <img src="/assets/default-user.jpg" />
            </Image>
          </div>
          <div className="eventDetails">
            <h2>{event.name}</h2>
            <div className="eventWhen">{this.getDate(event.start)} to {this.getDate(event.end)}</div>
            <div className="regEnds">Registration starts {this.getDate(event.regOpen)}</div>
          </div>
        </div>

        <DraftStatus
          status={eventStatus}
          onCreate={this.handleCreateClick}
          onView={this.handleViewClick}
          onViewSetup={this.handleViewSetupClick}
          onRemove={this.handleRemoveClick} />

      </InlineCss>
    );
  }
}

export default Event;