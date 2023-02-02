import actionTypes from '../actionTypes';
import firebaseActionTypes from '../../../../firebase/actionTypes';

function mergePlayerArrays(one, two) {

  // Ensure all attribute names are lower cased
  one = one.map(player => {
    const ret = {};
    Object.keys(player).forEach(attr => ret[attr.toLowerCase()] = player[attr]);
    return ret;
  });

  two = two.map(player => {
    const ret = {};
    Object.keys(player).forEach(attr => ret[attr.toLowerCase()] = player[attr]);

    if(ret.height) {
      try {
        if(typeof ret.height === 'string' && ret.height.indexOf("'") >= 0) {
          const pieces = ret.height.split(/['"]/);
          const cm = (parseInt(pieces[0])*12 + parseInt(pieces[1])) * 2.54;
          ret.height = cm;
        }
      } catch(e) {
        if(__DEBUG__) {
          console.log("DraftSetup players reducer error", e);
        }
      }
    }

    return ret;
  });

  // Using the first array as the base, for any players in both arrays, merge the players
  one = one.map(onePlayer => {
    const twoPlayer = two.find(twoPlayer => onePlayer.id == twoPlayer.id);
    if(twoPlayer) {
      
      // Don't overwrite data with empty data
      const ret = {...onePlayer};
      Object.keys(twoPlayer).forEach(attr => {
        if(twoPlayer[attr]) {
          ret[attr] = twoPlayer[attr];
        }
      });
      ret.id = onePlayer.id;

      return ret;
    } else {
      return onePlayer;
    }
  })

  // For any players only in the second array
  const newTwos = two
    .filter(twoPlayer => !one.find(onePlayer => onePlayer.id == twoPlayer.id))
    .map(player => ({...player, id: parseInt(player.id), role: (player.roles || player.role || '')}));

  // Don't include weird registrants that aren't 'players' or 'captains'
  const validPlayers = ([...one, ...newTwos]).filter(player => player.id && (player.roles.indexOf('player') >= 0 || player.roles.indexOf('captain') >= 0));

  // Make sure we have meta information for everyone
  return validPlayers.map(player => {
    
    if(!'_include' in player) {
      player = {...player, _include: true}
    }

    return player;
  });
}

function players(state = [], action) {

  if(action.type === firebaseActionTypes.dataReceived && action.dataType === 'draftMeta') {

    const {data = {}} = action;
    const {draftData = {}} = data;
    const {players} = draftData;
    if(players) {
      return Object.keys(players).map(playerId => players[playerId]);
    }

  } else if(action.type === actionTypes.importTopScoreData && action.dataType === 'players' && action.success) {

    const {players = []} = action;
    return mergePlayerArrays(state, players);

  } else if(action.type === actionTypes.csvLoaded && action.dataType === 'players' && action.success) {

    const {players = []} = action;
    return mergePlayerArrays(state, players);

  }

  return state; 
}

function applySettings(players, settings) {

  const unacceptedPlayerSetting = settings.find(setting => setting.id === 'removeUnaccepted');

  let draftId = 1;
  return players.map(player => {

    const shouldRemoveUnaccepted = unacceptedPlayerSetting && unacceptedPlayerSetting.value;
    
    const _include = !shouldRemoveUnaccepted || player.status === 'accepted';
    const draft_id = _include ? draftId++ : 0;

    return {
      ...player,
      _include,
      draft_id,
    }
  });

}

export default function(state, action, pipelineState) {
  return applySettings(players(state, action), pipelineState.settings);
}