import React from 'react';
import { Flex, Divider, Box, HStack, View, Text } from 'native-base';
import { Dimensions, StatusBar, TouchableOpacity, Animated, FlatList, Alert, Modal, Pressable, } from 'react-native';
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
import { reportService } from 'services/report.service';
import { IFeed, IPerformer } from 'src/interfaces';
const initialLayout = { width: Dimensions.get('window').width };
import ReportModal from 'components/modal/report'
import KeyboardDismiss from "components/uis/KeyboardDismiss";

interface IProps {
  feed: IFeed;
}
const MenuTab = ({feed}: IProps) : React.ReactElement => {
  const navigation = useNavigation() as any;
  const [showOptions, setshowOptions] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const changeModalVisible = (bool) => {
    setModalVisible(bool)
  }
  const setDataConfirm = (data,content) => {
    if(data === 'Cancel')
    return;
    handleReport(content)
  }
  const handleReport= async(reason: string) => {
    if (!reason || reason.length < 20) {
      Alert.alert("You report must be at least 20 characters");
      return;
    }
    try {
      await reportService.create({
        target: 'feed', targetId: feed._id, performerId: feed.fromSourceId, description: reason
      });
      Alert.alert("Report successfully");
    } catch {
      Alert.alert("Something went wrong, please try again later");
    }
  }
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
      case 'Report'    :
        setshowOptions(false)
        changeModalVisible(true)
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
            {menuItems({ option: 'Report' })}
          </Menu>
        </View>
      </TouchableOpacity>
      {modalVisible &&
      <KeyboardDismiss>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          changeModalVisible(false);
        }}
        >
        <ReportModal feed={feed} changeModalVisible={changeModalVisible} setDataConfirm={setDataConfirm} ></ReportModal>
      </Modal>
      </KeyboardDismiss>
      }
    </Animated.View>
  )
}
export default MenuTab;
