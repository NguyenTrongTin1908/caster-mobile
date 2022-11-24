import { createAction, createAsyncAction } from 'lib/redux';

export const setCurrentUser = createAction('SET_CURRENT_USER');

export const { updateProfile, updateProfileSuccess, updateProfileFail } =
  createAsyncAction('updateProfile', 'UPDATE_PROFILE');

export const resetUpdateProfile = createAction('RESET_UPDATE_PROFILE');
export const updateCurrentUserAvatar =createAction('updateCurrentUserAvatar');
export const updateCurrentUserCover =createAction('updateCurrentUserCover');

export const setUpdating = createAction('updatingUser');
export const {
  updateUser,
  updateUserSuccess,
  updateUserFail
} = createAsyncAction('updateUser', 'UPDATE_USER');

export const updatePerformer = createAction('updatePerformer');

export const {
  updatePassword,
  updatePasswordSuccess,
  updatePasswordFail
} = createAsyncAction('updatePassword', 'UPDATE_PASSWORD');

export const {
  updateBanking,
  updateBankingSuccess,
  updateBankingFail
} = createAsyncAction('updateBanking', 'UPDATE_BANKING');

export const setUpdatingBanking = createAction('updatingBanking');

export const updateBlockCountries = createAction('updateBlockCountries');

export const updateBalance = createAction('updateBalance');

