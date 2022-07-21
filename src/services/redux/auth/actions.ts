import { createAction, createAsyncAction } from 'lib/redux';

export const { login, loginSuccess, loginFail } = createAsyncAction(
  'login',
  'LOGIN'
);

export const setLogin = createAction('SET_LOGIN');

export const resetLogin = createAction('RESET_LOGIN');

export const logout = createAction('LOGOUT');

export const authAccessToken = createAction('AUTH_ACCESS_TOKEN');
