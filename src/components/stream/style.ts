import { StyleSheet } from 'react-native';
import { colors, Fonts, Sizes } from 'utils/theme';
import { Dimensions} from "react-native";
import { background } from 'native-base/lib/typescript/theme/styled-system';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { color } from 'react-native-reanimated';

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

  privateRequestItem: {

    borderStyle: "solid",
    borderColor:"#ddd",
    borderWidth:1,
    flexDirection:"row",
    marginTop:10,
    marginBottom:10
  },


  checkboxPrivateChat: {

   borderRadius:100
  }










})

export default styles;

