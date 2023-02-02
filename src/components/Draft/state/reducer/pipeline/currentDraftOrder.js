// The currently active draft order selection

const defaultState = [];

export default function(pipeline, action) {

  const {selections, draftOrder} = pipeline;
  const draftNumber = selections.length;

  return draftOrder[draftNumber] || null;
}