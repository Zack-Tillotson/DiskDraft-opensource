import React from 'react';
import PropTypes from 'prop-types';

import InlineCss from "react-inline-css";
import styles from './styles';

class PlayerTable extends React.Component {
  static propTypes = {

    players: PropTypes.array.isRequired,
    columns: PropTypes.array.isRequired,

    showAllVisibleColumns: PropTypes.bool,
    showSort: PropTypes.bool,
    showStatus: PropTypes.bool,
    showBaggage: PropTypes.bool,
    allowEdit: PropTypes.bool,

    currentSort: PropTypes.object, // Required if showSort is true

    onSort: PropTypes.func,
    onPlayerSelect: PropTypes.func,

  };

  static defaultProps = {
    showAllVisibleColumns: false,
    showSort: false,
    showStatus: false,
    showBaggage: false,
    allowEdit: false,
    onPlayerSelect: () => {},
  };

  state = {
    editField: null, // When editing will be {columnId, playerId}
  };

  getVisibleColumns = () => {
    const {columns, showStatus, showAllVisibleColumns} = this.props;

    return columns.filter(col => {
      if(showAllVisibleColumns) {
        return col.visible;
      } else {
        return col.visible && col.primary;
      }
    });
  };

  getBaggageIds = (editPlayer) => {
    const baggageGroupId = editPlayer['baggage_group_id'];
    let bagPlayers = [];
    if(baggageGroupId) {
      bagPlayers = this.props.players.filter(pyr => pyr['baggage_group_id'] === editPlayer['baggage_group_id'] && pyr !== editPlayer);
    }
    const ids = bagPlayers.map(pyr => pyr['draftId']).join(',');
    return ids;
  };

  // Handlers

  onKeyPress = ({keyCode}) => {
    if(!this.state.editField) {
      return;
    } else if(keyCode === 13) { // Enter
      this.onEndEdit(true);
    } else if(keyCode === 27) { // Esc
      this.onEndEdit(false);
    }
  };

  onSort = (column) => {
    this.props.onSort(column);
  };

  onPlayerSelect = (playerId, player) => {
    this.props.onPlayerSelect(playerId, player);
  };

  onStartEdit = (columnId, playerId, {altKey}) => {
    if(this.props.allowEdit && altKey) {
      this.setState({editField: {columnId, playerId}});
      setTimeout(() => this.refs.fieldEdit.select(), 50);
    }
  };

  onStartEditBaggage = (playerId, event) => {
    const columnId = 'baggage_group_id';
    this.onStartEdit(columnId, playerId, event);
  };

  onEndEdit = (shouldSave = false) => {
    if(shouldSave) {
      const {columnId, playerId} = this.state.editField;
      this.props.updatePlayerAttribute(columnId, playerId, this.refs.fieldEdit.value);
    }
    this.setState({editField: null});
  };

  // Renders //

  renderStatusTd = (player) => {

    const {
      showStatus,
    } = this.props;

    const {
      editField,
    } = this.state;

    if(editField && editField.columnId === '_removed' && showStatus && editField.playerId === player.id) {
      const defaultValue = player.status === 'Removed' ? 'Removed' : '';
      return (
        <td ref="statusTd">
          <select ref="fieldEdit" defaultValue={defaultValue} onChange={this.onEndEdit.bind(this, true)}>
            <option value="">Included</option>
            <option value="Removed">Removed</option>
          </select>
        </td>
      );
    } else if(showStatus && player.status !== 'Draftable') {
      return (
        <td ref="statusTd">
          <img className="statusImage" src={`/assets/icons/${player.status}.png`} title={player.status} onClick={this.onStartEdit.bind(this, '_removed', player.id)} />
        </td>
      );
    } else if(showStatus && player.status === 'Draftable') {
      return (
        <td ref="statusTd" onClick={this.onStartEdit.bind(this, '_removed', player.id)} />
      );
    }
  };

  renderPlayers = () => {

    const {
      players,
      showSort,
      currentSort,
      showStatus,
      showBaggage,
      activePlayer,
    } = this.props;

    const {
      editField,
    } = this.state;

    const columns = this.getVisibleColumns();

    const ret = [];

    players.forEach(player => {

        const firstRowBaggage = [];

        if(!showBaggage) {
          firstRowBaggage.push(
            <td />
          );
        } else if(editField && editField.columnId === 'baggage_group_id' && editField.playerId === player.id) {

          firstRowBaggage.push(
            <td key="bagId">
              <input ref="fieldEdit" type="text" defaultValue={this.getBaggageIds(player)} onKeyDown={this.onKeyPress} />
            </td>
          );

        } else if(player.baggage.length > 0) {

          if(player.baggage.length > 1) {
            console.log('XXX \n\nSorry multiple baggage not supported at this time - Fix!\n\nDon\'t ignore me!\n\n');
          }

          const bag = player.baggage[0];

          // This should be the "summary player view", not this bleh stuff
          firstRowBaggage.push(
            <td className="baggage" key="bagId" onClick={this.onStartEditBaggage.bind(this, player.id)}>
              <img src={bag.image} className="playerImage" />
              &nbsp;#{bag.draftId} {bag.first_name} {bag.last_name}, {bag.gender}, {bag.vector}
            </td>
          );

        } else {
          firstRowBaggage.push(
            <td className="baggage" key="bagId" onClick={this.onStartEditBaggage.bind(this, player.id)} />
          );
        }

        const noteClass = `playerNote${player._note}`;
        const activePlayerClass = (activePlayer && activePlayer.id === player.id) ? 'active' : '';

        ret.push(
          <tr key={player.draftId}
            className={`player ${noteClass} ${activePlayerClass}`}
            onClick={this.onPlayerSelect.bind(this, player.draftId, player)}>

            {this.renderStatusTd(player)}
            {columns.map(col => {
              if(editField && editField.columnId === col.id && editField.playerId === player.id) {
                return (
                  <td key={col.id}>
                    <input ref="fieldEdit" type="text" defaultValue={player[col.id]} onKeyDown={this.onKeyPress} />
                  </td>
                );
              } else {
                switch(col.id) {
                  case 'player':
                    return (
                      <td key={col.id}>
                        <img className="playerImage" src={player.image} />{player.first_name} {player.last_name}
                      </td>
                    );
                  case 'height':

                    const heightCm = player[col.id];
                    const heightIn = Math.round(heightCm / 2.54 % 12);
                    const heightFt = parseInt(heightCm / 2.54 / 12); // 30.45 cm per ft

                    const heightImp = !!heightCm && heightCm > 0 && `${heightFt}'${heightIn}"` || '-'; // '

                    return (
                      <td key={col.id} onClick={this.onStartEdit.bind(this, col.id, player.id)}>
                        {heightImp}
                      </td>
                    );
                  case 'gender':
                    return (
                      <td key={col.id} onClick={this.onStartEdit.bind(this, col.id, player.id)}>
                        {player[col.id][0].toUpperCase()}
                      </td>
                    );
                  default:
                    return (
                      <td key={col.id} onClick={this.onStartEdit.bind(this, col.id, player.id)}>
                        {player[col.id]}
                      </td>
                    );
                }
              }
            })}
            {showBaggage && firstRowBaggage}
          </tr>
        );
      }
    );

    return ret;
  };

  render() {

    const {
      showSort,
      currentSort,
      showStatus,
      showBaggage,
    } = this.props;

    const columns = this.getVisibleColumns();
    const playerRows = this.renderPlayers();

    return (
      <InlineCss stylesheet={styles} componentName="container">
        <table className="playersTable">
          <thead>
            <tr>
              {showStatus && (
                <td className="minititle">Status</td>
              )}
              {columns.map(col => {

                const isSorted = showSort && currentSort.col === col.id;
                const sortIndicator = showSort && currentSort.dir === 'asc' ? '▼' : '▲';

                const sortProp = {};
                let sortableClass = '';
                if(showSort) {
                  sortProp.onClick = this.onSort.bind(this, col);
                  sortableClass = 'sortable';
                }

                return (
                  <td key={col.id} {...sortProp} className={sortableClass}>
                    {col.id === 'gender' && 'M/F' || col.display}
                    {isSorted && <span>&nbsp;{sortIndicator}</span>}
                  </td>
                );
              })}
              {showBaggage && (
                <td className="baggage baggageStart">Baggage</td>
              )}
            </tr>
          </thead>
          <tbody className="notesActive">
            {playerRows}
          </tbody>
        </table>
        {playerRows.length === 0 && (
          <div className="noPlayersMessage">
            All done, everyone has been drafted!
          </div>
        )}
      </InlineCss>
    )
  }
}

export default PlayerTable;