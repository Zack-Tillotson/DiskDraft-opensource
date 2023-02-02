import React from 'react';
import PropTypes from 'prop-types';

import InlineCss from "react-inline-css";
import styles from './styles';

import PlayerCard from '../PlayerCard';
import PlayerDetailTable from '../../../Shared/components/PlayerDetailTable';

function renderColumnValue(type, value) {
  switch(type.toLowerCase()) {
      case 'text':
      case 'number':
      case 'baggage group id':
      case 'weight':
      case 'height':
      case 'draft id':
      case 'gender':
      case 'age':
        return value;
      case 'image':
        return (
          <img className="playerImage" src={value} />
        );
    }
  return value;
}

class PlayerDetail extends React.Component {
  static propTypes = {

    activePlayer: PropTypes.object,
    selectedPlayerId: PropTypes.number,

  };

  getColumns = (onlyPrimary = true) => {
    return this.props.columns
      .filter(col => col.visible);
  };

  handlePlayerIdChange = () => {
    this.props.selectPlayer(this.refs.playerId.value);
  };

  handlePlayerNote = (score) => {
    const {activePlayer} = this.props;
    const value = activePlayer._note == score ? 0 : score;
    this.props.notePlayer(activePlayer.id, value);
  };

  handleDraftPlayer = () => {
    const {activePlayer} = this.props;
    this.props.draftPlayer(activePlayer.id);
  };

  handleCloseClick = () => {
    this.props.selectPlayer();
  };

  // Renders //

  renderHelpText = () => {
    return (
      <div className="helpText">
        Select a player to see detailed statistics.
      </div>
    );
  };

  renderPrimaryAttributes = () => {
    const {activePlayer} = this.props;

    return (
      <PlayerCard activePlayer={activePlayer} />
    );
  };

  renderControlButtons = () => {

    const {
      activePlayer,
      mayCurrentlyDraft,
    } = this.props;

    return (
      <div className="playerControlButtons">
        {mayCurrentlyDraft && (
          <div className="draftCtl" onClick={this.handleDraftPlayer}>Draft</div>
        )}
        <div className="noteCtlSection">
          <h4>Color Code (private to yourself)</h4>
          <div className="noteCtl playerNote0" onClick={this.handlePlayerNote.bind(this, 0)} />
          <div className="noteCtl playerNote1" onClick={this.handlePlayerNote.bind(this, 1)} />
          <div className="noteCtl playerNote-1" onClick={this.handlePlayerNote.bind(this, -1)} />
          <div className="noteCtl playerNote-2" onClick={this.handlePlayerNote.bind(this, -2)} />
          <div className="noteCtl playerNote3" onClick={this.handlePlayerNote.bind(this, 3)} />
          <div className="noteCtl playerNote-3" onClick={this.handlePlayerNote.bind(this, -3)} />
        </div>
      </div>
    );
  };

  render() {

    const {
      activePlayer,
      selectedPlayerId,
    } = this.props;

    return (
      <InlineCss stylesheet={styles} componentName="container">
        <div className="railTitle draftId">
          <span>Player Detail: </span>
          <input ref="playerId" type="text" value={selectedPlayerId} onChange={this.handlePlayerIdChange} />
          <i className="material-icons closeBtn" onClick={this.handleCloseClick}>close</i>
        </div>
        {!activePlayer && this.renderHelpText()}
        {!!activePlayer && this.renderPrimaryAttributes()}
        {!!activePlayer && this.renderControlButtons()}
        {!!activePlayer && (
          <PlayerDetailTable player={activePlayer} columns={this.getColumns(false)} />
        )}
      </InlineCss>
    );
  }
}

export default PlayerDetail;
