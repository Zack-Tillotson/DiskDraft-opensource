// Add players to teams

export default function(pipeline, action) {

  let {teams, players, selections, assignedBaggage, columns} = pipeline; // Get from pipeline if exists already

  teams = teams.map(team => ({players: [], baggage: [], captains: [], selectedPlayers: [], ...team}));

  // Add all of the directly selected players
  Object.keys(selections).forEach(selectionKey => {

    const selection = selections[selectionKey];

    if(selection.playerId === -1) { // Skipped drafts
      return;
    }

    const player = players.find(player => player.id === selection.playerId);
    const team = teams.find(team => team.id === selection.teamId);

    team.players.push(player);
    team.selectedPlayers.push(player);

  });

  // Add the assigned baggage for each team (aka captains and baggage)
  assignedBaggage.forEach(bag => {

    const player = players.find(player => player.id === bag.playerId);
    const team = teams.find(team => team.id === bag.teamId);

    team.captains.push(player);

    if(team.players.indexOf(player) === -1) {
      team.players.push(player);
    }

    if(team.selectedPlayers.indexOf(player) === -1) {
      team.baggage.push(player);
    }

  });

  // Add the undrafted baggage for each team
  teams.forEach(team => {

    const undraftedBaggage = [];

    team.selectedPlayers.forEach(player => {
      player.baggage.forEach(bag => {
        if(team.selectedPlayers.indexOf(bag) === -1 && undraftedBaggage.indexOf(bag) === -1) {
          undraftedBaggage.push(bag);
        }
      });
    });

    team.players.push(...undraftedBaggage);
    team.baggage.push(...undraftedBaggage);

  });

  // Final stats for the team
  if(columns.length) {
    try {
      const genderColumnId = columns.find(column => column.type === 'Gender').id;
      teams.forEach(team => {
        const menCount = team.players.filter(player => player[genderColumnId] === 'male').length;
        const womenCount = team.players.length - menCount;

        team.stats = {
          menCount,
          womenCount,
        }
      })
    } catch(e) {
      if(__DEBUG__) {
        console.log('teamsWithPlayers: stats error');
      }
    }
  }

  return teams;

}
