export default function teamsWithContext(pipeline, action) {

  const {teams, contextTeam} = pipeline;

  return teams.map(team => ({
      ...team,
      isContextTeam: (contextTeam ? team.id === contextTeam.id : false),
    }));
}
