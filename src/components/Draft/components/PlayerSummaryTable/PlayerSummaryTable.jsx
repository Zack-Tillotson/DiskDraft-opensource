import React from 'react';
import PropTypes from 'prop-types';

import InlineCss from "react-inline-css";
import styles from './styles';

const summaryColumnIds = [
  'player',
  'gender',
  'vector',
];

class PlayerSummaryTable extends React.Component {
  static propTypes = {

    players: PropTypes.array.isRequired,
    columns: PropTypes.array.isRequired,

    onPlayerSelect: PropTypes.func.isRequired,

  };

  getVisibleColumns = () => {
    const {columns} = this.props;

    const visible = columns.filter(col => {
      return summaryColumnIds.indexOf(col.id) >= 0;
    });
    const firstSpecialPlayerIndex = 1; // XXX hardcoding for now, do we need to look this up?

    const finalList = [
      ...visible.slice(0, firstSpecialPlayerIndex),
      {id: 'player', display: 'Player'},
      ...visible.slice(firstSpecialPlayerIndex),
    ];

    return finalList;
  };

  // Handlers

  onPlayerSelect = (player) => {
    this.props.onPlayerSelect(player);
  };

  // Renders //

  renderHead = () => {

    const columns = this.getVisibleColumns();

    return (
      <tr>
        {columns.map(col => (
          <td key={col.id}>
            {col.display}
          </td>
        ))}
      </tr>
    );
  };

  renderPlayers = () => {

    const {
      players,
    } = this.props;

    const columns = this.getVisibleColumns();

    const ret = [];

    players.forEach(player => {

      ret.push(
        <tr key={player.draftId}
          className={`player`}
          onClick={this.onPlayerSelect.bind(this, player.draftId)}>
          {columns.map(col => {
            switch(col.id) {
              case 'player':
                return (
                  <td key={col.id}><img className="playerImage" src={player.image} />{player.first_name} {player.last_name}</td>
                );
              default:
                return (
                  <td key={col.id}>{player[col.id]}</td>
                );
            }
          })}
        </tr>
      );
    });

    return ret;
  };

  render() {

    return (
      <InlineCss stylesheet={styles} className="playersTable" componentName="container" wrapper="table">
        <thead>
          {this.renderHead()}
        </thead>
        <tbody className="notesActive">
          {this.renderPlayers()}
        </tbody>
      </InlineCss>
    )
  }
}

export default PlayerSummaryTable;