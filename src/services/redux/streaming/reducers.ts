import { merge } from 'lodash';
import { createReducers } from 'lib/redux';
import { IReduxAction } from 'src/interfaces';
import { addPrivateRequest, accessPrivateRequest, updateLiveStreamSettings, cancelPrivateRequest } from './actions';

const initialState = {
  privateRequests: [],
  settings: {
    viewerURL: '',
    publisherURL: '',
    optionForBroadcast: 'hls',
    optionForGroup: 'hls',
    optionForPrivate: 'hls',
    secureOption: false,
    agoraEnable: false
  }
};

const reducers = [
  {
    on: addPrivateRequest,
    reducer(state: any, action: IReduxAction<any>) {
      const { user } = action.payload;
      const { privateRequests } = state;
      const privateIndex = privateRequests.findIndex((item) => item.user._id === user._id);
      return {
        ...state,
        privateRequests: privateIndex > -1 ? state.privateRequests : [...state.privateRequests, action.payload]
      };
    }
  },
  {
    on: accessPrivateRequest,
    reducer(state: any, action: IReduxAction<string>) {
      return {
        ...state,
        privateRequests: state.privateRequests.filter(p => p.conversationId !== action.payload)
      };
    }
  },

  {
    on: cancelPrivateRequest,
    reducer(state: any, action: IReduxAction<string>) {
      return {
        ...state,
        privateRequests: [...state.privateRequests.filter(p => p.conversationId !== action.payload)]
      };
    }
  },
  {
    on: updateLiveStreamSettings,
    reducer(state: any, action: IReduxAction<any>) {
      return {
        ...state,
        settings: {
          ...state.settings,
          ...action.payload
        }
      };
    }
  }
];
export default merge({}, createReducers('streaming', [reducers], initialState));
