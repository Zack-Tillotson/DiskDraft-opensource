import actionTypes from '../actionTypes';
import firebaseActionTypes from '../../../../firebase/actionTypes';

import {defaultColumnValues} from '../../columnTypes';
import {defaultSettings} from '../../settingTypes';

function settings(state = defaultSettings, action) {
  
  if(action.type === firebaseActionTypes.dataReceived && action.dataType === 'draftMeta') {

    const {data = {}} = action;
    const {draftData = {}} = data;
    const {settings = []} = draftData;

    return defaultSettings.map(defSetting => {
      const fbSetting = settings.find(fbSetting => fbSetting.id === defSetting.id) || {};
      const value = fbSetting.value || defSetting.value;
      return {...defSetting, ...fbSetting, value}
    });

  } else if(action.type === actionTypes.changeSetting) {

    return state.map(setting => {

      const {name, value = ''} = action;

      if(setting.id === name) {
        return {...setting, value};
      } else {
        return setting;
      }
    });

  }

  return state; 

}

export default settings;