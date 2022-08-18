import { IReduxAction } from 'src/interfaces';
import { createReducers } from 'lib/redux';
import { defaultStore } from 'utils/store';
import { login, loginFail, loginSuccess, logout, logoutSuccess, resetLogin, setLogin } from './actions';
import { merge } from 'lodash';

const initialState = {
  loggedIn: false,
  authLogin: defaultStore,
  authRegister: defaultStore
};

const authReducers = [
  {
    on: login,
    reducer(state: any) {
      return {
        ...state,
        authLogin: {
          ...state.authLogin,
          requesting: true
        }
      };
    }
  },
  {
    on: loginSuccess,
    reducer(state: any) {
      return {
        ...state,
        loggedIn: true,
        authLogin: {
          requesting: false,
          error: null,
          success: true
        }
      };
    }
  },
  {
    on: loginFail,
    reducer(state: any, data: any) {
      return {
        ...state,
        loggedIn: false,
        authLogin: {
          requesting: false,
          error: data.payload,
          success: false
        }
      };
    }
  },
  {
    on: logoutSuccess,
    reducer() {
      return {
        ...initialState
      };
    }
  },
  {
    on: setLogin,
    reducer: (state: any, data: IReduxAction) => ({
      ...state,
      loggedIn: data.payload
    })
  },
  {
    on: resetLogin,
    reducer: (state: any, data: IReduxAction) => ({
      ...state,
      loggedIn: false,
      authLogin: { ...defaultStore }
    })
  }
];

export default merge({}, createReducers('auth', [authReducers], initialState));
