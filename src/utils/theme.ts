import { Dimensions, Platform } from 'react-native';
// import StaticSafeAreaInsets from 'react-native-static-safe-area-insets';

export enum ThemeType {
  LIGHT = 'LIGHT',
  DARK = 'DARK'
}

const COLOR_PRIMARY = '#A742AA';
const COLOR_SECONDARY = '#FF6534';
const COLOR_TERTIARY = '#000';
const COLOR_DANGER = '#f43f5e';
const APP_BG = '#000';

export const colors = {
  //singletons
  dark: '#000',
  light: '#fff',
  secondaryText: 'rgba(0, 0, 0, 0.5)',
  primary: COLOR_PRIMARY,
  secondary: COLOR_SECONDARY,
  tertiary: COLOR_TERTIARY,
  active: COLOR_PRIMARY,
  danger: COLOR_DANGER,
  hashtag: 'rgb(82,198,246)',
  lightGray:'#F1F1F2',
  darkGray: '#B1A492',
  blueCaster: "#FF69B4",

  //text
  lightText: '#fff',
  darkText: '#000',
  lightTitle: 'rgba(60, 60, 67, 0.6)',
  divider: 'rgba(0, 0, 0, 0.12)',
  gray: '#CCCCCC',
  ruby: 'rgb(251,0,0)',

  //input
  inpBorderColor: '#C9C9C9',
  inpLabelColor: '#969696',
  transparent: 'rgba(0,0,0,0)',


  //btn
  btnPrimaryColor: COLOR_PRIMARY,
  btnSecondaryColor: COLOR_SECONDARY,
  btnTertiaryColor: COLOR_TERTIARY,

  // default background color of the app
  appBgColor: APP_BG,
  boxBgColor: '#F5F5F5',

  // image
  imageBackground: '#dddddd'
};

export type Colors = typeof colors;

export const btnElement = {
  md: {
    //btn
    px: 7,
    py: 3,
    borderRadius: 24,
    //text
    fontSize: 17,
    color: colors.lightText,
    fontWeight: 700,
    letter: -0.41,
    textAlign: 'center'
  },
  sm: {
    //btn
    px: 5,
    py: 1,
    borderRadius: 24,
    //text
    fontSize: 13,
    color: colors.lightText,
    fontWeight: 500,
    letter: -0.08,
    textAlign: 'center'
  }
};

export const onlineDot = {
  color: '#2AEF19',
  width: '10px',
  height: '10px',
  borderRadius: 5,
  borderWidth: 2,
  borderColor: APP_BG
};

export const padding = {
  p1: 1,
  p2: 2,
  p3: 3,
  p4: 4,
  p5: 5
};

export const Fonts = {
  blackColor14Bold: {
    color: '#000000',
    fontSize: 14,
    fontFamily: 'Proxima_Nova_Font',
    fontWeight: 'bold'
  },

  blackColor16Bold: {
    color: '#000000',
    fontSize: 16,
    fontFamily: 'Proxima_Nova_Font',
    fontWeight: 'bold'
  },

  whiteColor13Regular: {
    color: '#ffffff',
    fontSize: 13,
    fontFamily: 'Proxima_Nova_Font'
  },

  whiteColor14Regular: {
    color: '#ffffff',
    fontSize: 14,
    fontFamily: 'Proxima_Nova_Font'
  },

  whiteColor15Regular: {
    color: '#ffffff',
    fontSize: 15,
    fontFamily: 'Proxima_Nova_Font'
  },

  whiteColor16Regular: {
    color: '#ffffff',
    fontSize: 16,
    fontFamily: 'Proxima_Nova_Font'
  },

  whiteColor17SemiBold: {
    color: '#ffffff',
    fontSize: 17,
    fontFamily: 'Proxima_Nova_Font',
    fontWeight: '600'
  },

  whiteColor19SemiBold: {
    color: '#ffffff',
    fontSize: 19,
    fontFamily: 'Proxima_Nova_Font',
    fontWeight: '600'
  },

  whiteColor21SemiBold: {
    color: '#ffffff',
    fontSize: 21,
    fontFamily: 'Proxima_Nova_Font',
    fontWeight: '600'
  },

  whiteColor14Bold: {
    color: '#ffffff',
    fontSize: 14,
    fontFamily: 'Proxima_Nova_Font',
    fontWeight: 'bold'
  },

  whiteColor16Bold: {
    color: '#ffffff',
    fontSize: 16,
    fontFamily: 'Proxima_Nova_Font',
    fontWeight: 'bold'
  },

  whiteColor18Bold: {
    color: '#ffffff',
    fontSize: 18,
    fontFamily: 'Proxima_Nova_Font',
    fontWeight: 'bold'
  },

  whiteColor20Bold: {
    color: '#ffffff',
    fontSize: 20,
    fontFamily: 'Proxima_Nova_Font',
    fontWeight: 'bold'
  },

  whiteColor30Bold: {
    color: '#ffffff',
    fontSize: 30,
    fontFamily: 'Proxima_Nova_Font',
    fontWeight: 'bold'
  },

  whiteColor35Bold: {
    color: '#ffffff',
    fontSize: 35,
    fontFamily: 'Proxima_Nova_Font',
    fontWeight: 'bold'
  },

  grayColor12Regular: {
    color: '#CCCCCC',
    fontSize: 12,
    fontFamily: 'Proxima_Nova_Font'
  },

  lightGrayColor13Regular: {
    color: '#757575',
    fontSize: 13,
    fontFamily: 'Proxima_Nova_Font'
  },

  grayColor14Regular: {
    color: '#CCCCCC',
    fontSize: 14,
    fontFamily: 'Proxima_Nova_Font'
  },

  grayColor15Regular: {
    color: '#CCCCCC',
    fontSize: 15,
    fontFamily: 'Proxima_Nova_Font'
  },

  grayColor16Regular: {
    color: '#CCCCCC',
    fontSize: 16,
    fontFamily: 'Proxima_Nova_Font'
  },

  grayColor16Bold: {
    color: '#CCCCCC',
    fontSize: 16,
    fontFamily: 'Proxima_Nova_Font',
    fontWeight: 'bold'
  },

  primaryColor16Regular: {
    color: '#F44336',
    fontSize: 16,
    fontFamily: 'Proxima_Nova_Font'
  }
};

export const Sizes = {
  fixPadding: 10.0
};

export const CONTENT_SPACING = 15;

const SAFE_BOTTOM =
  Platform.select({
    ios: 10
  }) ?? 0;

export const SAFE_AREA_PADDING = {
  paddingLeft: CONTENT_SPACING,
  paddingTop: CONTENT_SPACING,
  paddingRight: CONTENT_SPACING,
  paddingBottom: SAFE_BOTTOM + CONTENT_SPACING
};

// The maximum zoom _factor_ you should be able to zoom in
export const MAX_ZOOM_FACTOR = 20;

export const SCREEN_WIDTH = Dimensions.get('window').width;
export const SCREEN_HEIGHT = Platform.select<number>({
  android: Dimensions.get('screen').height - 10,
  ios: Dimensions.get('window').height
}) as number;

// Capture Button
export const CAPTURE_BUTTON_SIZE = 78;
