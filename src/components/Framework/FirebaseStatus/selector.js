import firebaseSelector from '../../../firebase/selector';

export default state => {
  return firebaseSelector(state);
}