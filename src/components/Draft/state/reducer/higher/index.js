import {pickAttributes} from './util';

// Display timing information for the current selection. Includes selection timing information
// itself like the start time, how much is left, if it's in warning, etc, and also the current
// team information.
const selectionTimer = pickAttributes([
  'selectionTime',
  'currentTeam',
  'currentDraftOrder',
]);

// The teams in draft order, starting with the currently active team
const draftQueue = pickAttributes([
  'comingDraftOrder',
]);

// The teams in reverse draft order, ending with the last team to make a selection
const draftHistory = pickAttributes([
  'priorDraftOrder',
]);

// A context team aware selection countdown
const selectionTurnCountdown = pickAttributes([
  'turnsTillSelection',
  'hasMoreSelections',
]);

// The tabs that are available in the main content section
const mainTabs = pickAttributes([
  'ui.selectedTab',
  'availableTabs',
]);

// The dashboard tab: A catchall tab of useful information and tools
const dashboardTab = pickAttributes([
  'sessions',
  'selectionTime',
  'selections',
  'columns',
  'activePlayer',
  'searchedPlayers',
  'joinDraft',
  'ui.dashboardTabOptions.searchTerm',
  'ui.dashboardTabOptions.topScoreFormOpen',
  'ui.dashboardTabOptions.topScoreCsrf',
  'ui.dashboardTabOptions.topScoreClientId',
  'ui.dashboardTabOptions.topScoreAjax',
  'teams',
  'currentDraftOrder',
  'settings',
  'organization',
]);

// The team configuration table: A complex piece of the admin's Dashboard tab
const teamConfigurationTable = pickAttributes([
  'ui.dashboardTabOptions.teamNameEditId',
  'ui.dashboardTabOptions.teamBaggageAssignId',
  'ui.dashboardTabOptions.searchTerm',
  'columns',
  'baggageSearchedPlayers',
  'teams',
]);

// The players tab: A sortable, filterable table of players
const playersTab = pickAttributes([
  'players',
  'settings',
  'columns',
  'ui.playersTabOptions',
  'permissions.isAdmin',
  'activePlayer',
]);

// The teams tab: An overview of teams
const teamsTab = pickAttributes([
  'teams',
  'columns',
  'ui.teamsTabOptions',
  'contextTeamStats',
  'activeStatTeams',
]);

const logTab = pickAttributes([
  'selections',
  'settings.hideHistory',
  'permissions.isAdmin',
]);

const helpTab = pickAttributes([
  'permissions.isAdmin',
]);

// The active player
const playerDetail = pickAttributes([
  'activePlayer',
  'ui.selectedPlayerId',
  'columns',
  'mayCurrentlyDraft',
]);

const teamRoster = pickAttributes([
  'teams',
  'contextTeam',
  'ui.contextTeamId',
  'columns',
  'settings.baggageVectorLimitDrafts',
]);

const rightRail = pickAttributes([
  'ui.rightRailOptions.expandedDetail',
]);

const higherReducers = {

  // Left rail
  selectionTimer,
  selectionTurnCountdown,
  draftQueue,
  draftHistory,

  // Main section
  mainTabs,
  dashboardTab,
  teamConfigurationTable,
  playersTab,
  teamsTab,
  logTab,
  helpTab,

  // Right rail
  rightRail,
  playerDetail,
  teamRoster,

}

export default function(basic, pipeline, action) {

  const state = Object.keys(higherReducers)
    .reduce((state, attr) => {
      state[attr] = higherReducers[attr](basic, pipeline, action);
      return state;
    }, {});

  return state;
}