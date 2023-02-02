export default function turnsTillSelection(pipeline, action) {

  const {ui: {contextTeamId}, selections, currentDraftOrder, comingDraftOrder} = pipeline;
  const draftNumber = selections.length;

  if(currentDraftOrder && comingDraftOrder.team && currentDraftOrder.team.id === contextTeamId) {
    return 0;
  }

  return comingDraftOrder
    .reduce((foundIndex, selection, index) => 
      foundIndex >= 0 ? foundIndex : (selection.team.id === contextTeamId ? index : -1)
    , -1);

}