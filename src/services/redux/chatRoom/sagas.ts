import { put, select } from 'redux-saga/effects';
import { createSagas } from 'lib/redux';
import { flatten } from 'lodash';
import { getMessagePrivateChat, sendMessagePrivateStream, sendMessageStream } from './actions';
import { ISendMessageSream } from 'interfaces/chatRoom';
import { messageService } from 'services/message.service';

const chatMessage = [
  {
    on: sendMessageStream, *worker(data: any) {
      try {
        const payload = data.payload as ISendMessageSream;
        yield messageService.sendPublicStreamMessage(payload.id, { text: payload.message });
      } catch (e) {
        const error = yield Promise.resolve(e);
        console.log(error);
      }
    }
  },
  {
    on: sendMessagePrivateStream, *worker(data: any) {
      try {
        const payload = data.payload as ISendMessageSream;
        const res = yield messageService.sendMessage(payload.id, { text: payload.message });
        const current = yield select((state) => state.user.current);
        const dataMap = {
          ...res.data,
          senderInfo: current
        };
        yield put(getMessagePrivateChat({ data: dataMap, isSet: true }));
      } catch (e) {
        const error = yield Promise.resolve(e);
        console.log(error);
      }
    }
  },
];

export default flatten([createSagas(chatMessage)])