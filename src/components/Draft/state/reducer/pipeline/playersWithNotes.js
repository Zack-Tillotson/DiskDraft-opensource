// Add user notes to players
import get from 'lodash.get';

export default function(pipeline, action) {

  let {players, privateUser} = pipeline;

  if(!privateUser) {
    privateUser = {};
  }

  let privateUserPlayers = privateUser.players || {};

  return players.map(player => ({
    ...player,
    _note: get(privateUser, `players.${player.id}.note`, 0),
  }));

}