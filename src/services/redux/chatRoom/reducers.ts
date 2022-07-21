import { createReducers } from 'lib/redux';
import { getMessagePrivateChat } from "./actions";
import { merge } from 'lodash';
import { IReduxAction } from 'src/interfaces';

const initialState = {
  messagePrivate: {},
  setMessagePrivateChat: true,
  isSet: false
};

const chatReducer = [
  {
    on: getMessagePrivateChat,
    reducer(state: any, data: IReduxAction) {
      return {
        ...state,
        messagePrivate: data.payload.data,
        isSet: data.payload.isSet
      };
    }
  }
];
export default merge({}, createReducers('chatReducer', [chatReducer], initialState));
