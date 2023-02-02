// Grab the team that matches the contextTeamId

export default function(pipeline, action) {

  let {
    teams,
    ui: {contextTeamId},
    currentDraftOrder,
  } = pipeline; // Get from pipeline if exists already

  const team = teams.find(team => team.id === contextTeamId);

  if(team) {
    return team;
  } else if(currentDraftOrder) {
    return currentDraftOrder.team;
  } else {
    return null;
  }

}