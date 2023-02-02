import React from 'react';

import InlineCss from "react-inline-css";
import styles from './styles';

import {Link} from 'react-router-dom';
import EventCard from '../EventCard';

class EventList extends React.Component {
  static propTypes = {

  };

  getEventPage = () => {
    const {events, ui} = this.props;

    const start = (ui.orgEventsPage - 1) * ui.orgEventsPageSize;

    return events.slice(start, start + ui.orgEventsPageSize);
  };

  getPaginationControls = () => {

    const {events, ui, paginateOrgEvents} = this.props;

    const hasPrev = ui.orgEventsPage > 1;
    const hasNext = ui.orgEventsPage < events.length / ui.orgEventsPageSize;

    return (
      <div className="paginationControls">
        {hasPrev && (
          <div className="prevPage" onClick={paginateOrgEvents.bind(this, false)}>«</div>
        )}
        <div className="currentPage">Page {ui.orgEventsPage}</div>
        {hasNext && (
          <div className="nextPage" onClick={paginateOrgEvents.bind(this, true)}>»</div>
        )}
      </div>
    );
  };

  // Renders //

  render() {

    const {events, ui, organizationId, onViewClick, onEditClick} = this.props;

    return (
      <InlineCss stylesheet={styles} componentName="container" className="organizationList">

        <div className="eventList">
          {this.getEventPage().map(orgEvent => (
            <EventCard
              key={orgEvent.id}
              {...orgEvent}
              organizationId={organizationId} />
          ))}
        </div>

        {events.length > ui.orgEventsPageSize && this.getPaginationControls()}

        {events.length === 0 && (
          <div className="noEvents">
            No Events
          </div>
        )}

      </InlineCss>
    );
  }
}

export default EventList;