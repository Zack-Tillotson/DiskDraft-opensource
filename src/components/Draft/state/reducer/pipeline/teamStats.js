// Compute a list of stats, each stat will apply to each team, ie
// stats: [title: '', teams: [...]]

function getGender(players, gender) {
  return players.filter(player => player.gender === gender);
}

function getAvgHeight(players) {
  let count = 0;
  const avg = players.reduce((soFar, player) => {

    if(!isNaN(parseInt(player.height))) {
      count++;
      return soFar += player.height;
    }

    return soFar;

  }, 0) / count;

  return avg || '-';
}

function getAvgAge(players) {
  const agedPlayers = players.filter(player => !isNaN(player.age));
  return agedPlayers.reduce((soFar, player) => soFar + player.age, 0) / agedPlayers.length;
}

function getAvgVector(players) {
  return players.reduce((soFar, player) => soFar + player.vector, 0) / players.length;
}

function getAvgDraftTime(teamId, selections) {
  const teamSelections = selections.filter(selection => selection.teamId === teamId);
  return teamSelections.reduce((soFar, selection) => 
    soFar + selection.timeTaken, 0
  ) / teamSelections.length;
}

export default function(pipeline, action) {

  let {
    teams,
    selections,
  } = pipeline; // Get from pipeline if exists already

  const stats = [];

  stats.push({
    title: 'Men: Average Vector',
    teams: teams.map(team => ({
      team,
      value: getAvgVector(getGender(team.players, 'male')),
    }))
    .sort((a,b) => b.value - a.value),
  }, {
    title: 'Women: Average Vector',
    teams: teams.map(team => ({
      team,
      value: getAvgVector(getGender(team.players, 'female'))
    }))
    .sort((a,b) => b.value - a.value),
  }, {
    title: 'Men: Average Height',
    teams: teams.map(team => ({
      team,
      value: getAvgHeight(getGender(team.players, 'male')),
      type: 'height',
    }))
    .sort((a,b) => b.value - a.value),
  }, {
    title: 'Women: Average Height',
    teams: teams.map(team => ({
      team,
      value: getAvgHeight(getGender(team.players, 'female')),
      type: 'height',
    }))
    .sort((a,b) => b.value - a.value),
  }, {
    title: 'Men: Average Age',
    teams: teams.map(team => ({
      team,
      value: getAvgAge(getGender(team.players, 'male')),
      type: 'age',
    }))
    .sort((a,b) => b.value - a.value),
  }, {
    title: 'Women: Average Age',
    teams: teams.map(team => ({
      team,
      value: getAvgAge(getGender(team.players, 'female')),
      type: 'age',
    }))
    .sort((a,b) => b.value - a.value),
  }, {
    title: 'Average Draft Time',
    teams: teams.map(team => ({
      team,
      value: getAvgDraftTime(team.id, selections),
      type: 'time',
    }))
    .sort((a,b) => b.value - a.value),
  });

  return stats;

}