import { flatten } from 'lodash';
import { put } from 'redux-saga/effects';
import { createSagas } from 'lib/redux';
import { loadConfig, loadConfigSuccess, loadConfigFail } from './actions';
import { systemService } from 'services/system.service';

const systemSagas = [
  {
    on: loadConfig,
    *worker() {
      try {
        const resp = yield systemService.getConfig();

        yield put(loadConfigSuccess(resp.data));
      } catch (e) {
        const error = yield Promise.resolve(e);

        yield put(loadConfigFail(error));
      }
    }
  }
];

export default flatten([createSagas(systemSagas)]);
