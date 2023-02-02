// Add baggage to players

export default function(pipeline, action) {

  let {players} = pipeline; // Get from pipeline if exists already

  players.forEach(player => {
    const baggage = !player.baggage_group_id ? [] :
      players.filter(bagPlayer => 
        bagPlayer.baggage_group_id === player.baggage_group_id && bagPlayer.id !== player.id
      );
    player.baggage = baggage;
  });

  return players;

}