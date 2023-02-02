import firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/auth';

// TODO Config this
const config = {
  apiKey: "",
  authDomain: "fir-v2.firebaseapp.com",
  databaseURL: "https://fir-v2.firebaseio.com",
  storageBucket: "fir-v2.appspot.com",
  messagingSenderId: ""
};
const app = firebase.initializeApp(config);

function connect(path) {
  return firebase.database(app).ref(path);
}

export default {connect};