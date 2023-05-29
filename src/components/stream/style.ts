import { StyleSheet } from 'react-native';
import {  Sizes } from 'utils/theme';
import { getStatusBarHeight } from 'react-native-status-bar-height';

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
    marginVertical:10,
    padding:5


  },


  checkboxPrivateChat: {

   borderRadius:100
  }










})

export default styles;

