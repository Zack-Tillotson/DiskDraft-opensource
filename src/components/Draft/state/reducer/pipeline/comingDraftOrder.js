// The rounds of draft left still coming up.

const defaultState = [];

export default function(pipeline, action) {

  const {selections, draftOrder} = pipeline;
  const draftNumber = selections.length;

  return draftOrder.slice(draftNumber);
}