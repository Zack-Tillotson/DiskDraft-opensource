import namespace from './namespace';

export default function(state) {
  
  let namespaceState = state;
  namespace.split('/').forEach(step => namespaceState = namespaceState[step]);

  return namespaceState;
}