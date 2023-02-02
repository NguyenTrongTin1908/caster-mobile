import SplashScreen from 'react-native-splash-screen';
import { initApp } from './utils/bootstrap';
import React, { useEffect, useState } from 'react';
import RootNavigator from 'navigations/RootStackNavigator';
import RootProvider from 'providers/index';
import { Socket } from './socket';
import Welcome from 'components/welcome/welcome';
import { StatusBar } from 'native-base';
import MainDrawer from './navigations/MainDrawer';
import PushController  from "./PushController";


function App(): React.ReactElement {
  const [appIsReady, setAppIsReady] = useState(false);

  const prepare = async (): Promise<void> => {
    try {
      // show welcome screen
      // not sure why ios doesn't work, we need to recheck and fix it later
      // if (isAndroid()) await SplashScreen.show();
      // bootstrap
      await initApp();
      await new Promise(resolve => setTimeout(resolve, 2000));

    } catch (e) {
      // TODO - show alert and other info here
      console.log('err', e);
    } finally {
      await SplashScreen.hide();
      setAppIsReady(true);
    }
  };

  useEffect(() => {

    prepare();
  }, []);

  return (
    <>
      <StatusBar hidden={false} />
      {!appIsReady ? <Welcome /> : <RootNavigator />}
    </>
  );
}

function ProviderWrapper(): React.ReactElement {
  return (
    <RootProvider>
      <Socket>
        <>
        <PushController />
          <MainDrawer />
          <App />
        </>
      </Socket>
    </RootProvider>
  );
}

export default ProviderWrapper;
