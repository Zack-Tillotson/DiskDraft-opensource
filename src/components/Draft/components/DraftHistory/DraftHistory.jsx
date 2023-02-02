import React from 'react';
import PropTypes from 'prop-types';

import InlineCss from "react-inline-css";
import styles from './styles';

class DraftHistory extends React.Component {
  static propTypes = {
    priorDraftOrder: PropTypes.array.isRequired,
  };

  // Renders //

  renderNumber = (num) => {
    switch(num % 10) {
      case 1: return num + 'st';
      case 2: return num + 'nd';
      case 3: return num + 'rd';
      default: return num + 'th';
    }
  };

  renderPlayerText = (selection) => {
    if(selection.isSkip) {
      return <span className="player skipped">-- skip --</span>;
    }
    return (
      <span className="player">
        #{selection.player.draftId} {selection.player.first_name[0]}. {selection.player.last_name}
      </span>
    );
  };

  render() {

    const {
      priorDraftOrder,
    } = this.props;

    return (
      <InlineCss stylesheet={styles} namespace="draftHistory" componentName="container">
        <h3><i className="material-icons timeIcon">assignment_ind</i> Draft Log</h3>
        {priorDraftOrder.slice(0, 8).map(selection => {
          return (
            <div key={selection.overallSelection} className="selectionItem">
              <span className="position">{this.renderNumber(selection.overallSelection)}</span>
              <span className="teamName">{selection.team.name}</span>
              <div className="player">
                <span className="position" />
                {this.renderPlayerText(selection)}
              </div>
              {!selection.isSkip && selection.player.baggage.length > 0 && (
                <div className="baggagePlayers">
                  {selection.player.baggage.map(player => (
                    <div key={player.id} className="baggagePlayer">
                      <span className="position">+</span>
                      <span key={player.id} className="player">
                        #{player.draftId} {player.first_name[0]}. {player.last_name}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </InlineCss>
    );
  }
}

export default DraftHistory;