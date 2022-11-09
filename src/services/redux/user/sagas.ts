import {
  updateProfile,
  updateProfileFail,
  updateProfileSuccess,
  updatePerformer,
  updateCurrentUserAvatar,
  updateCurrentUserCover,
  updateUser,
  updateUserSuccess,
  updateUserFail,
  setUpdating
} from './actions';
import { authService } from 'services/auth.service';
import { performerService } from 'services/perfomer.service';

import { createSagas } from 'lib/redux';
import { flatten } from 'lodash';
import { put } from 'redux-saga/effects';
import { IUserUpdate } from 'interfaces/user';

const userSagas = [
  {
    on: updateProfile,
    *worker(data: any) {
      try {
        const payload = data.payload as IUserUpdate;
        const resp = yield authService.updateProfile(payload);
        const { data: respData } = resp;

        yield put(updateProfileSuccess(respData));
      } catch (e) {
        const error = yield Promise.resolve(e);
        yield put(updateProfileFail(error));
      }
    }
  },

  {
    on: updatePerformer,
    * worker(data: any) {
      try {
        yield put(setUpdating(true));
        const updated = yield performerService.updateMe(data.payload._id, data.payload);
        yield put(updateProfileSuccess(updated.data));
      } catch (e) {
        // TODO - alert error
        const error = yield Promise.resolve(e);
        console.log(error?.message || 'Error occured, please try again later');
        yield put(updateProfileFail(error));
      } finally {
        yield put(setUpdating(false));
      }
    }
  },



];

export default flatten([createSagas(userSagas)]);
