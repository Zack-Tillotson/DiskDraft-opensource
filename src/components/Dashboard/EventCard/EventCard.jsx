import React from 'react';
import PropTypes from 'prop-types';

import InlineCss from "react-inline-css";
import styles from './styles';

import {Link} from 'react-router-dom';

class EventCard extends React.Component {
  static propTypes = {

    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    organizationId: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    start: PropTypes.string.isRequired,
    end: PropTypes.string.isRequired,
    regOpen: PropTypes.string,
    image200: PropTypes.string.isRequired,
    eventType: PropTypes.string.isRequired,
  };

  // Renders //

  getDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {month: 'short', day: 'numeric', year: 'numeric'});
  };

  render() {

    const {
      organizationId,
      id,
      name,
      start,
      end,
      regOpen,
      image200,
      eventType,
    } = this.props;

    const eventTypeWord = eventType === 'tournament' ? 'Tournament' : 'League';

    const pastClass = Date.now() - new Date(start).getTime() > 0 ? 'past' : 'future';

    return (
      <InlineCss
        stylesheet={styles}
        componentName="container"
        className={`eventCard ${pastClass}`}>
          <Link to={`/dashboard/organizations/${organizationId}/event/${id}/`}>
            <div className="eventImage" style={{backgroundImage: `url('${image200}')`}}>
            </div>
            <div className="eventDetails">
              <div className="eventName">{name}</div>
              <div className="eventType">{eventTypeWord}</div>
              <div className="eventWhen">{this.getDate(start)} to {this.getDate(end)}</div>
              <div className="regEnds">Registration starts {this.getDate(regOpen)}</div>
            </div>
        </Link>
      </InlineCss>
    );
  }
}

export default EventCard;