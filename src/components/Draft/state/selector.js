import namespace from './namespace';
import firebaseSelector from '../../../firebase/selector';

function getDraftId() {
  return window.location.pathname.split('/').slice(-2).shift();
}

export default function(state) {
  
  let namespaceState = state;
  namespace.split('/').forEach(step => namespaceState = namespaceState[step]);

  const firebase = firebaseSelector(state);
  const draftId = getDraftId();

  return {
    firebase,
    draftId,
    ...namespaceState,
  };
}