import React from 'react';

import {connect} from 'react-redux';
import selector from '../../state/selector';
import dispatcher from '../../state/dispatcher';

import Layout from '../Layout';
import WizardNavigator from '../../components/WizardNavigator';
import MiniPlayerList from '../../components/MiniPlayerList';
import PlayerListStats from '../../components/PlayerListStats';
import EditSettings from '../../components/EditSettings';

const wizardSteps = ['Players', 'Teams', 'Settings'];

class PlayersPage extends React.Component {
  // Etc

  getDraftEvent = () => {

    const {draftMeta, organization} = this.props;
    if('eventKey' in draftMeta && 'events' in organization) {
      return organization.events[draftMeta.eventKey];
    } else {
      return {}
    }

  };

  getPlayerSettings = () => {
    return this.props.settings.filter(setting => setting.location === 'players');
  };

  handleTopScoreImport = () => {
    this.props.importTopScorePlayers(this.props.params.draftId);
  };

  handleCsvImport = (event) => {
    if(event && event.target.files.length > 0) {
      const targetFile = event.target.files[0];
      this.props.importCsvData(targetFile);
      this.refs.fileInput.value = '';
    }
  };

  handlePlayerToggle = (player) => {
    this.props.togglePlayer(player);
  };

  changeSetting = (name, value) => {
    this.props.changeSetting(name, value);
  };

  // Renders //

  render() {

    const {
      wizard,
      players,
      organization,
      settings,
    } = this.props;

    const topScoreInitialized = !!players.find(player => player.id);

    return (
      <Layout {...this.props} step="players">

        <h2>Import Player Information</h2>

        <ul className="stepExplanation">
          <li>In this step first import registration information from TopScore.</li>
          <li>Afterwards you can supplement that with data from a custom CSV.</li>
          <li>The CSV must have a column labeled 'ID' which matches the TopScore player ID.</li>
        </ul>

        <div className="importCtls section">
          <h3>Data Sources</h3>

          <div className="controlLink" onClick={this.handleTopScoreImport}>
            <i className="material-icons">cloud</i> Import registrations from TopScore
          </div>

          {typeof wizard.playerStep.topScoreImportSuccessful === 'boolean' && wizard.playerStep.topScoreImportSuccessful && (
            <div className="substepSuccess success">
              <i className="material-icons">done</i> Imported TopScore data.
            </div>
          )}

          {typeof wizard.playerStep.topScoreImportSuccessful === 'boolean' && !wizard.playerStep.topScoreImportSuccessful && (
            <div className="substepSuccess failure">
              <i className="material-icons">done</i> Error importing TopScore data. Please verify organization data and try again.
            </div>
          )}

          {topScoreInitialized && (
            <div className="optionalStep">

              <div className="descriptionText">
                (optional) Import additional data via TopScore's spreadsheet export: {/*'*/}
                <a className="downloadLink" href={`https://${organization.topScoreUrl}/e/admin/${this.getDraftEvent().slug}/registration/view/csv`} target="_blank">
                  <i className="material-icons">file_download</i> Download
                </a>
              </div>

              <span className="controlLink">
                <input type="file" ref="fileInput" onChange={this.handleCsvImport} placeholder="Upload CSV file" />
              </span>

            </div>
          )}

          {typeof wizard.playerStep.csvImportSuccessful === 'boolean' && wizard.playerStep.csvImportSuccessful && (
            <div className="substepSuccess success">
              <i className="material-icons">done</i> Imported CSV data.
            </div>
          )}

          {typeof wizard.playerStep.csvImportSuccessful === 'boolean' && !wizard.playerStep.csvImportSuccessful && (
            <div className="substepSuccess failure">
              <i className="material-icons">done</i> Error importing data, please verify the file is correct and try again.
            </div>
          )}

        </div>

        {!!players.length && (

          <div className="playerList section">

            <h3>Review Players</h3>

            <h4>Settings</h4>
            <EditSettings settings={this.getPlayerSettings()} onChange={this.props.changeSetting} />

            <PlayerListStats players={players} />

            <MiniPlayerList players={players} />

            <ul className="stepExplanation">
              <li>Review this list of players before going on.</li>
              <li>Ensure everyone in your TopScore registration list is here and has a number.</li>
              <li>The number next to each player is their draft ID.</li>
            </ul>

          </div>

        )}

      </Layout>
    );
  }
}

export default connect(selector, dispatcher)(PlayersPage);