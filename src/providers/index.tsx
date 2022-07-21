import { extendTheme, NativeBaseProvider } from 'native-base';
import { Provider } from 'react-redux';

import React from 'react';
import configureStore from '../store';
import { colors } from 'utils/theme';
import ColorSwatch from 'utils/ColorSwatch';

interface Props {
  children?: React.ReactElement;
}

const store = configureStore();

// Add providers here
const RootProvider = ({ children }: Props): React.ReactElement => {
  const nativeBaseTheme = extendTheme({
    // to generate color, use this tool https://smart-swatch.netlify.app/
    colors: {
      primary: ColorSwatch(colors.primary),
      secondary: ColorSwatch(colors.secondary),
      tertiary: ColorSwatch(colors.tertiary)
    }
  });

  return (
    <Provider store={store}>
      <NativeBaseProvider theme={nativeBaseTheme}>
        {children}
      </NativeBaseProvider>
    </Provider>
  );
};

export default RootProvider;
