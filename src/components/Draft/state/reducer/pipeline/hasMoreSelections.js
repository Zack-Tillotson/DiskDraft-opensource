export default function hasMoreSelections(pipeline, action) {

  const {ui: {contextTeamId}, selections, comingDraftOrder} = pipeline;
  const draftNumber = selections.length;

  return !!(
    comingDraftOrder
      .find(selection => selection.team.id === contextTeamId)
  );
}
