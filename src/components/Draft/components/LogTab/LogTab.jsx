import React from 'react';
import PropTypes from 'prop-types';

import InlineCss from "react-inline-css";
import PlayerTable from '../../../Shared/components/PlayerTable';

import styles from './styles';

class LogTab extends React.Component {
  static propTypes = {

    selections: PropTypes.array.isRequired,
    isAdmin: PropTypes.bool.isRequired,
    fullHistory: PropTypes.bool.isRequired,

    selectPlayer: PropTypes.func.isRequired,

  };

  handlePlayerSelect = (playerId) => {
    this.props.selectPlayer(playerId);
  };

  // Renders //

  renderPlayer = (player, isSkip) => {
    if(isSkip) {
      return <td className="player skipped">-- skip --</td>;
    }
    return (
      <td className="player" onClick={this.handlePlayerSelect.bind(this, player.draftId)}>
        #{player.draftId} {player.first_name} {player.last_name}
      </td>
    );
  };

  renderSelections = () => {

    const {
      selections,
      isAdmin,
      fullHistory,
      selectPlayer,
    } = this.props;

    const ret = [];

    let priorRound = 0;
    let roundCount = 0;
    selections.slice(0).reverse().forEach((pick, index) => {

      const {team, player, round, selectionOrder, timeTaken, isSkip} = pick;

      if(pick.round !== priorRound) {

        if(!isAdmin && !fullHistory && roundCount > 1) {

          if(roundCount === 2) {
            ret.push(
              <tr className="roundRow">
                <td colSpan={4}>And {selections.length - index} more...</td>
              </tr>
            );
            roundCount++;
          }
          return;
        }

        ret.push(
          <tr className="roundRow">
            <td colSpan={4}>Round {round}</td>
           </tr>
        );
        priorRound = pick.round;
        roundCount++;
      }

      ret.push(
        <tr className="selectionRow">
          <td className="pickNumber">{selectionOrder}.</td>
          {this.renderPlayer(player, isSkip)}
          <td>{team.name}</td>
          <td className="timeTaken">{parseInt(timeTaken / 1000)} sec</td>
        </tr>
      );

    });

    return ret;
  };

  render() {

    const {
      isAdmin,
    } = this.props;

    return (
      <InlineCss stylesheet={styles} componentName="container">
        <table>
          <thead>
            <tr>
              <td className="pickNumber">Pick</td>
              <td>Player</td>
              <td>Team</td>
              <td className="timeTaken">Time</td>
            </tr>
          </thead>
          <tbody>
            {this.renderSelections()}
          </tbody>
        </table>
      </InlineCss>
    );
  }
}

export default LogTab;