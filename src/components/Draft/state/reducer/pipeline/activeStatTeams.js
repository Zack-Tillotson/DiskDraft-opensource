// Each of the team values for the active stat

export default function(pipeline, action) {

  let {
    teamStats,
    ui: {
      teamsTabOptions: {
        activeStat,
      },
    },
  } = pipeline; // Get from pipeline if exists already

  if(!teamStats[activeStat]) {
    return [];
  }

  return teamStats[activeStat].teams;

}