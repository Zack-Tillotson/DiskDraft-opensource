import React from 'react';
import PropTypes from 'prop-types';

import InlineCss from "react-inline-css";
import styles from './styles';

import {Link} from 'react-router-dom';

class StepStatus extends React.Component {
  static propTypes = {
    stepsComplete: PropTypes.object.isRequired,
    draftId: PropTypes.string.isRequired,
  };

  render() {

    const {stepsComplete, draftId} = this.props;

    return (
      <InlineCss stylesheet={styles} componentName="container">

        <ul className="stepExplanation">
          <li>Use this form to create and configure the draft for your event.</li>
          <li>Your draft will only be visible to you until you publish the draft.</li>
          <li>Once published you can share a direct link to the draft with captains.</li>
        </ul>

        <table className="stepReview">
          <tbody>
            <tr>
              <td className="stepNum">1.</td>
              <td className="stepName">Player Data</td>
              <td className="statusIcon">{stepsComplete.players && '✓'}</td>
              <td className="stepStatus">{stepsComplete.players ? 'Complete' : 'Incomplete'}</td>
              <td className="stepLink">
                <Link className="activeStepLink" to={`/draftSetup/${draftId}/players/`}>
                  {stepsComplete.players ? 'Review' : 'Start'}
                </Link>
              </td>
            </tr>
            <tr>
              <td className="stepNum">2.</td>
              <td className="stepName">Player View</td>
              <td className="statusIcon">{stepsComplete.columns && '✓'}</td>
              <td className="stepStatus">{stepsComplete.columns ? 'Complete' : 'Incomplete'}</td>
              <td className="stepLink">
                {(stepsComplete.players || stepsComplete.columns) && (
                  <Link className="activeStepLink" to={`/draftSetup/${draftId}/columns/`}>
                    {stepsComplete.columns ? 'Review' : 'Start'}
                  </Link>
                )}
              </td>
            </tr>
            <tr>
              <td className="stepNum">3.</td>
              <td className="stepName">Team Data</td>
              <td className="statusIcon">{stepsComplete.teams && '✓'}</td>
              <td className="stepStatus">{stepsComplete.teams ? 'Complete' : 'Incomplete'}</td>
              <td className="stepLink">
                {(stepsComplete.teams || stepsComplete.columns) && (
                  <Link className="activeStepLink" to={`/draftSetup/${draftId}/teams/`}>
                    {stepsComplete.teams ? 'Review' : 'Start'}
                  </Link>
                )}
              </td>
            </tr>
            <tr>
              <td className="stepNum">4.</td>
              <td className="stepName">Settings</td>
              <td className="statusIcon">{stepsComplete.settings && '✓'}</td>
              <td className="stepStatus">{stepsComplete.settings ? 'Complete' : 'Incomplete'}</td>
              <td className="stepLink">
                {(stepsComplete.teams || stepsComplete.settings) && (
                  <Link className="activeStepLink" to={`/draftSetup/${draftId}/settings/`}>
                    {stepsComplete.settings ? 'Review' : 'Start'}
                  </Link>
                )}
              </td>
            </tr>
          </tbody>
        </table>

      </InlineCss>
    );
  }
}

export default StepStatus;