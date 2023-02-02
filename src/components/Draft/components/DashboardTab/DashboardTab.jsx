import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import Image from 'react-imageloader';

import InlineCss from "react-inline-css";
import styles from './styles';

import PlayerTable from '../../../Shared/components/PlayerTable';
import PlayerCard from '../PlayerCard';
import PlayerSummaryTable from '../PlayerSummaryTable';
import TeamConfigurationTable from '../TeamConfigurationTable';
import UpdateTopScoreForm from '../UpdateTopScoreForm';

import settingTypes from '../../../DraftSetup/settingTypes';

class DashboardTab extends React.Component {
  static propTypes = {
    sessions: PropTypes.array.isRequired,
    selectionTime: PropTypes.object.isRequired,
  };

  handleControlStart = () => {
    this.props.toggleControlsActive(true);
  };

  handleControlPause = () => {
    this.props.toggleControlsActive(false);
  };

  handleTeamSelect = (event) => {
    this.props.selectTeam(event.target.value);
  };

  handleSelectionFormInputChange = (event) => {
    this.props.playerSearchTermChanged(event.target.value);
  };

  handleSelectionFormInputKeyDown = ({charCode, target, altKey}) => {
    if(charCode === 13 && this.props.searchedPlayers.length > 0) {
      this.props.selectPlayer(this.props.searchedPlayers[0].draftId);
      setTimeout(() => this.refs.draftEnterBtn.focus(), 150);
    }
  };

  handleSelectionFormOverride = (event) => {
    event.preventDefault();
    if(window.confirm('Override validation error and select?')) {
      this.handleSelectionFormSubmit();
    }
  };

  handleSelectionFormSubmit = () => {
    this.props.draftPlayer(this.props.activePlayer.id, this.props.currentDraftOrder.team.id);
    this.props.selectPlayer();
    this.props.playerSearchTermChanged('');
    this.refs.selectionPlayerId.focus();
  };

  handleUndoSelection = () => {
    this.props.undoDraftPlayer();
  };

  handleSkipSelection = () => {
    this.props.skipSelectPlayer();
  };

  handleSettingChange = (id, value) => {
    this.props.changeSetting(id, value);
  };

  handleOpenTopScore = () => {
    this.props.toggleTopScoreUpdateForm();
  };

  handleJoinDraftClick = () => {
    this.props.toggleJoinDraft();
  };

  handleJoinTokenChange = ({target: {value}}) => {
    this.props.updateJoinDraftToken(value);
  };

  // Renders //

  renderDate = (dateTime) => {
    return moment(dateTime).format("MMM D YYYY, h:mm a");
  };

  renderTopScoreForm = () => {
    return (
      <InlineCss stylesheet={styles} componentName="container">
        <UpdateTopScoreForm
          csrf={this.props.topScoreCsrf}
          clientId={this.props.topScoreClientId}
          organization={this.props.organization}
          ajaxResult={this.props.topScoreAjax}
          closeForm={this.handleOpenTopScore}
          updateApiCsrf={this.props.updateApiCsrf}
          updateApiClientId={this.props.updateApiClientId}
          runUpdateTopScore={this.props.runUpdateTopScore} />
      </InlineCss>
    );
  };

  render() {

    const {
      sessions,
      selectionTime,
      selections,
      searchedPlayers,
      columns,
      searchTerm,
      activePlayer,
      teams,
      settings,
      topScoreFormOpen,
      joinDraft,
      currentDraftOrder,

      selectPlayer,
      draftPlayer,

    } = this.props;

    const activeTeam = (currentDraftOrder || {}).team || {};

    let statusVerbage = '';

    const allowCaptainSelect = settingTypes.find(setting => setting.id === 'allowCaptainSelect');

    if(activePlayer) {
      switch(activePlayer.status) {
        case 'Draftable':
          statusVerbage = 'Valid selection.';
          break;
        case 'TeamBaggaged':
          statusVerbage = 'Clears baggage.';
          break;
        case 'TeamDrafted':
          statusVerbage = 'Already drafted by this team.';
          break;
        case 'Drafted':
          statusVerbage = `Drafted by another team (${activePlayer.team.name}).`;
          break;
        case 'VectorLimited':
          statusVerbage = 'This player\'s vector is too low. It must be higher than the vector of any of team\'s undrafted baggage.';
          break;
        case 'GenderLimited':
          statusVerbage = 'This would cause too many players of a gender to be drafted.';
          break;
      }
    }

    if(topScoreFormOpen) {
      return this.renderTopScoreForm();
    }

    return (
      <InlineCss stylesheet={styles} componentName="container">
        <section className="manageDraft">

          <h2>Manage Draft</h2>

          <div className="controlItem">
            <h3>Join Draft Token</h3>
            <div className="controlBtns">
              <input type="text" placeholder="Choose a token not easily guessable" value={joinDraft.token} onChange={this.handleJoinTokenChange} />
              <button onClick={this.handleJoinDraftClick}>{joinDraft.enabled ? 'Disable' : 'Enable'}</button>
            </div>
            <p>Captains may use this code to join the draft (link on the home page).</p>
          </div>

          <div className="controlItem">
            <h3>Selection Timer</h3>
            <div className="controlBtns">
              <button onClick={this.handleControlStart} disabled={selectionTime.active}>Start</button>
              <button className="uncommon" onClick={this.handleControlPause} disabled={!selectionTime.active}>Pause</button>
            </div>
            <p>Captains are not able to enter selections while the draft is paused.</p>
          </div>

          <div className="controlItem">
            <h3>Player Search</h3>
            <div className="controlBtns">
              <input ref="selectionPlayerId" type="text" placeholder="Search by draft ID, first name, or last name" value={searchTerm} onChange={this.handleSelectionFormInputChange} onKeyPress={this.handleSelectionFormInputKeyDown} />
            </div>
            {searchedPlayers.length > 0 && (
              <div className="fullWidth playerSelect">
                <PlayerTable
                  players={searchedPlayers}
                  columns={columns}
                  showBaggage={true}
                  showStatus={true}
                  onPlayerSelect={selectPlayer} />
              </div>
            )}
          </div>

          {!!activePlayer && (
            <div className="activePlayerStuff">

              <h3>Quick Draft Form</h3>

              <div className="draftPreview">

                <div className="playerPreview">
                  <div className="playerTitle">Drafting #{activePlayer.draftId}</div>

                  <PlayerCard activePlayer={activePlayer} />
                  {activePlayer.baggage.length > 0 && (
                    <div className="baggagePlayerPreview">
                      <div className="baggageTitle">Baggage {activePlayer.baggage.map(bag => `#${bag.draftId}`).join(' ,')}</div>
                      {activePlayer.baggage.map(bag => (
                        <PlayerCard activePlayer={bag} key={bag.id} />
                      ))}
                    </div>
                  )}
                </div>

                {!!activeTeam.baggage && !!activeTeam.selectedPlayers && (
                  <div className="teamPreview">
                    <div className="teamTitle">
                      <h4>Team: {activeTeam.name}
                      </h4>
                    </div>
                    <div className="teamContent">
                      {activeTeam.baggage.length > 0 && (
                        <div className="undraftedPlayers">
                          <h4>Undrafted Baggage</h4>
                          <PlayerSummaryTable
                            players={activeTeam.baggage}
                            columns={columns}
                            onPlayerSelect={this.props.selectPlayer} />
                        </div>
                      )}
                      {activeTeam.selectedPlayers.length > 0 && (
                        <div className="draftedPlayers">
                          <h4>Drafted Players</h4>
                          <PlayerSummaryTable
                            players={activeTeam.selectedPlayers}
                            columns={columns}
                            onPlayerSelect={this.props.selectPlayer} />
                        </div>
                      )}
                      {activeTeam.players.length === 0 && (
                        <div className="noPlayers">
                          No players yet.
                        </div>
                      )}
                    </div>
                  </div>
                )}

              </div>

              <div className="confirmDraft">

                {(activePlayer.status === 'Draftable' || activePlayer.status === 'TeamBaggaged') && (
                  <i className="material-icons statusIcon valid">check_circle</i>
                ) || (
                  <span className="statusSection">
                    <i className="material-icons statusIcon invalid">report_problem</i>
                    <a className="overrideLabel" onClick={this.handleSelectionFormOverride}>Override Submit</a>
                  </span>
                )}

                <div className="playerStatus">
                  <div className="statusTitle">Draft Validation</div>
                  {statusVerbage}
                </div>

                <div className="controlBtns">
                  <button className="bigBold" ref="draftEnterBtn" disabled={['Draftable', 'TeamBaggaged'].indexOf(activePlayer.status) < 0} onClick={this.handleSelectionFormSubmit}>Confirm</button>
                </div>
              </div>

            </div>
          )}

          <div className="controlItem">
            <h3>Undo Selection</h3>
            <div className="controlBtns">
              <button className="uncommon" onClick={this.handleUndoSelection} disabled={selections.length === 0}>Undo Last Draft</button>
            </div>
            <p>Use this button to remove the last draft selection. Careful!</p>
          </div>

          <div className="controlItem">
            <h3>Skip Selection</h3>
            <div className="controlBtns">
              <button className="uncommon" onClick={this.handleSkipSelection}>Skip Current Draft</button>
            </div>
            <p>Skip the current team's selection. They will not get a player this round and it will be the next team's turn to draft.</p>
          </div>

          <div className="controlItem">
            <h3>TopScore</h3>
            <div className="controlBtns">
              <button onClick={this.handleOpenTopScore}>Update TopScore</button>
            </div>
            <p>Update your organization's TopScore website with the player selections in the draft.</p>{/*'*/}
          </div>

        </section>

        <section className="sessions">
          <h2>Sessions</h2>
          <p>This is the list of users who have connected to the draft and are able to view player information.</p>
          {sessions.map(session => {
            return (
              <div className="session" key={session.uid}>
                {session.self && (
                  <div className="userInfo">
                    <Image className="sessionImg" src={session.self.image}>
                      <img src="/assets/default-user.jpg" />
                    </Image>
                    <div className="sessionName">{session.self.name}</div>
                  </div>
                )}
                <div className="sessionDate">Connected: {this.renderDate(session.connected)}</div>
              </div>
            );
          })}
        </section>

        <section className="teamConfig">
          <h2>Configure Teams</h2>
          <p>Use this section to configure team information, usually before the draft starts. Drag teams to reorder them, customize team names, and assign captains to teams directly or as baggage.</p>

          <TeamConfigurationTable />

        </section>

        <section className="settings">
          <h2>Draft Settings</h2>
          <p>Use this section to change draft settings.</p>

          <div className="setting">

            <div
              className={`fauxCheckbox ${settings.allowCaptainSelect && 'checked' || ''}`}
              onClick={this.handleSettingChange.bind(this, allowCaptainSelect.id, !settings.allowCaptainSelect)} />

            <div className="label">{allowCaptainSelect.text}</div>
            <div className="detailText">{allowCaptainSelect.detailText}</div>

          </div>

        </section>

      </InlineCss>
    );
  }
}

export default DashboardTab;