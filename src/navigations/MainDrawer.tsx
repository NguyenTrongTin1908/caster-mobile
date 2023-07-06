import * as Animatable from "react-native-animatable";
import React, { useRef, useEffect, useContext, useState } from "react";
import { connect } from "react-redux";
import { Linking, Alert, StyleSheet, TouchableOpacity } from "react-native";
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
import { logout } from "services/redux/auth/actions";
import storeHolder from "lib/storeHolder";
import { navigationRef } from "./RootStackNavigator";
import { colors, padding } from "utils/theme";
import { IPerformer } from "src/interfaces";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import socketHolder from "lib/socketHolder";
import { updateBalance } from "services/redux/user/actions";
import { notificationService } from "../services/notification.service";
import {
  addPrivateRequest,
  accessPrivateRequest,
  cancelPrivateRequest,
} from "services/redux/streaming/actions";
import { SocketContext } from "../socket";
import { shortenLargeNumber } from "../lib/number";
import { ROLE_PERMISSIONS } from "../constants";
import { EarningService, earningService } from "../services/earning.service";
interface DrawerProps {
  user: IPerformer;
  loggedIn: boolean;
  loggedOut: boolean;
  showDrawer: boolean;
  hasTouchedDrawer: boolean;
  handleLogout: Function;
  addPrivateRequest: Function;
  updateBalance: Function;
  cancelPrivateRequest: Function;
  fcmToken: any;
  system: any;
}
export const MainDrawer = ({
  loggedIn = false,
  showDrawer = false,
  hasTouchedDrawer = false,
  user,
  handleLogout,
  addPrivateRequest,
  updateBalance,
  cancelPrivateRequest: handleCancelPrivateRequest,
  loggedOut,
  fcmToken,
  system,
}: DrawerProps): JSX.Element => {
  const viewRef = useRef(null) as any;
  const { status: socketContextStatus } = useContext(SocketContext) as any;
  const [totalEarning, setTotalEarning] = useState(0);

  useEffect(() => {
    if (loggedOut) {
      handleHide();
      navigationRef.current?.navigate("IntroNav", {
        screen: "IntroNav/Login",
      });
    }
  }, [loggedOut]);
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
      <Box safeAreaTop py={4}>
        <TouchableOpacity
          onPress={() => {
            navigationRef.current?.navigate("MainTab/Home");
            handleHide();
          }}
        >
          <HStack alignSelf="center" mb={5}>
            <Image
              source={{ uri: system?.data?.logoUrl }}
              alt="logo"
              size={55}
              width="100%"
              resizeMode="contain"
            />
          </HStack>
        </TouchableOpacity>
        <Divider />
        <HStack px={4} space={3}>
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
              <Text fontSize="lg" bold color={colors.primary}>
                {user?.name ? `${user.name}` : `${user?.username}`}
              </Text>
            </TouchableOpacity>
            <Text fontSize="xs" color={colors.darkGray}>
              @{user?.username}
            </Text>
          </VStack>
        </HStack>
        <View
          flexDirection={"row"}
          justifyContent="space-between"
          marginTop={5}
          px={4}
        >
          <TouchableOpacity
            onPress={() => {
              navigationRef.current?.navigate("Wallet");
              handleHide();
            }}
          >
            <View flexDirection={"row"}>
              <Image
                source={require("assets/gem.png")}
                alt={"avatar"}
                size={22}
                resizeMode="contain"
              />
              <Text color={colors.darkText} marginX={2}>
                {shortenLargeNumber((user?.rubyBalance || 0).toFixed(2))}
              </Text>
            </View>
          </TouchableOpacity>
          {totalEarning ? (
            <TouchableOpacity
              onPress={() => {
                navigationRef.current?.navigate("Wallet");
                handleHide();
              }}
            >
              <View flexDirection={"row"}>
                <Image
                  source={require("assets/diamond.png")}
                  alt={"avatar"}
                  size={22}
                  resizeMode="contain"
                />
                <Text color={colors.darkText} marginX={2}>
                  {shortenLargeNumber((user?.balance || 0).toFixed(2))}
                </Text>
              </View>
            </TouchableOpacity>
          ) : (
            <></>
          )}
        </View>
        <Divider />
        <View style={styles.followBox}>
          <View style={styles.followBoxItems}>
            <TouchableOpacity
              onPress={() => {
                navigationRef.current?.navigate("ListFollow", {
                  tab: "Following",
                  performerId: user._id,
                });
                handleHide();
              }}
            >
              <Text color={colors.darkText}>Following</Text>
              <Text alignSelf={"center"} color={colors.darkText}>
                {user?.stats.totalFollowing}
              </Text>
            </TouchableOpacity>
          </View>
          {user?.roles?.includes(ROLE_PERMISSIONS.ROLE_HOST_PRIVATE) && (
            <View style={{ ...styles.followBoxItems, borderLeftWidth: 1 }}>
              <TouchableOpacity
                onPress={() => {
                  navigationRef.current?.navigate("ListFollow", {
                    tab: "Fans",
                    performerId: user._id,
                  });
                  handleHide();
                }}
              >
                <Text color={colors.darkText}>Fans</Text>
                <Text alignSelf={"center"} color={colors.darkText}>
                  {user?.stats.totalFollower}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
        <Divider />
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
      id: "goLive",
      label: "Go Live Now",
      icon: (
        <FontAwesome
          name={"toggle-right"}
          size={17}
          color={colors.appBgColor}
        />
      ),
      onPress: () => {
        navigationRef.current?.navigate("GoLivePage");
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
      id: "folowPost",
      label: "Following",
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
      id: "trending",
      label: "Trending",
      icon: (
        <Feather name={"trending-up"} size={17} color={colors.appBgColor} />
      ),
      onPress: () => {
        navigationRef.current?.navigate("Trending");
        handleHide();
      },
    },
    {
      id: "manageAccount",
      label: "Manage Account",
      icon: <FontAwesome name={"user"} size={17} color={colors.appBgColor} />,
      onPress: () => {
        navigationRef.current?.navigate("EditProfile");
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
      id: "help",
      label: "Help",
      icon: (
        <FontAwesome
          name={"question-circle-o"}
          size={17}
          color={colors.appBgColor}
        />
      ),
      onPress: () => {
        //todo - update navigation
        Linking.openURL("https://caster.com/help");
        handleHide();
      },
    },

    {
      id: "signOut",
      label: "Sign Out",
      icon: (
        <FontAwesome name={"sign-out"} size={17} color={colors.appBgColor} />
      ),
      onPress: () => {
        fcmToken && notificationService.removeToken(fcmToken);
        handleLogout();
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

  const [menuAuthentication, setMenuAuthentication] = useState(
    menuLoggedInItems
  ) as any;

  useEffect(() => {
    hasTouchedDrawer && handleShow();
  }, [showDrawer]);

  const handlePrivateChat = (data: any) => {
    addPrivateRequest({ ...data });
  };

  const handleUpdateBalance = (event) => {
    updateBalance({ token: event.token, type: "diamond-balance" });
  };

  const handleCancelPrivateChat = (data: {
    conversationId: string;
    user: IPerformer;
  }) => {
    Alert.alert(
      `${
        data?.user?.name || data?.user?.username
      }'ve cancelled private call request`
    );

    handleCancelPrivateRequest(data.conversationId);
  };

  const handleSocket = async () => {
    const socket = socketHolder.getSocket() as any;
    if (!socket || !socket.status) return;
    if (socketContextStatus === "connected") {
      socket.on("private-chat-request", (data) => {
        handlePrivateChat(data);
      });
      socket.on("update_balance", (data) => {
        handleUpdateBalance(data);
      });

      socket.on("private-chat-cancel", (data) => {
        handleCancelPrivateChat(data);
      });
    }
  };

  const handleDisconnect = () => {
    const socket = socketHolder.getSocket() as any;
    if (!socket || !socket.status) return;
    socket.off("private-chat-request");
  };

  function removeObjectWithId(arr, id) {
    return arr.filter((obj) => obj.id !== id);
  }

  useEffect(() => {
    if (!socketContextStatus) return;
    setTimeout(() => {
      handleSocket();
    }, 100);

    return function clear() {
      handleDisconnect();
    };
  }, [socketContextStatus]);

  useEffect(() => {
    let arrFilter = menuLoggedInItems;
    if (
      user?.roles &&
      !user?.roles.includes(ROLE_PERMISSIONS.ROLE_FAN_PAYING)
    ) {
      arrFilter = removeObjectWithId(arrFilter, "purchaseHistory");
    }
    if (user?.roles && !user?.roles.includes(ROLE_PERMISSIONS.ROLE_HOST_LIVE)) {
      arrFilter = removeObjectWithId(arrFilter, "goLive");
    }
    if (
      user?.roles &&
      !user?.roles.includes(ROLE_PERMISSIONS.ROLE_HOST_PRIVATE)
    ) {
      arrFilter = removeObjectWithId(arrFilter, "goPrivate");
    }
    setMenuAuthentication(arrFilter);

    const getEarning = async () => {
      const resp = await earningService.performerSearch();
      if (resp?.data) {
        setTotalEarning(resp.data.total);
      }
    };
    getEarning();
  }, [user]);

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
      <View style={styles.drawerContainer}>
        <FlatList
          data={loggedIn ? menuAuthentication : menuGuest}
          ListHeaderComponent={renderProfile}
          renderItem={renderMenuItem}
          keyExtractor={(item) => item.id}
          px={18}
          py={14}
        />
      </View>
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
    width: "70%",
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
  followBox: {
    flexDirection: "row",
    justifyContent: "center",
    width: "100%",
    alignItems: "center",
    marginVertical: 5,
    paddingHorizontal: 4,
  },
  followBoxItems: {
    width: "50%",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
  },
});
const mapStateToProp = (state: any) => ({
  user: state.user.current,
  loggedIn: state.auth.loggedIn,
  loggedOut: state.auth.loggedOut,
  fcmToken: state.auth.fcmToken,
  showDrawer: state.appNav.showDrawer,
  hasTouchedDrawer: state.appNav.hasTouchedDrawer,
  system: { ...state.system },
});
const mapDispatch = {
  updateBalance,
  handleLogout: logout,
  addPrivateRequest,
  accessPrivateRequest,
  cancelPrivateRequest,
};
export default connect(mapStateToProp, mapDispatch)(MainDrawer);
