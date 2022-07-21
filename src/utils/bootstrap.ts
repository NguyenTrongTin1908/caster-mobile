import { APIRequest } from 'services/api-request';
import { Image } from 'react-native';
import { authService } from 'services/auth.service';
import { setConfig } from 'services/redux/system/actions';
import { setCurrentUser } from 'services/redux/user/actions';
import { setLogin } from 'services/redux/auth/actions';
import { systemService } from 'services/system.service';
import Icons from 'utils/Icons';
import storeHolder from 'lib/storeHolder';


const loadAppSettings = async (): Promise<void> => {
  try {
    const store = storeHolder.getStore();
    const settings = await systemService.getConfig();

    store?.dispatch(setConfig(settings));
  } catch (e) {
    // TODO - show alert, redirect to error page?
    // eslint-disable-next-line no-console
    console.log(e);
  }
};

const loadAuthData = async (): Promise<void> => {
  try {
    const store = storeHolder.getStore();

    const token = await authService.getAccessToken();
    if (token) {
      APIRequest.accessToken = token;

      // get my info and set isLoggedIn = true
      const { data } = await authService.me();

      store?.dispatch(setLogin(true));
      store?.dispatch(setCurrentUser(data));
    }
  } catch (e) {
    APIRequest.accessToken = '';
    await authService.removeAccessToken();
  }
};

export const initApp = async (): Promise<void> => {
  await loadAppSettings();
  await loadAuthData();
  // await loadAssetsAsync();
  // await _loadFontsAsync();
};
