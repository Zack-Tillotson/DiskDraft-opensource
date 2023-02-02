import actions from './actions';

export default function(dispatch, ownProps) {

  return {

    changeInput(input) {
      dispatch(actions.changeInput(input));
    },

    submitJoin() {
      dispatch(actions.submitJoin());
    },

  }
}