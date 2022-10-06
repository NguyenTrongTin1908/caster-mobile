import { StyleSheet } from 'react-native';
import { colors, Fonts, Sizes } from 'utils/theme';
import { Dimensions} from "react-native";
import { background } from 'native-base/lib/typescript/theme/styled-system';
import { getStatusBarHeight } from 'react-native-status-bar-height';

const { width, height } = Dimensions.get('window');



const styles = StyleSheet.create({

  container: {
    flex: 1,
  },
  listModel: {
    marginTop: 15,
  },


  notificationRow: {

    flex : 1,
    flexDirection :"row",
    justifyContent : "space-between",
    maxHeight : 50,
    marginVertical : 20 + getStatusBarHeight(true),
    marginHorizontal: Sizes.fixPadding - 5.0


  },

  iconSettings: {
    top: 15 + getStatusBarHeight(true),
    right: 0,
    height: 56,
    position: 'absolute',
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'transparent'
  },




  btn: { width: 58, height: 18, backgroundColor: '#78B7BB',  borderRadius: 2 },
  btnText: { textAlign: 'center', color: '#fff' },
  head: { height: 40, backgroundColor: '#808B97',textAlign: 'center' },
  row: { flexDirection: 'row', backgroundColor: colors.lightText },
  textNoti: { margin: 6 },






})

export default styles;

