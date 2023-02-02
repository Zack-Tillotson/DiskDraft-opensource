// Add players to teams

export default function(pipeline, action) {

  let {players, assignedBaggage} = pipeline; // Get from pipeline if exists already

  return assignedBaggage.map(assignment => {
    const player = players.find(player => player.id === assignment.playerId);

    return {
      ...assignment,
      player,
      team: player.team,
    };
  });

}