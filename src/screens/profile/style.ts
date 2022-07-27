import { StyleSheet } from 'react-native';
import { colors, Fonts, Sizes } from 'utils/theme';
import { Dimensions} from "react-native";
import { background } from 'native-base/lib/typescript/theme/styled-system';

const { width, height } = Dimensions.get('window');



const styles = StyleSheet.create({

  imgCover: {
    width:width ,
    height: 100.0,


},
container: {
  flex: 1,
},

converPhoto: {
  width: '100%',
  height: 130,
},
avContainer: {
  height: 180,
  width: 180,
  borderRadius: 200,
  backgroundColor: 'white',
  position: 'absolute',
  alignSelf: 'center',
  marginTop: 50,
  alignItems: 'center',
  justifyContent: 'center',
},
avBlueRound: {
  height: '85%',
  width: '85%',
  borderRadius: 200,
  borderWidth: 5,
  borderColor: 'blue',
  alignItems: 'center',
  justifyContent: 'center',
},
bgImage: {
  height: '85%',
  width: '85%',
  borderRadius: 200,
  borderWidth: 5,
  alignItems: 'center',
  justifyContent: 'center',
},
activeNowTick: {
  height: 30,
  width: 30,
  backgroundColor: 'green',
  borderRadius: 30,
  position: 'absolute',
  right: 0,
  bottom: 20,
  borderWidth: 3,
  borderColor: 'white',
},

listFeeds: {
  height: '100%',
  width: '100%',
  marginTop: 35

}

});

export default styles;

