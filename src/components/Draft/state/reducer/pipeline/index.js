import objectToArray from './objectToArray';

import draftOrder from './draftOrder';
import availableTabs from './availableTabs';
import currentTeam from './currentTeam';
import selectionTime from './selectionTime';
import activePlayer from './activePlayer';
import activeTeam from './activeTeam';

import searchedPlayers from './searchedPlayers';
import searchedPlayersBaggageFilter from './searchedPlayersBaggageFilter';
import baggageSearchedPlayers from './baggageSearchedPlayers';

import joinDraft from './joinDraft';

import turnsTillSelection from './turnsTillSelection'; // draftOrder
import hasMoreSelections from './hasMoreSelections'; // draftOrder
import comingDraftOrder from './comingDraftOrder'; // draftOrder
import currentDraftOrder from './currentDraftOrder'; // draftOrder
import priorDraftOrder from './priorDraftOrder'; // draftOrder

import playersWithNotes from './playersWithNotes';
import playersWithBaggage from './playersWithBaggage';
import playersWithTeam from './playersWithTeam';

import teamsWithPlayers from './teamsWithPlayers';

import contextTeam from './contextTeam';

import playersWithStatus from './playersWithStatus';
import playersSorted from './playersSorted';

import teamsWithContext from './teamsWithContext';

import teamStats from './teamStats';
import contextTeamStats from './contextTeamStats';
import activeStatTeams from './activeStatTeams';

import selectionsWithPlayersAndTeams from './selectionsWithPlayersAndTeams';
import assignmentsWithPlayersAndTeams from './assignmentsWithPlayersAndTeams';

import mayCurrentlyDraft from './mayCurrentlyDraft';

const pipelineReducers = [

  {selections: objectToArray('selections')},
  {sessions: objectToArray('sessions')},

  {joinDraft},

  {players: playersSorted},
  {players: playersWithNotes},
  {players: playersWithBaggage},
  {teams: teamsWithPlayers},
  {players: playersWithTeam},

  {draftOrder},
  {comingDraftOrder},
  {currentDraftOrder},
  {priorDraftOrder},

  {contextTeam},

  {teams: teamsWithContext},

  {availableTabs},
  {currentTeam},
  {selectionTime},

  {searchedPlayers},
  {baggageSearchedPlayers},
  {searchedPlayers: searchedPlayersBaggageFilter},

  {activePlayer},
  {activeTeam},

  {hasMoreSelections},
  {turnsTillSelection},

  {players: playersWithStatus},
  {selections: selectionsWithPlayersAndTeams},
  {baggageAssignments: assignmentsWithPlayersAndTeams},

  {mayCurrentlyDraft},

  {teamStats},
  {contextTeamStats},
  {activeStatTeams},

];

// Run through each reducer in order and add its output to the "pipeline"
export default function(state, action) {

  const pipeline = JSON.parse(JSON.stringify(state));

  pipelineReducers.forEach(reducerGroup => {
    Object.keys(reducerGroup)
      .forEach(attr => pipeline[attr] = reducerGroup[attr](pipeline, action));
  });

  return pipeline;
}