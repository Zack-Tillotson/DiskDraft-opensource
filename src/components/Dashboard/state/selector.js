import namespace from './namespace';

import firebaseSelector from '../../../firebase/selector';

export default function(state) {
  
  let namespaceState = state;
  namespace.split('/').forEach(step => namespaceState = namespaceState[step]);

  const firebase = firebaseSelector(state);

  return {
    firebase,
    ...namespaceState,
  };
}