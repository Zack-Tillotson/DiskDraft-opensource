const MIN_PAUSE_TIME = 4000;

export default function mayCurrentlyDraft(pipeline, action) {

  const {
    settings: {
      allowCaptainSelect,
    },
    permissions: {
      isAdmin,
    },
    contextTeam,
    currentDraftOrder,
    activePlayer,
    selectionTime: {
      active,
      startTime,
    },
  } = pipeline;

  const hasDraftPermissions = allowCaptainSelect && active || isAdmin;

  const isPlayerDraftable = !!activePlayer && [
    'Draftable',
    'TeamBaggaged',
  ].indexOf(activePlayer.status) >= 0;

  const isTeamAllowed = (contextTeam && currentDraftOrder && contextTeam.id === currentDraftOrder.team.id);

  return hasDraftPermissions && isPlayerDraftable && isTeamAllowed;

}
