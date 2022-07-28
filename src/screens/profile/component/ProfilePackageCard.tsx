import React from 'react';
import { Flex, Text, VStack, HStack, Box, Image, ScrollView } from 'native-base';
import {
  Dimensions,
  StyleSheet,
  View
} from 'react-native';
import { colors } from 'utils/theme';
import { ITokenPackage } from 'interfaces/token-package';
import NumberFormat from 'components/uis/NumberFormat';
import Button from 'components/uis/Button';
let screen = Dimensions.get('window');
import { IFeed } from 'interfaces/feed';

// import styles from './style'

interface IProps {
  item: IFeed;
}

const ProfilePackageCard = ({
  item
}: IProps): React.ReactElement => {

  { item && console.log('item', item.files[0].url) }

  return (
    <View>
      <Image source={{ uri: item.files[0].url }} style={styles.image} />


    </View>


  )
};

const styles = StyleSheet.create({
  contentContainer: {
    backgroundColor: '#F5FCFF',

  },
  image: {
    width: screen.width,
    height: 300,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },

});
export default ProfilePackageCard;
