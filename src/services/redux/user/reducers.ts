import { merge } from "lodash";
import { createReducers } from "lib/redux";
import {
  setCurrentUser,
  updateProfile,
  updateProfileFail,
  updateProfileSuccess,
  updateCurrentUserAvatar,
  updateCurrentUserCover,
  resetUpdateProfile,
  updateBalance,
} from "./actions";
import { defaultStore } from "utils/store";

const initialState = {
  current: null,
  updateProfile: defaultStore,
};

const userReducers = [
  {
    on: setCurrentUser,
    reducer: (state: any, data: any) => ({
      ...state,
      current: data.payload,
    }),
  },
  {
    on: updateProfile,
    reducer: (state: any) => ({
      ...state,
      updateProfile: {
        ...state.updateProfile,
        requesting: true,
      },
    }),
  },
  {
    on: updateProfileSuccess,
    reducer: (state: any, data: any) => ({
      ...state,
      current: data.payload,
      updateProfile: {
        requesting: false,
        error: null,
        success: true,
      },
    }),
  },
  {
    on: updateProfileFail,
    reducer: (state: any, data: any) => ({
      ...state,
      updateProfile: {
        requesting: false,
        error: data.payload,
        success: false,
      },
    }),
  },
  {
    on: updateCurrentUserAvatar,
    reducer: (state: any, data: any) => ({
      ...state,
      current: {
        ...state.current,
        avatar: data.payload,
      },
    }),
  },
  {
    on: updateCurrentUserCover,
    reducer: (state: any, data: any) => ({
      ...state,
      current: {
        ...state.current,
        cover: data.payload,
      },
    }),
  },
  {
    on: resetUpdateProfile,
    reducer: (state: any) => ({
      ...state,
      updateProfile: { ...defaultStore },
    }),
  },
  {
    on: updateBalance,
    reducer(state: any, data: any) {
      const { token, type } = data.payload;
      const newState =
        type == "ruby-balance"
          ? {
              ...state.current,
              rubyBalance: (state.current.rubyBalance += token),
            }
          : { ...state.current, balance: (state.current.balance += token) };
      return {
        ...state,
        current: { ...newState },
      };
    },
  },
];

export default merge({}, createReducers("user", [userReducers], initialState));
