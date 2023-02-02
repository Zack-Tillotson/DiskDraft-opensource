import actionTypes from '../actionTypes';
import firebaseActionTypes from '../../../../firebase/actionTypes';

import { defaultColumnValues, vector, age, birthDate } from '../../columnTypes';

function mergeColumnArrays(one, players = [], includeAll = false) {
  players = players.filter(players => !!players.id);

  const player = players[0] || {};
  const two = Object.keys(player).map(id => ({ id: id.toLowerCase() }));

  // Using the first array as the base, for any column in both arrays, merge them
  one = one.map(oneCol => {
    const twoCol = two.find(
      twoCol => oneCol.id.toLowerCase() == twoCol.id.toLowerCase()
    );
    if (twoCol) {
      return { ...oneCol, ...twoCol, id: oneCol.id };
    } else {
      return oneCol;
    }
  });

  // For any columns only in the second array
  const newTwos = two
    .filter(twoCol => !!twoCol.id)
    .filter(twoCol => !one.find(oneCol => oneCol.id == twoCol.id))
    .filter(twoCol => twoCol.id.charAt(0) !== '_');

  // Make sure we have meta information for everyone
  return [...one, ...newTwos]
    .map(column => {
      const { id } = column;

      const defaultValue =
        (id.match(/^Product /)
          ? defaultColumnValues.__products__
          : defaultColumnValues[id]) || defaultColumnValues.default;

      let display =
        defaultValue.display ||
        id
          .split('_')
          .filter(piece => !!piece)
          .map(piece => piece.charAt(0).toUpperCase() + piece.slice(1))
          .join(' ');

      let include = includeAll;

      if (!include) {
        // aka includeAll false
        if (typeof column.include !== 'undefined') {
          // Don't overwrite existing config
          include = column.include;
        } else if (typeof defaultValue.include !== 'undefined') {
          include = defaultValue.include;
        } else {
          include =
            defaultValue.required ||
            !!players.find(aPlayer =>
              players.find(
                bPlayer =>
                  aPlayer.id !== bPlayer.id && aPlayer[id] !== bPlayer[id]
              )
            );
        }
      }

      let { order } = column;

      if (!order) {
        order = 10000 + Math.random();
      }

      return {
        ...defaultValue,
        ...column,
        id,
        display,
        include,
        order
      };
    })
    .sort((a, b) => a.order - b.order);
}

const defaultColumns = [
  { ...defaultColumnValues.player, id: 'player' },
  { ...defaultColumnValues.draft_id, id: 'draft_id' }
];
function columns(state = defaultColumns, action, nextState) {
  if (
    action.type === firebaseActionTypes.dataReceived &&
    action.dataType === 'draftMeta'
  ) {
    const { data = {} } = action;
    const { draftData = {} } = data;
    const { columns, players } = draftData;

    if (columns) {
      return columns;
    } else {
      return mergeColumnArrays(state, players);
    }
  } else if (action.type === actionTypes.importOrganizationData) {
    const { columns = {} } = action.orgData;
    return columns;
  } else if (
    action.type === actionTypes.importTopScoreData &&
    action.dataType === 'players' &&
    action.success
  ) {
    const { players = [] } = action;
    return mergeColumnArrays(state, players);
  } else if (
    action.type === actionTypes.csvLoaded &&
    action.dataType === 'players' &&
    action.success
  ) {
    const { players = [] } = action;
    return mergeColumnArrays(state, players);
  } else if (action.type === actionTypes.updateColumnAttribute) {
    const { id, attr, value } = action;
    return state
      .map(col => {
        if (col.id === id) {
          let { order } = col;

          if (attr === 'include' && value) {
            order = state[state.length - 1].order + 1;
          }

          return {
            ...col,
            order,
            [attr]: value
          };
        } else {
          return col;
        }
      })
      .sort((a, b) => a.order - b.order);
  }

  return state;
}

export default columns;
