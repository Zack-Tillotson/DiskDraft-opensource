// Add teams to players

export default function(pipeline, action) {

  let {players, teams} = pipeline; // Get from pipeline if exists already

  teams.forEach(team => {
    team.players.forEach(player => player.team = team)
  })
  
  return players;

}