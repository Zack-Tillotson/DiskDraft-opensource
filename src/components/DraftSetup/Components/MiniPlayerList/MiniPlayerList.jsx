import React from 'react';

import InlineCss from "react-inline-css";
import styles from './styles';

import MiniPlayer from '../MiniPlayer';

class MiniPlayerList extends React.Component {
  render() {

    const {players} = this.props;
    let playerIndex = 1;

    return (
      <InlineCss stylesheet={styles} componentName="container">

        <table className="playerTable">
          <tbody>
            {players.map(player => (
              <tr className="player" key={player.id}>
                <td className="playerIndex">
                  {player._include && (<span>{player.draft_id}.</span>)}
                  {!player._include && (<i className="material-icons">remove_circle</i>)}
                </td>
                <td>
                  <MiniPlayer className="playerSummary" player={player} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
      </InlineCss>
    );
  }
}

export default MiniPlayerList;