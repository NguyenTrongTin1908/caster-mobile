import {
  updateProfile,
  updateProfileFail,
  updateProfileSuccess
} from './actions';
import { authService } from 'services/auth.service';
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
  }
];

export default flatten([createSagas(userSagas)]);
