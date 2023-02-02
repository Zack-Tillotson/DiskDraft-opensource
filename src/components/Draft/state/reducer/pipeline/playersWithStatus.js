// Add player draft status to each player

// Players can have the following statuses
// 1. TeamDrafted - the player has been selected during the draft.
// 2. TeamBaggaged - the player's baggage was drafted during the draft and so must be selected.
// 3. Drafted - the player or their baggage has been selected by another team
// 4. VectorLimited - the player's team has an undrafted baggage with vector higher than this player.
// 5. GenderLimited - the player's team already has enough of this player's gender
// 6. Draftable - able to draft!
// 7. Removed - player is removed from the draft

// * Limited statuses are overriden by baggage drafts.

export default function(pipeline, action) {

  let {players, contextTeam, selections, settings} = pipeline; // Get from pipeline if exists already

  players.forEach(player => {

    if(player['_removed']) {
      return player.status = 'Removed';
    }

    // Team Drafted
    if(contextTeam && contextTeam.selectedPlayers.find(selectedPlayer => player.id === selectedPlayer.id)) {
      return player.status = 'TeamDrafted';
    }

    // Team baggage
    if(contextTeam && contextTeam.baggage.find(baggagePlayer => player.id === baggagePlayer.id)) {
      return player.status = 'TeamBaggaged';
    }

    // Drafted (another team)
    if(player.team) {
      return player.status = 'Drafted';
    }

    // Vector limited
    if(settings.baggageVectorLimitDrafts && contextTeam && contextTeam.baggage.find(teamPlayer => (
      teamPlayer.id !== player.id && teamPlayer.vector >= player.vector
    ))) {
      return player.status = 'VectorLimited';
    }

    // Gender limited

    return player.status = 'Draftable';

  });


  return players;

}