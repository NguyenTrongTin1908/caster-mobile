

import { Platform, StyleSheet } from 'react-native';
import { colors, Fonts, Sizes } from 'utils/theme';
import { Dimensions, StatusBar } from 'react-native';
import { getStatusBarHeight } from 'react-native-status-bar-height';

const { width, height } = Dimensions.get('window');
let deviceH = Dimensions.get('screen').height;
const STATUS_BAR_HEIGHT = StatusBar.currentHeight || 24;
let bottomNavBarH = deviceH - height + STATUS_BAR_HEIGHT;
const styles = StyleSheet.create({
  container: { flex: 1 },

  filterBlock: {

    },

    followButtonStyle: {
      borderColor: colors.secondary,
      borderWidth: 2.0,
      borderRadius: Sizes.fixPadding - 5.0,
      width: 44,
      height:44,
      fontSize:12,



      // alignItems: 'center',
      // justifyContent: 'center',
      // paddingVertical: Sizes.fixPadding - 20.0,
      // paddingHorizontal: Sizes.fixPadding * 2.0,
      // width: 60.0,
      // margin:2.0,
      // height:40.0,

    },


});

export default styles;
