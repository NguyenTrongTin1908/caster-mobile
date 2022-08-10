import { StyleSheet } from 'react-native';
import { colors, Fonts, Sizes } from 'utils/theme';
import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: { flex: 1 },
  uiContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0.0,
    right: 0.0,
    height: height - 79,
    justifyContent: 'flex-end'
  },
  bottomContainer: {
    paddingHorizontal: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingBottom: Sizes.fixPadding * 3.0
  },
  songRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  rightContainer: {
    alignSelf: 'flex-end',
    height: 320,
    justifyContent: 'space-between',
    marginRight: 5
  },
  profilePicture: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#fff'
  },
  iconContainer: {
    alignItems: 'center'
  },
  profilePictureAddButtonWrapStyle: {
    position: 'absolute',
    bottom: -10.0,
    width: 20.0,
    height: 20.0,
    borderRadius: 10.0,
    backgroundColor: colors.darkText,
    alignItems: 'center',
    justifyContent: 'center'
  },
  postSongImageWrapStyle: {
    marginRight: Sizes.fixPadding - 5.0,
    backgroundColor: '#222222',
    width: 45.0,
    height: 45.0,
    borderRadius: 22.5,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-end',
    marginBottom: Sizes.fixPadding - 30.0
  },
  relatedAndForYouInfoWrapStyle: {
    position: 'absolute',
    top: 20.0,
    left: 0.0,
    right: 0.0,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  followButtonWrapStyle: {
    marginBottom: Sizes.fixPadding + 5.0,
    backgroundColor: colors.darkText,
    borderRadius: Sizes.fixPadding - 5.0,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Sizes.fixPadding + 5.0,
    paddingHorizontal: Sizes.fixPadding * 8.0
  },
  relatedInfoWrapStyle: {
    width: width - 100,
    height: 390,
    borderRadius: Sizes.fixPadding,
    alignItems: 'center',
    overflow: 'hidden'
  },
  tabView: {
    position: 'absolute',
    top: 20.0,
    left: 0.0,
    right: 0.0,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
});

export default styles;
