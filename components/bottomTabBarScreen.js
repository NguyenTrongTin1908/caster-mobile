import React from "react";
import { Image } from "react-native";
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Sizes } from "../constants/styles";
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { createAppContainer } from 'react-navigation';
import HomeScreen from "../screens/home/homeScreen";
import DiscoverScreen from "../screens/discover/discoverScreen";
import UploadScreen from "../screens/upload/uploadScreen";
import NotificationsScreen from "../screens/notifications/notificationsScreen";
import ProfileScreen from "../screens/profile/profileScreen";

const TabNavigator = createAppContainer(
    createBottomTabNavigator(
        {
            Home: {
                screen: HomeScreen,
                navigationOptions: {
                    header: () => null,
                    tabBarIcon: ({ tintColor }) => (
                        <MaterialIcons
                            name="home"
                            size={27}
                            color={tintColor}
                        />
                    ),
                },
            },
            Discover: {
                screen: DiscoverScreen,
                navigationOptions: {
                    tabBarIcon: ({ tintColor }) => (
                        <MaterialIcons
                            name="search"
                            size={27}
                            color={tintColor}
                        />
                    ),
                },
            },
            Upload: {
                showLabel: false,
                screen: UploadScreen,
                navigationOptions: {
                    tabBarIcon: () => (
                        <Image
                            source={require('../assets/images/plus-icon.png')}
                            style={{ width: 50.0, height: 50.0, }}
                            resizeMode="contain"
                        />
                    ),
                    tabBarLabel: () => null,
                    tabBarVisible: false,
                }
            },
            Notifications: {
                screen: NotificationsScreen,
                navigationOptions: {
                    header: () => null,
                    tabBarIcon: ({ tintColor }) => (
                        <MaterialIcons
                            name="notifications-none"
                            size={27}
                            color={tintColor}
                        />
                    ),
                }
            },
            Me: {
                screen: ProfileScreen,
                navigationOptions: {
                    header: () => null,
                    tabBarIcon: ({ tintColor, focused }) => (
                        <MaterialIcons
                            name="person"
                            size={27}
                            color={tintColor}
                        />
                    ),
                }
            },
        },
        {
            initialRouteName: "Home",
            barStyle: {
                backgroundColor: Colors.blackColor,
            },
            tabBarOptions: {
                showLabel: true,
                labelStyle: {
                    fontSize: 12,
                    fontFamily: 'Proxima_Nova_Font',
                    marginTop: Sizes.fixPadding - 20.0,
                    marginBottom: Sizes.fixPadding - 5.0
                },
                tabStyle: {
                    backgroundColor: Colors.blackColor,
                },
                style: {
                    height: 60.0,
                    elevation: 3.0,
                    borderTopColor: Colors.grayColor,
                    borderTopWidth: 0.20,
                    backgroundColor: Colors.blackColor,
                },
                activeTintColor: Colors.whiteColor,
                inactiveTintColor: Colors.grayColor,
            },
        },
    )
);

export default TabNavigator;

