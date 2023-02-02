import actions from './actions';

import ga from 'ga';

export default function(dispatch, ownProps) {

  return {

    // Dashboard

    beginOrganizationListSync() {
      return dispatch(actions.beginOrganizationListSync());
    },

    endOrganizationListSync() {
      return dispatch(actions.endOrganizationListSync());
    },

    beginOrganizationSync(organizationId) {
      return dispatch(actions.beginOrganizationSync(organizationId));
    },

    endOrganizationSync(organizationId) {
      return dispatch(actions.endOrganizationSync(organizationId));
    },

    refreshOrganizationEvents(organization) {
      return dispatch(actions.refreshOrganizationEvents(organization));
    },

    activateOrganization(orgKey) {
      return dispatch(actions.activateOrganization(orgKey));
    },

    paginateOrgEvents(increase = true) {
      return dispatch(actions.paginateOrgEvents(increase ? 1 : -1));
    },

    addOrganizationMember(organization) {
      ga('send', {
        hitType: 'event',
        eventCategory: 'Organization/AddMember',
        eventAction: 'Dashboard',
      });
      return dispatch(actions.addOrganizationMember(organization));
    },

    closeAddOrganizationMember() {
      return dispatch(actions.closeAddOrganizationMember());
    },

    // Organization form

    submitOrganizationForm(organization) {
      ga('send', {
        hitType: 'event',
        eventCategory: 'Organization/Create',
        eventAction: 'Dashboard',
      });
      return dispatch(actions.submitOrganizationForm(organization));
    },

    validateOrganizationForm(organization) {
      return dispatch(actions.validateOrganizationForm(organization));
    },

    deleteOrganization(organization) {
      return dispatch(actions.deleteOrganization(organization));
    },

    ensureFormInitialized(organization, userOrganizations) {
      const action = actions.ensureFormInitialized(organization, userOrganizations);
      if(action) {
        return dispatch(actions.ensureFormInitialized(organization, userOrganizations));  
      }
      return false;
    },

    // Draft Meta

    beginDraftMetaSync(pathKey) {
      return dispatch(actions.beginDraftMetaSync(pathKey));
    },

    endDraftMetaSync() {
      return dispatch(actions.endDraftMetaSync());
    },

    createDraft(organization, event) {
      ga('send', {
        hitType: 'event',
        eventCategory: 'Draft/Create',
        eventAction: 'Dashboard',
      });
      return dispatch(actions.createDraft(organization, event));
    },

    removeDraft(organization, event) {
      ga('send', {
        hitType: 'event',
        eventCategory: 'Draft/Delete',
        eventAction: 'Dashboard',
      });
      return dispatch(actions.removeDraft(organization, event));
    },

    // Add Organization Member

    syncJoinInformation(joinKey) {
      return dispatch(actions.syncJoinInformation(joinKey));
    },

    claimOrganizationInvite(joinKey, orgKey) {
      ga('send', {
        hitType: 'event',
        eventCategory: 'Organization/Join',
        eventAction: 'Dashboard',
      });
      return dispatch(actions.claimOrganizationInvite(joinKey, orgKey));
    },

  }
}