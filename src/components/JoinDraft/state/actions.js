import actionTypes from './actionTypes';
import selector from './selector';

import ga from 'ga';

import Firebase from 'firebase/app';
import 'firebase/database';
import firebaseApi from '../../../firebase/api';
import firebaseActions from '../../../firebase/actions';
import firebaseSelector from '../../../firebase/selector';

import {onDataReceived, onUpdateComplete, onError, withFirebase} from '../../Shared/state/util';

// UI Actions

function changeInput(input) {
  return {type: actionTypes.inputChanged, payload: {input}};
}

const submitJoin = withFirebase(function(dispatch, getState, firebase) {

  const {authInfo = {}} = firebase;
  const {uid} = authInfo;

  const {form: {input}} = selector(getState());

  ga('send', {
    hitType: 'event',
    eventAction: 'JoinDraft',
    eventCategory: 'Form/SubmitForm',
  });

  dispatch({type: actionTypes.formSubmitted, payload: {inProgress: true}});

  firebaseApi.endSyncData('joinDraft');
  firebaseApi.syncData(`joinDraft/${input.trim().toLowerCase()}`, 'joinDraft', result => {
    if(!result.error && !!result.data) {

      ga('send', {
        hitType: 'event',
        eventAction: 'JoinDraft',
        eventCategory: 'Form/JoinSuccess',
      });

      const draftId = result.data;

      dispatch(firebaseActions.unsyncPath(`joinDraft/${input}`));
      window.location.replace(`/draft/${draftId}/`);

    } else {

      ga('send', {
        hitType: 'event',
        eventAction: 'JoinDraft',
        eventCategory: 'Form/JoinFailure',
      });

      dispatch({type: actionTypes.formSubmitted, payload: {inProgress: false}});

    }
    return result;
  });
});

export default {

  changeInput,

  submitJoin,

}