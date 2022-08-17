import React from 'react';
import { Flex, Divider, Box, HStack, View, Text } from 'native-base';
import { Dimensions, StatusBar, TouchableOpacity, Animated, FlatList, } from 'react-native';
import { useNavigation } from '@react-navigation/core';
import { colors, Sizes } from 'utils/theme'
import { omit } from 'lodash';
import { connect } from 'react-redux';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import styles from './style';
import { logout } from 'services/redux/auth/actions';
import { Menu } from 'react-native-material-menu';
import { useState, useRef } from 'react';
import * as Animatable from "react-native-animatable";
import Feather from "react-native-vector-icons/Feather";
const initialLayout = { width: Dimensions.get('window').width };

const MenuTab = (): React.ReactElement => {
  const navigation = useNavigation() as any;
  const [showOptions, setshowOptions] = useState(false);
  const viewRef = useRef(null) as any;
  ;
  const renderMenuItem = ({ item }: any) => {
    return (
      <Box mt={1}>
        <TouchableOpacity style={styles.menuButton} onPress={item.onPress}>
          <HStack space={3}>
            <Box flexDirection="row" alignItems="center">
              {item.icon}
            </Box>
            <Box flexDirection="row" alignItems="center">
              <Text size={"sm"} bold>
                {item.label}
              </Text>
            </Box>
          </HStack>
        </TouchableOpacity>
      </Box>
    );
  };
  const handleItem = (option) => {
    switch (option) {
      case 'Top Caster':
        setshowOptions(false)
        navigation.navigate('Model', { screen: 'Model' });
      default:

    }
  }
  const menuItems = ({ option }) => {
    return (
      <TouchableOpacity onPress={() => {
        handleItem(option);
      }}>
        <Text style={{ marginRight: Sizes.fixPadding * 2, marginVertical: Sizes.fixPadding + 2.0, fontWeight: 'bold' }}>
          {option}
        </Text>
      </TouchableOpacity>
    )
  }
  return (
    <Animated.View style={styles.bar}>
      <TouchableOpacity onPress={() => navigation.goBack()} >
        <View style={styles.left}>
          <MaterialIcons
            name="arrow-back"
            color={colors.lightText}
            size={24}
          />
        </View>
      </TouchableOpacity>
      <TouchableOpacity >
        <View style={styles.right}>
          <Menu
            visible={showOptions}
            anchor={
              <MaterialIcons
                name="more-vert"
                size={30}
                color={colors.lightText}
                onPress={() => setshowOptions(true)}
              />
            }
            onRequestClose={() => setshowOptions(false)}
          >
            {menuItems({ option: 'Top Caster' })}
          </Menu>
        </View>
      </TouchableOpacity>
    </Animated.View>
  )
}
export default MenuTab;
