// This reducer captures timing information for the current selection. All times are
// in server time.

const defaultState = {
  showClock: true, // True when this selection is to be shown, false when it should be hidden
  active: false, // When true the 'clock is running', false means it hasn't started or is paused
  startTime: 0, // The time when the clock started. This can change if a pause happens.
  countsDown: false, // Does the clock count up or count down to 0
  countDownDuration: 0, // If counting down, what is the initial value
}

export default function(pipeline, action) {

  const {controls, settings} = pipeline;

  const showClock = settings.showDraftTimer || false;
  const countsDown = (settings.limitDraftTime || 0) > 0;
  const countDownDuration = settings.limitDraftTime || 0;

  return {...defaultState, ...controls, showClock, countsDown, countDownDuration};
}
