// This state stores the currently selecting team. If that team is also the context
// team then the isContextTeam attribute is true.

const defaultState = {

  // Team data
  name: '',
  color: '#fff',
  draftId: -1,

  // Meta
  isContextTeam: false,

}

export default function(pipeline, action) {

  const draftNumber = pipeline.selections.length; // TODO calculate correctly
  const team = (pipeline.draftOrder[draftNumber] || {}).team;

  return {...defaultState, ...team};
}