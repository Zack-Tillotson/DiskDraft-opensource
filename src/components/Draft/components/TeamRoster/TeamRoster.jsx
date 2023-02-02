import React from 'react';
import PropTypes from 'prop-types';

import PlayerSummaryTable from '../PlayerSummaryTable';

import InlineCss from "react-inline-css";
import styles from './styles';

class TeamRoster extends React.Component {
  static propTypes = {

    teams: PropTypes.array.isRequired,
    columns: PropTypes.array.isRequired,
    baggageVectorLimitDrafts: PropTypes.bool.isRequired,
    contextTeam: PropTypes.object,

    selectContextTeam: PropTypes.func.isRequired,
    selectPlayer: PropTypes.func.isRequired,

  };

  handleTeamSelect = (teamId) => {
    this.props.selectContextTeam(teamId);
  };

  // Renders //

  renderSelectTeamForm = () => {

    const {
      teams,
    } = this.props;

    return (
      <InlineCss stylesheet={styles} componentName="container" className="teamRoster">

        <div className="railTitle">Roster</div>

        <div>Select a team to see legal draft choices, your current team, and other useful information</div>

        {teams.map(team => (
          <div key={team.id} className="selectableTeam" onClick={this.handleTeamSelect.bind(this, team.id)}>
            {team.name}
          </div>
        ))}

        <div key={'observer'} className="selectableTeam" onClick={this.handleTeamSelect.bind(this, -1)}>
          Observer
        </div>

      </InlineCss>
    );
  };

  renderPlayerList = () => {

    const {
      columns,
      contextTeam: {baggage, selectedPlayers},
      selectPlayer,
      baggageVectorLimitDrafts,
    } = this.props;

    return (
      <div className="rosterList">

        {baggage.length > 0 && (
          <section className="undrafted">
            <h3>
              <img className="statusImage" src="/assets/icons/TeamBaggaged.png" title="Team Baggage" />
              Undrafted Baggage
            </h3>
            <PlayerSummaryTable
              columns={columns}
              players={baggage}
              onPlayerSelect={selectPlayer} />
            {baggageVectorLimitDrafts && (
              <div className="vectorLimitNote">
                Note: You are only allowed to draft these players or players with a higher vector.
              </div>
            )}
          </section>
        )}

        <section>
          <h3>
            <img className="statusImage" src="/assets/icons/TeamDrafted.png" title="Team Drafted" />
            Drafted Players
          </h3>
          {selectedPlayers.length > 0 && (
            <PlayerSummaryTable
              columns={columns}
              players={selectedPlayers}
              onPlayerSelect={selectPlayer} />
          )}
          {selectedPlayers.length === 0 && (
            <div className="noPlayers">No Players Yet</div>
          )}
        </section>
      </div>
    );
  };

  render() {

    const {
      contextTeam,
      contextTeamId,
    } = this.props;

    if(!contextTeamId) {
      return this.renderSelectTeamForm();
    }

    return (
      <InlineCss stylesheet={styles} componentName="container" className="teamRoster">

        <div className="railTitle">
          <span className="mainText">{contextTeam && `${contextTeam.name} Roster` || 'No Active Team'}</span>
          <span className="resetTeamIdLink" onClick={this.handleTeamSelect.bind(this, null)}>
            Change Team
          </span>
        </div>

        {contextTeam && this.renderPlayerList()}

      </InlineCss>
    );
  }
}

export default TeamRoster;