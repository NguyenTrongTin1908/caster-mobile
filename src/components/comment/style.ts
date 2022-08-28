import { StyleSheet } from 'react-native';
import { Colors, Fonts, Sizes } from "../../constants/styles";




const styles = StyleSheet.create({



  container: { flex: 1 },
  modalComment: {
    marginBottom  : 50
  },
  commentItem: {
    // marginHorizontal: Sizes.fixPadding + 5.0,
    // marginVertical: Sizes.fixPadding,
    flexDirection: 'row',
    // justifyContent: 'space-between',
    // alignItems: 'center'
  },
  sendComment: {
    marginLeft: 'auto',
    alignItems:'center',
        justifyContent:'center'


  }

});

export default styles;
