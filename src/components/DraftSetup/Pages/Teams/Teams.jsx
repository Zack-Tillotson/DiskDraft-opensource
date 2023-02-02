import React from 'react';

import {connect} from 'react-redux';
import selector from '../../state/selector';
import dispatcher from '../../state/dispatcher';

import Layout from '../Layout';
import TeamList from '../../components/TeamList';

class TeamsPage extends React.Component {
  handleTopScoreImport = () => {
    this.props.importTopScoreTeams(this.props.params.draftId);
  };

  componentDidMount() {

  }

  // Renders //

  render() {

    const {teams, wizard} = this.props;

    return (
      <Layout {...this.props} step="teams">

        <h2>Import Team Information</h2>

        <ul className="stepExplanation">
          <li>Ensure you have setup your event's teams in TopScore before importing them here.</li>
          <li>If you make a mistake just fix in TopScore then reimport here.</li>
        </ul>

        <div className="importCtls section">
          <h3>Data Sources</h3>

          <div className="controlLink" onClick={this.handleTopScoreImport}>
            <i className="material-icons">cloud</i> Import teams from TopScore
          </div>

          {typeof wizard.teamStep.topScoreImportSuccessful === 'boolean' && (
            <div className={`substepSuccess ${wizard.teamStep.topScoreImportSuccessful ? 'success' : 'failure'}`}>
              <i className="material-icons">done</i> Successfully imported TopScore data.
            </div>
          )}

        </div>

        {!!teams.length && (

          <div className="teamList section">

            <h3>Review Teams</h3>

            <TeamList teams={teams} />

          </div>
        )}

      </Layout>
    );
  }
}

export default connect(selector, dispatcher)(TeamsPage);