// Calculates the draft order of the teams, from round 1 through the end of the draft.

export default function draftOrder(pipeline, action) {

  const sortedTeams = pipeline.teams
    .sort((a, b) => a.draftId - b.draftId);
  const reverseSortedTeams = [...sortedTeams].reverse();

  let ret = [];
  let round = 1;

  while(ret.length < pipeline.players.length) {

    const roundOrderedTeams = (pipeline.settings.useSnakeOrder && round % 2 === 0)
      ? reverseSortedTeams
      : sortedTeams;

    const roundTeams = roundOrderedTeams.map((team, index) => ({
      team,
      round,
      selection: index + 1,
      overallSelection: (round - 1) * roundOrderedTeams.length + index + 1,
    }));

    ret = [...ret, ...roundTeams];
    round++;
  }

  return ret;  
}