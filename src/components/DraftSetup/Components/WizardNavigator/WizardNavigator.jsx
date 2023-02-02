import React from 'react';

import InlineCss from "react-inline-css";
import styles from './styles';

import {connect} from 'react-redux';
import selector from '../../state/selector';
import dispatcher from '../../state/dispatcher';

import {Link} from 'react-router-dom';

class WizardNavigator extends React.Component {
  render() {

    const {draftId, step, stepsComplete, event, organization, organizationKey} = this.props;

    return (
      <InlineCss stylesheet={styles} componentName="container" className="wizardControls">

        <div className="wizardTitle">
          <Link to={`/dashboard/organizations/${organizationKey}/event/${event.id}/`}>
            {event.name}
          </Link>
        </div>
        <div className="organizationName">{organization.name}</div>

        <div className="draftStatus">Status: {this.props.status}</div>

        <div className="wizardSteps">

          <Link
            className={`wizardStep home ${step === 'dashboard' ? 'active' : 'inactive'} enabled`}
            to={`/draftSetup/${draftId}/`}>

            <i className="material-icons">home</i>
            <span className="stepText">Draft Status</span>

          </Link>

          <Link
            className={`wizardStep ${step === 'players' ? 'active' : 'inactive'} ${stepsComplete  .players ? 'valid' : 'invalid'} enabled`}
            to={`/draftSetup/${draftId}/players/`}>

            <i className="material-icons">accessibility</i>
            <span className="stepText">Add Players</span>

          </Link>

          <Link
            className={`wizardStep ${step === 'columns' ? 'active' : 'inactive'} ${stepsComplete.columns ? 'valid' : 'invalid'} ${stepsComplete.players ? 'enabled' : 'disabled'}`}
            to={`/draftSetup/${draftId}/columns/`}>

            <i className="material-icons">format_list_numbered</i>
            <span className="stepText">Player Views</span>

          </Link>

          <Link
            className={`wizardStep ${step === 'teams' ? 'active' : 'inactive'} ${stepsComplete.teams ? 'valid' : 'invalid'} ${stepsComplete.columns ? 'enabled' : 'disabled'}`}
            to={`/draftSetup/${draftId}/teams/`}>

            <i className="material-icons">supervisor_account</i>
            <span className="stepText">Teams</span>

          </Link>

          <Link
            className={`wizardStep ${step === 'settings' ? 'active' : 'inactive'} ${stepsComplete.settings ? 'valid' : 'invalid'} ${stepsComplete.teams ? 'enabled' : 'disabled'}`}
            to={`/draftSetup/${draftId}/settings/`}>

            <i className="material-icons">toc</i>
            <span className="stepText">Settings</span>

          </Link>

        </div>
      </InlineCss>
    );
  }
}

export default connect(selector, dispatcher)(WizardNavigator);