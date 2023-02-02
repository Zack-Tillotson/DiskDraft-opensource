// The rounds of draft left still coming up.

const defaultState = [];

export default function(pipeline, action) {

  const {draftOrder, selections, players} = pipeline;
  const draftNumber = selections.length;

  return draftOrder
    .slice(0, draftNumber)
    .map((draftOrder, index) => {

      const selection = selections.find(selection => selection.selectionOrder === (index + 1));
      const player = players.find(player => player.id === selection.playerId) || {};
      const isSkip = selection.playerId === -1;

      return {
        ...draftOrder,
        player,
        isSkip,
      };
    })
    .reverse();
}