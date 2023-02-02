import utils from './utils';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';

const verbose = __DEBUG__; // For debugging

function getRef(path = '') {
  return firebase.database().ref(path);
}

function requestAuth(service, onError) {
  switch(service) {
    case 'google':
      const googleProvider = new firebase.auth.GoogleAuthProvider();
      firebase.auth().signInWithRedirect(googleProvider).catch(onError);
      break;
    case 'twitter':
      const twitterProvider = new firebase.auth.TwitterAuthProvider();
      firebase.auth().signInWithRedirect(twitterProvider).catch(onError);
      break;
    case 'facebook':
      const facebookProvider = new firebase.auth.FacebookAuthProvider();
      firebase.auth().signInWithRedirect(facebookProvider).catch(onError);
      break;
    case 'anonymous':
      firebase.auth().signInAnonymously().catch(onError);
      break;
    default:
      console.log('Error - request auth failed with unknown service: ' + service);
  }
}

function requestUnauth(service, onError) {
  return firebase.auth().signOut();
}

// This function will begin monitoring the client connection to Firebase. This
// includes connection meta information such as if the client is connected and
// the connection lag times, the client authorization state (logged in or not),
// and the user data (/user/[user id]/...)
function syncConnection(onData) {

  // Database connection meta information!

  firebase.database().ref('.info/connected').on(
    'value',
    snapshot => {
      if(snapshot.exists()) {
        const isConnected = snapshot.val();
        onData({path: '.info/connected', error: false, data: isConnected});
        if(isConnected) {
          startAuthSync(onData);
        }
      } else {
        onData({path: '.info/connected', error: false, data: false});
      }
    }
  );

  firebase.database().ref('.info/serverTimeOffset').on(
    'value',
    snapshot => {
      if(snapshot.exists()) {
        onData({path: '.info/serverTimeOffset', error: false, data: snapshot.val()});
      }
    }
  );

  firebase.database().ref('connected').on(
    'value',
    snapshot => {
      if(snapshot.exists()) {
        onData({path: 'connected', error: false, data: snapshot.val()});
      }
    }
  );
}

function startAuthSync(onData) {
  firebase.auth().onAuthStateChanged(auth => {
    const {
      uid,
      displayName: name,
      email,
      photoURL: image,
    } = (auth || {});

    const data = {
      uid,
      name,
      email,
      image,
    }

    if(uid) {
      updateData(`users/${uid}/public/self`, data);
    }

    onData({path: '.info/auth', error: false, data});
  });
}

let pathRefs = {}

function syncData(path = '/', dataName, onData) {

  // If the dataName is already synced then if the path is the same
  // return it or end the current sync and start a new one if the
  // path has changed.
  if(pathRefs[dataName]) {
    if(path === pathRefs[dataName]) {
      return pathRefs[dataName];
    } else {
      endSyncData(dataName);
    }
  }

  const ref = utils.connect(path);
  ref.on(
    'value',
    snapshot => {
      if(snapshot.exists()) {
        onData({path, error: false, data: snapshot.val()});
      } else {
        onData({path, error: false, data: undefined});
      }
    },
    error => {
      if(__DEBUG__) {
        console.log("Firebase error", path, error,);
      }
      onData({path, error: true, data: null, errorData: error});
    }
  );

  pathRefs[dataName] = path;

  if(__DEBUG__) {
    if(verbose) {
      console.log(`Firebase API syncData: ${dataName}: ${path}`, pathRefs);
    }
  }

  return ref;
}

function endSyncData(dataName = '') {

  const path = pathRefs[dataName];
  if(path) {

    const ref = utils.connect(path);
    ref.off('value');
    delete pathRefs[dataName];

    if(__DEBUG__) {
      if(verbose) {
        console.log(`Firebase API endSyncData: ${dataName}`, pathRefs);
      }
    }
  }
}

function pushData(path = '/', value, onComplete) {
  const ref = utils.connect(path);
  return ref.push(
    value,
    error => {
      if(!error) {
        onComplete({path, error: false, data: value});
      } else {
        console.log("Firebase error", error);
        onComplete({path, error: true, errorData: error});
      }
    }
  );
}

function updateData(path = '/', update, onComplete) {
  const ref = utils.connect(path);
  if(typeof update === 'function') {
    return ref.transaction(update, onComplete);
  } else {
    return ref.update(update, onComplete);
  }
}

function setData(path = '/', value, onComplete) {
  const ref = utils.connect(path);
  return ref.set(value, onComplete);
}

function deleteData(path = '/', onError) {
  const ref = utils.connect(path);
  return ref.remove().catch(onError);
}

export default {
  getRef,
  requestAuth,
  requestUnauth,
  syncConnection,
  syncData,
  endSyncData,
  pushData,
  setData,
  updateData,
  deleteData,
}