// Return all of the stats for our current context team

export default function(pipeline, action) {

  let {
    teamStats,
    contextTeam,
  } = pipeline; // Get from pipeline if exists already

  if(!contextTeam) {
    return [];
  }

  return teamStats.map(stat => {

    const {title, teams} = stat;

    const team = teams.find(team => team.team.id === contextTeam.id);

    if(!team) {
      return null;
    }

    const {value, type} = team;

    return {
      title,
      value,
      type,
    }
  })
  .filter(stat => !!stat);

}