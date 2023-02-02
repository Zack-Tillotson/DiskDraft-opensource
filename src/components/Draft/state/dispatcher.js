import actions from './actions';
import ga from 'ga';

export default function(dispatch, ownProps) {

  function selectPlayer(playerId) {
    ga('send', {
      hitType: 'event',
      eventAction: 'Draft',
      eventCategory: 'Generic/SelectPlayer',
    });
    dispatch(actions.selectPlayer(playerId));
  }

  return {
    syncActions: {

      beginSync() {
        dispatch(actions.beginSync(ownProps.params.draftId));
      },

      endSync() {
        dispatch(actions.endSync());
      },

    },

    uiActions: {

      draftQueue: {

        selectContextTeam(teamId) {
          ga('send', {
            hitType: 'event',
            eventAction: 'Draft',
            eventCategory: 'DraftQueue/SelectTeam',
          });
          dispatch(actions.selectContextTeam(teamId));
        },

      },

      mainTabs: {

        selectTab(tabName) {
          ga('send', {
            hitType: 'event',
            eventAction: 'Draft',
            eventCategory: 'Tabs/Select',
          });
          dispatch(actions.selectTab(tabName));
        },

      },

      rightRail: {

        toggleDetailSize() {
          dispatch(actions.toggleSection('playerDetail'));
        },

      },

      dashboardTab: {

        toggleControlsActive(isActive) {
          dispatch(actions.toggleControlsActive(isActive));
        },

        playerSearchTermChanged(term) {
          dispatch(actions.playerSearchTermChanged(term));
        },

        selectPlayer,

        selectTeam(teamId) {
          dispatch(actions.selectTeam(teamId));
        },

        draftPlayer(playerId, teamId) {
          ga('send', {
            hitType: 'event',
            eventAction: 'Draft',
            eventCategory: 'Dashboard/SubmitDraft',
          });
          dispatch(actions.draftPlayer(playerId, teamId));
        },

        undoDraftPlayer() {
          ga('send', {
            hitType: 'event',
            eventAction: 'Draft',
            eventCategory: 'Dashboard/UndoDraft',
          });
          dispatch(actions.undoDraftPlayer());
        },

        skipSelectPlayer() {
          ga('send', {
            hitType: 'event',
            eventAction: 'Draft',
            eventCategory: 'Dashboard/SkipDraft',
          });
          dispatch(actions.skipDraftPlayer());
        },

        changeSetting(id, value) {
          dispatch(actions.changeSetting(id, value));
        },

        toggleTopScoreUpdateForm() {
          ga('send', {
            hitType: 'event',
            eventAction: 'Draft',
            eventCategory: 'Dashboard/ToggleForm',
          });
          dispatch(actions.toggleTopScoreForm());
        },

        updateApiCsrf(csrf) {
          ga('send', {
            hitType: 'event',
            eventAction: 'Draft',
            eventCategory: 'Dashboard/UpdateCSRF',
          });
          dispatch(actions.updateApiCsrf(csrf));
        },

        updateApiClientId(clientId) {
          ga('send', {
            hitType: 'event',
            eventAction: 'Draft',
            eventCategory: 'Dashboard/UpdateClientId',
          });
          dispatch(actions.updateApiClientId(clientId));
        },

        runUpdateTopScore() {
          ga('send', {
            hitType: 'event',
            eventAction: 'Draft',
            eventCategory: 'Dashboard/SubmitTopScore',
          });
          dispatch(actions.runUpdateTopScore());
        },

        toggleJoinDraft() {
          ga('send', {
            hitType: 'event',
            eventAction: 'Draft',
            eventCategory: 'Dashboard/ToggleJoinDraft',
          });
          dispatch(actions.toggleJoinDraft());
        },

        updateJoinDraftToken(token) {
          ga('send', {
            hitType: 'event',
            eventAction: 'Draft',
            eventCategory: 'Dashboard/JoinTokenChanged',
          });
          dispatch(actions.updateJoinDraftToken(token));
        },

      },

      teamConfigurationTable: {

        updateTeamDraftOrder(newOrder) {
          dispatch(actions.updateTeamDraftOrder(newOrder));
        },

        startTeamNameEdit(teamId) {
          dispatch(actions.toggleEditTeamName(teamId));
        },

        submitTeamNameEdit(teamId, name) {
          dispatch(actions.updateTeamName(teamId, name));
        },

        startAssignBaggage(teamId) {
          dispatch(actions.toggleAssignBaggage(teamId));
        },

        endAssignBaggage() {
          dispatch(actions.toggleAssignBaggage());
        },

        assignBaggage(shouldAdd, teamId, playerId) {
          dispatch(actions.assignBaggage(shouldAdd, teamId, playerId));
        },

        playerSearchTermChanged(term) {
          dispatch(actions.playerSearchTermChanged(term));
        },

      },

      playersTab: {

        selectPlayer,

        filterPlayers(name, value) {
          ga('send', {
            hitType: 'event',
            eventAction: 'Draft',
            eventCategory: 'PlayersTab/Filter',
          });
          dispatch(actions.filterPlayers(name, value));
        },

        sortPlayers(column) {
          ga('send', {
            hitType: 'event',
            eventAction: 'Draft',
            eventCategory: 'PlayersTab/Sort',
          });
          dispatch(actions.sortPlayers(column));
        },

        updatePlayerAttribute(columnId, playerId, value) {
          ga('send', {
            hitType: 'event',
            eventAction: 'Draft',
            eventCategory: 'PlayersTab/ChangeField',
          });
          if(columnId === 'baggage_group_id') {
            dispatch(actions.updateDraftGroupIds(playerId, value));
          } else {
            dispatch(actions.updatePlayerAttribute(columnId, playerId, value));
          }
        },

      },

      teamsTab: {

        selectPlayer,

        viewTeamRoster(teamId) {
          dispatch(actions.viewTeamRoster(teamId));
        },

        viewTeamStat(statId) {
          ga('send', {
            hitType: 'event',
            eventAction: 'Draft',
            eventCategory: 'TeamsTab/ViewStat',
          });
          dispatch(actions.viewTeamStat(statId));
        },

      },

      logTab: {

        selectPlayer,

      },

      helpTab: {
        clearColors() {
          ga('send', {
            hitType: 'event',
            eventAction: 'Draft',
            eventCategory: 'HelpTab/ClearColors',
          });
          dispatch(actions.clearPlayerNotes());
        }
      },

      playerDetail: {

        selectPlayer,

        notePlayer(playerId, isPositive) {
          ga('send', {
            hitType: 'event',
            eventAction: 'Draft',
            eventCategory: 'PlayerDetail/AddNote',
            eventValue: isPositive,
          });
          dispatch(actions.notePlayer(playerId, isPositive));
        },

        draftPlayer(playerId) {
          ga('send', {
            hitType: 'event',
            eventAction: 'Draft',
            eventCategory: 'PlayerDetail/SubmitDraft',
          });
          dispatch(actions.draftPlayer(playerId));
        },

      },

      teamRoster: {

        selectContextTeam(teamId) {
          dispatch(actions.selectContextTeam(teamId));
        },

        selectPlayer,

      },

    },
  }
}
