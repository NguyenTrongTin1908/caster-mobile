import { createAction, createAsyncAction } from "lib/redux";


export const { sendMessageStream } = createAsyncAction('sendMessageStream', 'SEND_MESSAGE_STREAM');
export const { sendMessagePrivateStream } = createAsyncAction('sendMessagePrivateStream', 'SEND_MESSAGE_PRIVATE_STREAM');

export const getMessagePrivateChat = createAction('GET_MESSAGE_PRIVATE_CHAT');