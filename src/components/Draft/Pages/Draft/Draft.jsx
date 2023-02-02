import React from 'react';

import InlineCss from "react-inline-css";
import styles from './styles';

import {connect} from 'react-redux';
import selector from '../../state/selector';
import dispatcher from '../../state/dispatcher';

import LoginForm from '../../../Framework/LoginForm';

// Left rail
import TitlePromo from '../../components/TitlePromo';
import SelectionTimer from '../../components/SelectionTimer';
import SelectionCountdown from '../../components/SelectionCountdown';
import DraftQueue from '../../components/DraftQueue';
import DraftHistory from '../../components/DraftHistory';

// Main section
import MainTabs from '../../components/MainTabs';
import DashboardTab from '../../components/DashboardTab';
import PlayersTab from '../../components/PlayersTab';
import TeamsTab from '../../components/TeamsTab';
import LogTab from '../../components/LogTab';
import HelpTab from '../../components/HelpTab';

// Right rail
import PlayerDetail from '../../components/PlayerDetail';
import SectionExpander from '../../components/SectionExpander';
import TeamRoster from '../../components/TeamRoster';

class DraftPage extends React.Component {
  static propTypes = {

  };

  // Lifecylce hooks //

  componentDidMount() {
    if(this.props.firebase.authInfo) {
      this.syncDraftInformation();
    }
  }

  componentWillReceiveProps(newProps) {
    if(!this.props.firebase.isLoggedIn && newProps.firebase.isLoggedIn) {
      this.syncDraftInformation();
    }
  }

  // Data management //

  syncDraftInformation = () => {
    this.props.syncActions.beginSync();
  };

  endSyncDraftInformation = () => {
    this.props.syncActions.endSync();
  };

  isSynced = () => {
    return this.props.basic.isSynced.draft || this.props.firebase.authConnected;
  };

  // Event handlers //

  // Renders //

  renderLoadingMessage = () => {
    return (
      <InlineCss stylesheet={styles} componentName="container">
        <div className="loader"><span>{'Disk'}</span><span>{'Draft'}</span></div>
      </InlineCss>
    );
  };

  render() {

    const {
      organizations,
      joinOrg,
      firebase,
      higher,
      uiActions,
    } = this.props;

    if(!this.isSynced()) {
      return this.renderLoadingMessage();
    }

    if(!firebase.isLoggedIn) {
      return (
        <InlineCss stylesheet={styles} componentName="container">
          <div className="requiresLogin">
            <div className="loginRequirementExplanation">
              You have been invited to join a draft. Please log in to continue.
            </div>
            <LoginForm />
          </div>
        </InlineCss>
      );
    }

    const rightRailClass = higher.rightRail.expandedDetail ? 'expanded' : 'not-expanded';
    const activePlayerClass = higher.playerDetail.activePlayer ? 'active' : 'not-active';

    return (
      <InlineCss stylesheet={styles} componentName="container">

        <section className="leftRail">
          <TitlePromo />
          <SelectionTimer {...higher.selectionTimer} serverTimeOffset={firebase.serverTimeOffset} />
          <SelectionCountdown {...higher.selectionTurnCountdown} />
          <DraftQueue {...higher.draftQueue} {...uiActions.draftQueue} />
          <DraftHistory {...higher.draftHistory} />
        </section>

        <section className="mainSection">
          <MainTabs {...higher.mainTabs} {...uiActions.mainTabs} />
          {higher.mainTabs.selectedTab === 'Dashboard' && (
            <DashboardTab {...higher.dashboardTab} {...uiActions.dashboardTab} />
          )}
          {higher.mainTabs.selectedTab === 'Players' && (
            <PlayersTab {...higher.playersTab} {...uiActions.playersTab} />
          )}
          {higher.mainTabs.selectedTab === 'Teams' && (
            <TeamsTab {...higher.teamsTab} {...uiActions.teamsTab} />
          )}
          {higher.mainTabs.selectedTab === 'Log' && (
            <LogTab {...higher.logTab} {...uiActions.logTab} />
          )}
          {higher.mainTabs.selectedTab === 'Help' && (
            <HelpTab {...higher.logTab} {...uiActions.helpTab} />
          )}
        </section>

        <section className={`rightRail ${rightRailClass} ${activePlayerClass}`}>

          <PlayerDetail {...higher.playerDetail} {...uiActions.playerDetail} />
          <SectionExpander {...higher.rightRail} {...uiActions.rightRail} />
          <TeamRoster {...higher.teamRoster} {...uiActions.teamRoster} />

        </section>

      </InlineCss>
    );
  }
}

export default connect(selector, dispatcher)(DraftPage);
