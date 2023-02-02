// Handles the link for letting captains join the draft without the direct link

export default function joinDraft(pipeline, action) {

  const {
    joinDraft = {}
  } = pipeline;

  return {
    token: joinDraft.token || '',
    enabled: !!joinDraft.token,
  }
}