import { merge } from 'lodash';
import { createReducers } from 'lib/redux';
import {
  setCurrentUser,
  updateProfile,
  updateProfileFail,
  updateProfileSuccess,
  resetUpdateProfile
} from './actions';
import { IReduxAction } from 'src/interfaces';
import { defaultStore } from 'utils/store';

const initialState = {
  current: null,
  updateProfile: defaultStore
};

const userReducers = [
  {
    on: setCurrentUser,
    reducer: (state: any, data: IReduxAction) => ({
      ...state,
      current: data.payload
    })
  },
  {
    on: updateProfile,
    reducer: (state: any) => ({
      ...state,
      updateProfile: {
        ...state.updateProfile,
        requesting: true
      }
    })
  },
  {
    on: updateProfileSuccess,
    reducer: (state: any, data: IReduxAction) => ({
      ...state,
      current: data.payload,
      updateProfile: {
        requesting: false,
        error: null,
        success: true
      }
    })
  },
  {
    on: updateProfileFail,
    reducer: (state: any, data: IReduxAction) => ({
      ...state,
      updateProfile: {
        requesting: false,
        error: data.payload,
        success: false
      }
    })
  },
  {
    on: resetUpdateProfile,
    reducer: (state: any) => ({
      ...state,
      updateProfile: { ...defaultStore }
    })
  }
];

export default merge({}, createReducers('user', [userReducers], initialState));
