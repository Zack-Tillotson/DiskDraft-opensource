// A list of players matching the player search term

export default function(pipeline, action) {

  const {ui: {dashboardTabOptions: {searchTerm}}, players} = pipeline;

  if(!searchTerm) {
    return [];
  }

  return players.filter(player => 
    player.draftId == searchTerm ||
    player.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    player.last_name.toLowerCase().includes(searchTerm.toLowerCase())
  )
  .sort((a, b) => a.draftId - b.draftId)
  .slice(0, 10);

}