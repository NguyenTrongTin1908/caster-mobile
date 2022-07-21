import { createAction, createAsyncAction } from 'lib/redux';

export const { loadConfig, loadConfigSuccess, loadConfigFail } =
  createAsyncAction('loadConfig', 'LOAD_CONFIG');

export const setConfig = createAction('SET_CONFIG');
