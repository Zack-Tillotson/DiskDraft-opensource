import actions from './actions';

import ga from 'ga';

export default function(dispatch, ownProps) {

  return {

    // Data sync

    beginDraftSync(draftId) {
      return dispatch(actions.beginDraftSync(draftId));
    },

    endDraftSync() {
      return dispatch(actions.endDraftSync());
    },

    beginOrganizationSync(organizationId) {
      return dispatch(actions.beginOrganizationSync(organizationId));
    },

    endOrganizationSync() {
      return dispatch(actions.endOrganizationSync());
    },

    // Wizard

    submitStep(step) {
      const draftId = ownProps.params.draftId;
      ga('send', {
        hitType: 'event',
        eventAction: 'Wizard/SaveStep',
        eventCategory: 'DraftSetup',
      });
      return dispatch(actions.submitStep(draftId, step));
    },

    skipStep(step) {
      return dispatch(actions.skipStep(step));
    },

    importTopScoreTeams(draftId) {
      ga('send', {
        hitType: 'event',
        eventCategory: 'TeamsStep/ImportTeams',
        eventAction: 'DraftSetup',
      });
      return dispatch(actions.importTopScoreTeams(draftId));
    },

    importTopScorePlayers(draftId) {
      ga('send', {
        hitType: 'event',
        eventCategory: 'PlayersStep/ImportPlayers',
        eventAction: 'DraftSetup',
      });
      return dispatch(actions.importTopScorePlayers(draftId));
    },

    importCsvData(targetFile) {
      ga('send', {
        hitType: 'event',
        eventCategory: 'PlayersStep/ImportPlayersCSV',
        eventAction: 'DraftSetup',
      });
      return dispatch(actions.importCsvData(targetFile));
    },

    importOrganizationData() {
      return dispatch(actions.importOrganizationData());
    },

    deleteOrganizationData() {
      return dispatch(actions.deleteOrganizationData());
    },

    selectDetailPlayer(playerIndex) {
      return dispatch(actions.selectDetailPlayer(playerIndex));
    },

    changeSetting(name, value) {
      dispatch(actions.changeSetting(name, value));
    },

    updateColumnAttribute(id, attr, value) {
      dispatch(actions.updateColumnAttribute(id, attr, value));
    },

    publishDraft(saveConfig) {
      ga('send', {
        hitType: 'event',
        eventCategory: 'ReviewStep/PublishDraft',
        eventAction: 'DraftSetup',
      });
      dispatch(actions.publishDraft(saveConfig));
    },

  }
}