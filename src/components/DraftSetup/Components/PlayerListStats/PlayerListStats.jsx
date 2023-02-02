import React from 'react';

import InlineCss from "react-inline-css";
import styles from './styles';

class PlayerListStats extends React.Component {
  getIncludedPlayers = () => {
    return this.props.players.filter(player => player._include);
  };

  render() {

    const {players} = this.props;

    return (
      <InlineCss stylesheet={styles} componentName="container">

        <div className="mainStat">
          Including {this.getIncludedPlayers().length} of {players.length} Players
        </div>

        {!!players.length && (
          <table className="secondaryStat">
            <tbody>
              <tr>
                <td className="statTitle">By gender</td>
                <td>{this.getIncludedPlayers().filter(player => player.gender === 'male').length} Men</td>
              </tr>
              <tr>
                <td className="statTitle"></td>
                <td>{this.getIncludedPlayers().filter(player => player.gender === 'female').length} Women</td>
              </tr>
            </tbody>
          </table>
        )}

        {!!players.length && (
          <table className="secondaryStat">
            <tbody>
              <tr>
                <td className="statTitle">By registration status</td>
                <td>{this.getIncludedPlayers().filter(player => player.status === 'accepted').length} Accepted</td>
              </tr>
              <tr>
                <td className="statTitle"></td>
                <td>{this.getIncludedPlayers().filter(player => player.status !== 'accepted').length} Not accepeted</td>
              </tr>
            </tbody>
          </table>
        )}

        {!!players.length && (
          <table className="secondaryStat">
            <tbody>
              <tr>
                <td className="statTitle"></td>
                <td>{this.getIncludedPlayers().filter(player => (player.roles || '').indexOf('player') >= 0).length} Players</td>
              </tr>
              <tr>
                <td className="statTitle">By role</td>
                <td>{this.getIncludedPlayers().filter(player => (player.roles || '').indexOf('captain') >= 0).length} Captains</td>
              </tr>
            </tbody>
          </table>
        )}
        
      </InlineCss>
    );
  }
}

export default PlayerListStats;