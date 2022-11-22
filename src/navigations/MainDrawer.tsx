import * as Animatable from "react-native-animatable";
import React, { useRef, useEffect, useContext, useState } from "react";
import { connect } from "react-redux";
import { StyleSheet, TouchableOpacity } from "react-native";
import {
  ScrollView,
  Box,
  FlatList,
  Flex,
  HStack,
  VStack,
  Text,
  View,
  Image,
  Divider,
  Alert,
} from "native-base";
import { showDrawer as showDrawerHandler } from "services/redux/app-nav/actions";
import Feather from "react-native-vector-icons/Feather";
import Entypo from "react-native-vector-icons/Entypo";
import { logout } from "services/redux/auth/actions";
import storeHolder from "lib/storeHolder";
import { navigationRef } from "./RootStackNavigator";
import { colors } from "utils/theme";
import { IPerformer } from "src/interfaces";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import socketHolder from "lib/socketHolder";
import {
  addPrivateRequest,
  accessPrivateRequest,
  cancelPrivateRequest,
} from "services/redux/streaming/actions";

import { SocketContext } from "../socket";
interface DrawerProps {
  user: IPerformer;
  loggedIn: boolean;
  showDrawer: boolean;
  hasTouchedDrawer: boolean;
  handleLogout: Function;
  addPrivateRequest: Function;
}
export const MainDrawer = ({
  loggedIn = false,
  showDrawer = false,
  hasTouchedDrawer = false,
  user,
  handleLogout,
  addPrivateRequest,
}: DrawerProps): JSX.Element => {
  const viewRef = useRef(null) as any;
  const socketContext = useContext(SocketContext) as any;
  const { status: socketContextStatus } = useContext(SocketContext) as any;
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
      <Box safeAreaTop bgColor={colors.dark} px={4} py={4}>
        <HStack space={3}>
          <TouchableOpacity
            onPress={() => {
              navigationRef.current?.navigate("Profile");
              handleHide();
            }}
          >
            <Image
              source={
                user?.avatar
                  ? { uri: user?.avatar }
                  : require("../assets/avatar-default.png")
              }
              alt="user-avatar"
              width={60}
              height={60}
              borderRadius={30}
            />
          </TouchableOpacity>
          <VStack space={1} justifyContent="center">
            <TouchableOpacity
              onPress={() => {
                navigationRef.current?.navigate("Profile");
                handleHide();
              }}
            >
              <Text fontSize="lg" bold color={colors.light}>
                {user?.name ? `${user.name}` : `${user?.username}`}
              </Text>
            </TouchableOpacity>
            <Text fontSize="xs" color={colors.light} textTransform="capitalize">
              {user?.country}
            </Text>
          </VStack>
          <Box mt={3} ml="auto">
            <TouchableOpacity
              onPress={() => navigationRef.current?.navigate("EditProfile")}
            >
              <Feather name="edit" size={17} color={colors.light} />
            </TouchableOpacity>
          </Box>
        </HStack>
        <View
          flexDirection={"row"}
          justifyContent="space-between"
          marginTop={5}
        >
          <TouchableOpacity>
            <View flexDirection={"row"}>
              <FontAwesome name="heart" size={20} color={colors.primary} />
              <Text color={colors.lightText} marginX={2}>
                {(user?.rubyBalance || 0).toFixed(2)}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  navigationRef.current?.navigate("TokenPackage");
                  handleHide();
                }}
              >
                <FontAwesome
                  color={colors.btnSecondaryColor}
                  size={20}
                  name="plus-circle"
                ></FontAwesome>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
          <TouchableOpacity>
            <View flexDirection={"row"}>
              <FontAwesome
                name="diamond"
                size={20}
                color={colors.diamondIcon}
              />
              <Text color={colors.lightText} marginX={2}>
                {(user?.balance || 0).toFixed(2)}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </Box>
    );
  };
  const menuGuest = [
    {
      id: "login",
      label: "Login",
      icon: <Entypo name="login" size={20} color={colors.dark} />,
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
      icon: (
        <FontAwesome
          name={"toggle-right"}
          size={17}
          color={colors.appBgColor}
        />
      ),
      onPress: () => {
        navigationRef.current?.navigate("PublicStream");
        handleHide();
      },
    },
    {
      id: "goPrivate",
      label: "Go Private",
      icon: (
        <FontAwesome
          name={"video-camera"}
          size={17}
          color={colors.appBgColor}
        />
      ),
      onPress: () => {
        navigationRef.current?.navigate("PrivateChatWaitingRoom");
        handleHide();
      },
    },
    {
      id: "explore",
      label: "Explore",
      icon: <FontAwesome name={"search"} size={17} color={colors.appBgColor} />,
      onPress: () => {
        //todo - update navigation
        // navigationRef.current?.navigate('');
        handleHide();
      },
    },
    {
      id: "folowPost",
      label: "Follow Post",
      icon: (
        <MaterialIcons name={"group"} size={17} color={colors.appBgColor} />
      ),
      onPress: () => {
        //todo - update navigation
        navigationRef.current?.navigate("FollowPost");
        handleHide();
      },
    },
    {
      id: "manageProfile",
      label: "Manage Profile",
      icon: <FontAwesome name={"user"} size={17} color={colors.appBgColor} />,
      onPress: () => {
        navigationRef.current?.navigate("Profile");
        handleHide();
      },
    },
    {
      id: "myWallet",
      label: "My Wallet",
      icon: (
        <FontAwesome name={"credit-card"} size={17} color={colors.appBgColor} />
      ),
      onPress: () => {
        //todo - update navigation
        navigationRef.current?.navigate("Wallet");
        handleHide();
      },
    },
    {
      id: "bookmarks",
      label: "Bookmarks",
      icon: <Feather name={"bookmark"} size={17} color={colors.appBgColor} />,
      onPress: () => {
        //todo - update navigation
        navigationRef.current?.navigate("Bookmarks");
        handleHide();
      },
    },
    {
      id: "notificationPage",
      label: "Notifications And Mail",
      icon: <Entypo name={"bell"} size={17} color={colors.appBgColor} />,
      onPress: () => {
        //todo - update navigation
        navigationRef.current?.navigate("NotificationPage");
        handleHide();
      },
    },
    {
      id: "followerList",
      label: "Follower List",
      icon: <FontAwesome name={"user"} size={17} color={colors.appBgColor} />,
      onPress: () => {
        navigationRef.current?.navigate("ListFollow");
        handleHide();
      },
    },
    {
      id: "purchaseHistory",
      label: "Purchase History",
      icon: (
        <FontAwesome
          name={"cart-arrow-down"}
          size={17}
          color={colors.appBgColor}
        />
      ),
      onPress: () => {
        navigationRef.current?.navigate("ModelOrderPage");

        handleHide();
      },
    },
    {
      id: "earningHistory",
      label: "Earnings History",
      icon: <FontAwesome name={"money"} size={17} color={colors.appBgColor} />,
      onPress: () => {
        handleHide();
      },
    },
    {
      id: "payoutRequests",
      label: "Payout requests",
      icon: (
        <FontAwesome name={"cc-paypal"} size={17} color={colors.appBgColor} />
      ),
      onPress: () => {
        handleHide();
      },
    },
    {
      id: "logout",
      label: "Logout",
      icon: (
        <FontAwesome name={"sign-out"} size={17} color={colors.appBgColor} />
      ),
      onPress: () => {
        handleLogout();
        handleHide();
        navigationRef.current?.navigate("IntroNav", {
          screen: "IntroNav/Login",
        });
      },
    },
  ];
  const renderMenuItem = ({ item }: any) => {
    return (
      <Box mt={1} marginTop={3}>
        <TouchableOpacity style={styles.menuButton} onPress={item.onPress}>
          <HStack space={3}>
            <Box flexDirection="row">{item.icon}</Box>
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

  const handlePrivateChat = (data: any) => {
    // Alert(
    //   `${
    //     data?.user?.name || data?.user?.username
    //   }'ve sent you a private call request`
    // );
    addPrivateRequest({ ...data });
    // this.setState({ openCallRequest: true });
  };

  const handleSocket = async () => {
    const socket = socketHolder.getSocket() as any;
    if (!socket || !socket.status) return;
    socketContextStatus === "connected" &&
      socket.on("private-chat-request", (data) => {
        handlePrivateChat(data);
      });
  };

  const handleDisconnect = () => {
    const socket = socketHolder.getSocket() as any;
    if (!socket || !socket.status) return;
    socket.off("private-chat-request");
  };

  useEffect(() => {
    if (!socketContextStatus) return;
    setTimeout(() => {
      handleSocket();
    }, 100);

    return function clear() {
      handleDisconnect();
    };
  }, [socketContextStatus]);

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
        <FlatList
          data={loggedIn ? menuLoggedInItems : menuGuest}
          renderItem={renderMenuItem}
          keyExtractor={(item) => item.id}
          px={18}
          py={14}
        />
      </Flex>
      <Flex
        flex={2}
        style={[
          {
            backgroundColor: showDrawer
              ? "rgba(52, 52, 52, 0.2)"
              : "rgba(52, 52, 52, 0)",
          },
        ]}
      >
        <TouchableOpacity style={styles.touchClose} onPress={handleHide} />
      </Flex>
    </Animatable.View>
  );
};
const styles = StyleSheet.create({
  container: {
    display: "none",
    position: "absolute",
    zIndex: -1,
    flex: 1,
    flexDirection: "row",
    width: "100%",
    height: "100%",
    shadowOffset: { width: 0, height: 1 }, // shadow right only
    shadowOpacity: 0.4,
    shadowRadius: 6,
  },
  drawerContainer: {
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
const mapStateToProp = (state: any) => ({
  user: state.user.current,
  loggedIn: state.auth.loggedIn,
  showDrawer: state.appNav.showDrawer,
  hasTouchedDrawer: state.appNav.hasTouchedDrawer,
});
const mapDispatch = {
  handleLogout: logout,
  addPrivateRequest,
};
export default connect(mapStateToProp, mapDispatch)(MainDrawer);
