// This state stores the currently selecting team. If that team is also the context
// team then the isContextTeam attribute is true.

export default function(pipeline, action) {

  const {ui: {selectedTeamId}, teams, currentDraftOrder} = pipeline;

  const team = teams.find(team => team.id === selectedTeamId);

  if(teams.length === 0 || !team) {
    return {};
  }

  return currentDraftOrder.team;

}