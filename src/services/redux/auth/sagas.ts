import { APIRequest } from "services/api-request";
import {
  authAccessToken,
  login,
  loginFail,
  loginSocial,
  loginSuccess,
  logout,
  logoutSuccess,
  setLogin,
} from "./actions";
import { authService } from "services/auth.service";
import { createSagas } from "lib/redux";
import { flatten } from "lodash";
import { put } from "redux-saga/effects";
import { setCurrentUser } from "../user/actions";
import { IUserLogin } from "interfaces/auth";

import {
  GoogleSignin,
  statusCodes,
} from "@react-native-google-signin/google-signin";
const authSagas = [
  {
    on: login,
    *worker(data: any) {
      try {
        const payload = data.payload as IUserLogin;

        const resp = yield authService.userLogin(payload);
        const { data: respData } = resp;

        APIRequest.accessToken = respData.token;
        // load current user and othere here
        yield authService.setAccessToken(respData.token);

        // get my info and set isLoggedIn = true
        const { data: userData } = yield authService.me();

        yield put(setLogin(true));
        yield put(setCurrentUser(userData));
        yield put(loginSuccess());
      } catch (e) {
        const error = yield Promise.resolve(e);

        APIRequest.accessToken = "";
        yield put(setCurrentUser(null));
        yield put(loginFail(error));
      }
    },
  },
  {
    on: logout,
    *worker() {
      const isSignedInByGoogle = yield GoogleSignin.isSignedIn();
      if (isSignedInByGoogle) yield GoogleSignin.signOut();
      APIRequest.accessToken = "";
      yield authService.removeAccessToken();
      yield put(logoutSuccess());
    },
  },
  {
    on: authAccessToken,
    *worker() {
      try {
        const token = yield authService.getAccessToken();

        if (token) {
          APIRequest.accessToken = token;

          // get my info and set isLoggedIn = true
          const { data } = yield authService.me();

          yield put(setLogin(true));
          yield put(setCurrentUser(data));
        }
      } catch (e) {
        APIRequest.accessToken = "";
        yield put(setCurrentUser(null));
        yield put(setLogin(false));
      }
    },
  },
  {
    on: loginSocial,
    *worker(data: any) {
      try {
        const payload = data.payload as any;
        const { token } = payload;
        APIRequest.accessToken = token;
        // load current user and othere here
        yield authService.setAccessToken(token);

        // get my info and set isLoggedIn = true
        const { data: userData } = yield authService.me();

        yield put(setLogin(true));
        yield put(setCurrentUser(userData));
        yield put(loginSuccess());
      } catch (e) {
        APIRequest.accessToken = "";
        yield put(setCurrentUser(null));
        yield put(setLogin(false));
      }
    },
  },
];

export default flatten([createSagas(authSagas)]);
