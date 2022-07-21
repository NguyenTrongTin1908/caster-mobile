import { createAction, createAsyncAction } from 'lib/redux';

export const setCurrentUser = createAction('SET_CURRENT_USER');

export const { updateProfile, updateProfileSuccess, updateProfileFail } =
  createAsyncAction('updateProfile', 'UPDATE_PROFILE');

export const resetUpdateProfile = createAction('RESET_UPDATE_PROFILE');
