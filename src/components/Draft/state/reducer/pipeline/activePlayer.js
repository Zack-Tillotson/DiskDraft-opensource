// This state stores the currently selecting team. If that team is also the context
// team then the isContextTeam attribute is true.

export default function(pipeline, action) {

  const {ui: {selectedPlayerId}, players} = pipeline;

  if(players.length === 0) {
    return null;
  }

  const player = players.find(player => player.draftId === selectedPlayerId);

  return player || null;

}