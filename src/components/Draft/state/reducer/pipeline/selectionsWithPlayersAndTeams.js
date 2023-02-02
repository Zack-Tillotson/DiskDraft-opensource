export default function(pipeline, action) {

  let {selections, draftOrder, players, teams} = pipeline;

  return selections.map(selection => {

    const isSkip = selection.playerId === -1;
    let player = {}, team = {};

    if(!isSkip) {
      player = players.find(player => player.id === selection.playerId);
      team = player.team;
    }

    const draftOrderInfo = draftOrder[selection.selectionOrder - 1];
    const {round} = draftOrderInfo;

    return {
      ...selection,
      player,
      team,
      round,
      isSkip,
    }
  });

}