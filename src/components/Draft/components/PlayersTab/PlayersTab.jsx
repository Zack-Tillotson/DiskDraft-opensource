import React from 'react';
import PropTypes from 'prop-types';

import InlineCss from "react-inline-css";
import PlayerTable from '../../../Shared/components/PlayerTable';

import styles from './styles';

class PlayersTab extends React.Component {
  static propTypes = {

    players: PropTypes.array.isRequired,
    columns: PropTypes.array.isRequired,
    settings: PropTypes.object.isRequired,
    playersTabOptions: PropTypes.object.isRequired,

    selectPlayer: PropTypes.func.isRequired,
    filterPlayers: PropTypes.func.isRequired,

  };

  getVisiblePlayers = () => {
    const {
      settings: {
        baggageVectorLimitDrafts,
      },
      playersTabOptions: {
        showAll,
        showVectorLimited,
        showNote,
      },
      players,
    } = this.props;

    let ret = players;

    if(!showAll) {
      ret = ret.filter(player => player.status === 'Draftable' || player.status == 'TeamBaggaged' || player.status === 'VectorLimited');
    }

    if(baggageVectorLimitDrafts && !showVectorLimited) {
      ret = ret.filter(player => player.status !== 'VectorLimited');
    }

    if(Object.keys(showNote).find(key => showNote[key])) { // Don't filter if no values are selected
      ret = ret.filter(player => showNote[player['_note']]);
    }

    return ret;

  };

  getCurrentSort = () => {
    const {sorts} = this.props.playersTabOptions;
    const currentSort = sorts[sorts.length - 1] || '';
    const {0: col, 1: dir} = currentSort.split('.');
    return {col, dir};
  };

  handleFilterChange = (name, event) => {
    const {checked} = event.target;
    event.stopPropagation();
    this.props.filterPlayers(name, checked);
  };

  handleSort = (column) => {
    const {col: currentCol, dir: currentDir} = this.getCurrentSort();
    const dir = (currentCol != column.id || currentDir === 'desc') ? 'asc' : 'desc';
    this.props.sortPlayers(`${column.id}.${dir}`);
  };

  // Renders //

  renderTableOptions = () => {

    const {
      settings: {
        baggageVectorLimitDrafts,
      },
      playersTabOptions: {
        showAll,
        showVectorLimited,
        showNote = [],
      },
    } = this.props;

    return (
      <div className="tableOptions">
        <section className={`filterSection`}>
          <label className="filterTitle">Player Filters</label>
          <div className="filterOptions">
            <div className="filterOption">
              <input id="showAllCheckbox" type="checkbox" checked={showAll} onChange={this.handleFilterChange.bind(this, 'showAll')} />
              <label htmlFor="showAllCheckbox">Show Everyone</label>
            </div>
            {baggageVectorLimitDrafts && (
              <div className="filterOption notFirstFilter">
                <input id="showVectorLimitedCheckbox" type="checkbox" checked={showVectorLimited} onChange={this.handleFilterChange.bind(this, 'showVectorLimited')} />
                <label htmlFor="showVectorLimitedCheckbox">Show Vector Limited</label>
              </div>
            )}
            <div className="filterOption notFirstFilter">
              <label>Filter by label</label>
              {[1,-1, -2, 3, -3].map(note => (
                <span className="noteFilterContainer">
                  <input id={`filterNote${note}`} type="checkbox" onChange={this.props.filterPlayers.bind(this, 'note', note)} checked={showNote[note]} />
                  <label key={`note-filter-${note}`} htmlFor={`filterNote${note}`} className={`noteFilter ${`playerNote${note} ${showNote[note] ? 'filterActive' : ''}`}`} />
                </span>
              ))}
            </div>
          </div>
        </section>
      </div>
    );
  };

  render() {

    const {
      columns,
      activePlayer,
      isAdmin,
      selectPlayer,
      updatePlayerAttribute,
    } = this.props;

    const players = this.getVisiblePlayers();
    const currentSort = this.getCurrentSort();

    return (
      <InlineCss stylesheet={styles} componentName="container">
        {this.renderTableOptions()}
        <PlayerTable
          players={players}
          columns={columns}
          showSort={true}
          currentSort={currentSort}
          showAllVisibleColumns={false}
          showStatus={true}
          showBaggage={true}
          allowEdit={isAdmin}
          activePlayer={activePlayer}
          onPlayerSelect={selectPlayer}
          onSort={this.handleSort}
          updatePlayerAttribute={updatePlayerAttribute} />
      </InlineCss>
    );
  }
}

export default PlayersTab;
