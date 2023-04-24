import { all, spawn } from "redux-saga/effects";

//load saga here
import authSagas from "services/redux/auth/sagas";
import systemSagas from "services/redux/system/sagas";
import userSagas from "services/redux/user/sagas";
import chatRoom from "services/redux/chatRoom/sagas";
import feedSagas from "services/redux/feed/sagas";
import commentSagas from "services/redux/comment/sagas";
import notificationSagas from "services/redux/notification/sagas";
import streamMessageSagas from "services/redux/stream-chat/sagas";
import conversationSagas from "services/redux/message/sagas";
import messageSagas from "services/redux/message/sagas";
import performerSagas from "services/redux/performer/sagas";

function* rootSaga(): any {
  yield all(
    [
      ...authSagas,
      ...systemSagas,
      ...userSagas,
      ...chatRoom,
      ...feedSagas,
      ...commentSagas,
      ...notificationSagas,
      ...streamMessageSagas,
      ...conversationSagas,
      ...messageSagas,
      ...performerSagas
    ].map(spawn)
  );
}

export default rootSaga;
