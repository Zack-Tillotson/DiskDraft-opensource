// Empty the search players if we're actually doing a baggage search

export default function(pipeline, action) {

  let {searchedPlayers, ui: {dashboardTabOptions: {teamBaggageAssignId}}} = pipeline;

  if(teamBaggageAssignId) {
    return [];
  } else {
    return searchedPlayers;
  }

}