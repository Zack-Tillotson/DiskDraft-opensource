import {combineReducers} from 'redux';
import firebase from '../../firebase/reducer';
import framework from '../../components/Framework/state/reducer';
import dashboard from '../../components/Dashboard/state/reducer';
import draftSetup from '../../components/DraftSetup/state/reducer';
import draft from '../../components/Draft/state/reducer';
import joinDraft from '../../components/JoinDraft/state/reducer';

export default combineReducers({
  firebase,
  framework,
  dashboard,
  draftSetup,
  draft,
  joinDraft,
});