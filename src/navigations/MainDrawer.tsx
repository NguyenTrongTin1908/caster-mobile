import * as Animatable from "react-native-animatable";
import React, { useRef, useEffect } from "react";
import { connect } from "react-redux";
import { StyleSheet, TouchableOpacity } from "react-native";
import {
  Box,
  FlatList,
  Flex,
  HStack,
  VStack,
  Text,
  View,
  Image,
  Divider,
} from "native-base";
import { showDrawer as showDrawerHandler } from "services/redux/app-nav/actions";
import Feather from "react-native-vector-icons/Feather";
import Entypo from "react-native-vector-icons/Entypo";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { logout } from "services/redux/auth/actions";
import storeHolder from "lib/storeHolder";
import { navigationRef } from "./RootStackNavigator";
import { colors } from "utils/theme";
import { IPerformer } from "src/interfaces";
import FontAwesome from "react-native-vector-icons/FontAwesome";


const styles = StyleSheet.create({
  container: {
    display: "none",
    position: "absolute",
    zIndex: -1,
    flex: 1,
    flexDirection: "row",
    width: "70%",
    height: "100%",
    shadowOffset: { width: 0, height: 1 }, // shadow right only
    shadowOpacity: 0.4,
    shadowRadius: 6,
  },
  drawerContainer: {
    flex: 5,
    backgroundColor: "#fff",
  },
  shadowContainer: {
    flex: 2,
  },
  touchClose: {
    width: "100%",
    height: "100%",
  },
  menuButton: {
    width: "100%",
    height: 40,
    flex: 1,
    flexDirection: "row",
  },
});

interface DrawerProps {
  user: IPerformer;
  loggedIn: boolean;
  showDrawer: boolean;
  hasTouchedDrawer: boolean;
  handleLogout: Function;
}

export const MainDrawer = ({
  loggedIn = false,
  showDrawer = false,
  hasTouchedDrawer = false,
  user,
  handleLogout,
}: DrawerProps): JSX.Element => {
  const viewRef = useRef(null) as any;


  const handleShow = () => {
    if (!showDrawer) viewRef.current.fadeOutLeft(800);
    else {
      viewRef.current.fadeInLeft(800);
    }
  };

  const handleHide = () => {
    const store = storeHolder.getStore();
    store?.dispatch(showDrawerHandler(false));
  };

  const renderProfile = () => {
    if (!loggedIn) {
      return (
        <Box safeAreaTop my={6} w="100%">
          <Image
            source={require("/assets/logo.png")}
            alt="logo"
            size={55}
            width="100%"
            resizeMode="contain"
          />
        </Box>
      );
    }

    return (
      <Box safeAreaTop bgColor={colors.primary} px={4} py={4}>
        <HStack space={3}>
          <Image
            source={{ uri: user?.avatar }}
            alt="user-avatar"
            width={60}
            height={60}
            borderRadius={30}
          />
          <VStack space={1} justifyContent="center">
            <Text fontSize="lg" bold color={colors.light}>
              {user?.name}
            </Text>
            <Text fontSize="xs" color={colors.light} textTransform="capitalize">
              {user?.country}
            </Text>
          </VStack>
          <Box mt={3} ml="auto">
            <TouchableOpacity onPress={()=>navigationRef.current?.navigate('EditProfile')}>
            <Feather name="edit" size={17} color={colors.light} />


            </TouchableOpacity>
          </Box>
        </HStack>
      </Box>
    );
  };

  const menuGuest = [
    {
      id: "login",
      label: "Login",
      icon: `${(<Entypo name="login" size={20} color={colors.dark} />)}`,
      onPress: () => {
        navigationRef.current?.navigate("IntroNav", {
          screen: "IntroNav/Login",
        });

        handleHide();
      },
    },
  ];

  const menuLoggedInItems = [
    {
      id: "golive",
      label: "Go Live Now",
      icon: `toggle-right`,
      onPress: () => {
        navigationRef.current?.navigate("Profile");
        handleHide();
      },
    },
    {
      id: "goPrivate",
      label: "Go Private",
      icon: `video-camera`,
      onPress: () => {
        // navigationRef.current?.navigate('MyFavorites');
        handleHide();
      },
    },
    {
      id: "top",
      label: "Top",
      icon: `bar-chart`,
      onPress: () => {
        //todo - update navigation
        // navigationRef.current?.navigate('');
        handleHide();
      },
    },
    {
      id: "explore",
      label: "Explore",
      icon: `search`,
      onPress: () => {
        //todo - update navigation
        // navigationRef.current?.navigate('');
        handleHide();
      },
    },
    {
      id: "manageProfile",
      label: "Manage Profile",
      icon: `user`,
      onPress: ()=>navigationRef.current?.navigate('ModelProfile'),
    },
    {
      id: "myWallet",
      label: "My Wallet",
      icon: "credit-card",
      onPress: () => {
        //todo - update navigation
        // navigationRef.current?.navigate('');
        handleHide();
      },
    },
    {
      id: "notification",
      label: "Notifications",
      icon: "bell-o",
      onPress: () => {
        //todo - update navigation
        // navigationRef.current?.navigate('');
        handleHide();
      },
    },
    {
      id: "purchaseHistory",
      label: "Purchase History",
      icon: `cart-arrow-down`,
      onPress: () => {
        // todo - should update logout redux
        handleLogout();
        handleHide();
      },
    },
    {
      id: "earningHistory",
      label: "Earnings History",
      icon: `money`,
      onPress: () => {
        // todo - should update logout redux
        handleLogout();
        handleHide();
      },
    },
    {
      id: "payoutResquest",
      label: "Payout Resquests",
      icon: `cc-paypal`,
      onPress: () => {
        // todo - should update logout redux
        handleLogout();
        handleHide();
      },
    },
    {
      id: "logout",
      label: "Logout",
      icon: `sign-out`,
      onPress: () => {
        // todo - should update logout redux
        handleLogout();
        handleHide();
      },
    },
  ];

  const renderMenuItem = ({ item }: any) => {
    return (
      <Box mt={1} marginTop={3}>
        <TouchableOpacity style={styles.menuButton} onPress={item.onPress}>
          <HStack space={3}>
            <Box flexDirection="row" >
              <FontAwesome name={item.icon} size={17} color={colors.appBgColor} />
            </Box>

            <Box flexDirection="row" marginLeft={3}>
              <Text size={"sm"} bold>
                {item.label}
              </Text>
            </Box>
          </HStack>
        </TouchableOpacity>
      </Box>
    );
  };

  useEffect(() => {
    hasTouchedDrawer && handleShow();
  }, [showDrawer]);
  return (
    <Animatable.View
      style={[
        styles.container,
        {
          zIndex: hasTouchedDrawer && showDrawer ? 999 : -1,
          display: showDrawer ? "flex" : "none",
        },
      ]}
      ref={viewRef}
    >
      <Flex flex={5} style={styles.drawerContainer}>
        <View>{renderProfile()}</View>
        <Divider />
        <View px={18} py={22}>
          <FlatList
            data={loggedIn ? menuLoggedInItems : menuGuest}
            renderItem={renderMenuItem}
            keyExtractor={(item) => item.id}
          />
        </View>
      </Flex>
    </Animatable.View>
  );
};

const mapStateToProp = (state: any) => ({
  user: state.user.current,
  loggedIn: state.auth.loggedIn,
  showDrawer: state.appNav.showDrawer,
  hasTouchedDrawer: state.appNav.hasTouchedDrawer,
});
const mapDispatch = {
  handleLogout: logout,
};
export default connect(mapStateToProp, mapDispatch)(MainDrawer);
