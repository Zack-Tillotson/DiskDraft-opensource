import React from 'react';
import PropTypes from 'prop-types';
import InlineCss from "react-inline-css";

import PlayerTable from '../../../Shared/components/PlayerTable';

import styles from './styles';

class TeamsTab extends React.Component {
  static propTypes = {

    teams: PropTypes.array.isRequired,
    columns: PropTypes.array.isRequired,
    teamsTabOptions: PropTypes.object.isRequired,
    contextTeamStats: PropTypes.array.isRequired,
    activeStatTeams: PropTypes.array.isRequired,

  };

  handleActiveTeamChange = (event) => {
    const teamId = event.target.value;
    this.props.viewTeamRoster(teamId);
  };

  handleActiveStatChange = (event) => {
    const statId = event.target.value;
    this.props.viewTeamStat(statId);
  };

  // Renders //

  renderHeight = (value) => {
    return `${parseInt(value / 2.54 / 12)}'${parseInt(value / 2.54 % 12 * 10) / 10}"`; //'
  };

  renderStatValue = (stat) => {
    const {value, type = 'number'} = stat;

    let cleanValue = value;
    if(type === 'height') {
      if(isNaN(value)) {
        return '-';
      }
      cleanValue = this.renderHeight(value);
    } else if(type === 'time') {
      if(isNaN(value)) {
        return '-';
      }
      cleanValue = parseInt(value / 1000) + ' seconds';
    } else if(type === 'age') {
      if(!isNaN(value)) {
        cleanValue = parseInt(value * 10) / 10 + ' years';
      } else {
        return '-';
      }
    } else {
      if(isNaN(value)) {
        return '-';
      }
      cleanValue = parseInt(value * 10) / 10;
    }

    return cleanValue;
  };

  renderStats = () => {

    const {
      teamsTabOptions: {activeStat},
      contextTeamStats,
      activeStatTeams,
      onPlayerSelect,
    } = this.props;

    const maxStatValue = (activeStatTeams[0] || {}).value || 1;

    return (
      <section className="statsSection">
        <div className="generalStats">
          <h3>General Stats</h3>
          <div className="statsList">
            {contextTeamStats.map(stat => {
              const display = this.renderStatValue(stat);
              return (
                <div key={stat.title} className="statItem">
                  <h4>{stat.title}</h4>
                  <div className="statValue">{display}</div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="statComparison">
          <div className="statSelection">
            <h3>Team Comparison</h3>
            <select value={activeStat} onChange={this.handleActiveStatChange}>
              {contextTeamStats.map((stat, index) => (
                <option key={index} value={index}>{stat.title}</option>
              ))}
            </select>
          </div>
          <div className="teamList">
            {activeStatTeams.map(stat => {
              const display = this.renderStatValue(stat);
              return (
                <div key={stat.team.id} className="statItem">
                  <div className="statColorLine" style={{width: `${stat.value / maxStatValue * 100}%`}}/>
                  <h4>{stat.team.name}</h4>
                  <div className="statValue">{display}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    );
  };

  renderRosters = () => {

    const {teams, teamsTabOptions: {activeTeam}, columns, selectPlayer} = this.props;

    const team = teams[activeTeam];

    if(!team) {
      return null;
    }

    return (
      <div className="teamDisplay">
        <div className="teamSelect">
          <h3>Team Rosters</h3>
          <select value={activeTeam} onChange={this.handleActiveTeamChange}>
            {teams.map((team, index) => (
              <option key={index} value={index}>{team.name}</option>
            ))}
          </select>
        </div>
        <div className="activeTeamRoster">
          <ul className="genders">
            <li><span className="statsLabel">Men: </span><span>{team.stats.menCount}</span></li>
            <li><span className="statsLabel">Women: </span><span>{team.stats.womenCount}</span></li>
          </ul>
          <PlayerTable
            players={team.players}
            columns={columns}
            showAllVisibleColumns={true}
            showSort={false}
            showStatus={false}
            showBaggage={false}
            onPlayerSelect={selectPlayer} />
        </div>
      </div>
    );
  };

  render() {
    return (
      <InlineCss stylesheet={styles} componentName="container">
        {this.renderStats()}
        {this.renderRosters()}
      </InlineCss>
    );
  }
}

export default TeamsTab;