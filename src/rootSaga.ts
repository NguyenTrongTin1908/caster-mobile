import { all, spawn } from 'redux-saga/effects';

//load saga here
import authSagas from 'services/redux/auth/sagas';
import systemSagas from 'services/redux/system/sagas';
import userSagas from 'services/redux/user/sagas';
import chatRoom from 'services/redux/chatRoom/sagas';
import performerSagas from 'services/redux/feed/sagas';
import commentSagas from 'services/redux/comment/sagas'

function* rootSaga(): any {
  yield all([...authSagas, ...systemSagas, ...userSagas,...chatRoom,...performerSagas,...commentSagas].map(spawn));
}

export default rootSaga;
