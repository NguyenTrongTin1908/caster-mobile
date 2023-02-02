import { createAction, createAsyncAction } from 'lib/redux';

export const { login, loginSuccess, loginFail } = createAsyncAction('login', 'LOGIN');

export const setLogin = createAction('SET_LOGIN');

export const resetLogin = createAction('RESET_LOGIN');

export const logout = createAction('LOGOUT');

export const authAccessToken = createAction('AUTH_ACCESS_TOKEN');

export const { loginSocial } = createAsyncAction('loginSocial', 'LOGIN_SOCIAL');

export const logoutSuccess = createAction('LOGOUT_SUCCESS');
export const setFCMToken = createAction(' SET_FCM_TOKEN');

