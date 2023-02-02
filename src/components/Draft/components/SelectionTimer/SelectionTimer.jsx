import React from 'react';
import PropTypes from 'prop-types';

import InlineCss from "react-inline-css";
import styles from './styles';

import moment from 'moment';

function getNumberEnd(num) {
  switch(num % 10) {
    case 1:
      return 'st';
    case 2:
      return 'nd';
    case 3:
      return 'rd';
    default:
      return 'th';
  }
}

class SelectionTimer extends React.Component {
  static propTypes = {
    selectionTime: PropTypes.object.isRequired,
    serverTimeOffset: PropTypes.number.isRequired,
    currentTeam: PropTypes.object.isRequired,
  };

  rerenderTimer = null;

  componentDidMount() {
    this.rerenderTimer = setInterval(this.handleRerenderTimer, 300);
  }

  componentWillUnmount() {
    clearInterval(this.rerenderTimer);
  }

  handleRerenderTimer = () => {
    this.forceUpdate();
  };

  // Renders //

  renderTime = () => {

    const {selectionTime: {startTime}, serverTimeOffset} = this.props;

    return moment(new Date() - startTime + serverTimeOffset).format('mm:ss');

  };

  render() {

    const {
      selectionTime: {
        showClock,
        active,
        startTime,
        warningTime,
        countsDown,
        countDownDuration,
      },
      currentDraftOrder,
    } = this.props;

    if(!showClock) {
      return null;
    }

    return (
      <InlineCss stylesheet={styles} namespace="selectionTimer" componentName="container">
        <div className="clockContainer">
          {currentDraftOrder && (
            <div className="selectionStats">
              <div className="round">Round {currentDraftOrder.round}</div>
              <div className="selection">Pick {currentDraftOrder.selection}</div>
              <div className="overallSelection">{currentDraftOrder.overallSelection}{getNumberEnd(currentDraftOrder.overallSelection)} Overall</div>
            </div>
          )}
          {!active && (
            <div className="inactiveClock">Paused</div>
          )}
          {active && (
            <div className="activeClock">{this.renderTime()}</div>
          )}
        </div>
      </InlineCss>
    );
  }
}

export default SelectionTimer;
