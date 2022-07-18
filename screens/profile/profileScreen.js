import React from "react";
import { Component } from "react";
import { BackHandler, SafeAreaView, TouchableOpacity, StatusBar, Dimensions, StyleSheet, Text, View, Image } from "react-native";
import { withNavigation } from "react-navigation";
import { Colors, Fonts, Sizes } from "../../constants/styles";
import CollapsingToolbar from "../../components/sliverAppBarScreen";
import { MaterialCommunityIcons, MaterialIcons, } from '@expo/vector-icons';
import { Menu } from 'react-native-material-menu';
import Dialog from "react-native-dialog";
import { NavigationEvents } from 'react-navigation';

const { width } = Dimensions.get('window');

const postsImagesList = [
    {
        id: '1',
        image: require('../../assets/images/dance/dance_1.jpg'),
    },
    {
        id: '2',
        image: require('../../assets/images/dance/dance_2.jpg'),
    },
    {
        id: '3',
        image: require('../../assets/images/dance/dance_3.jpg'),
    },
    {
        id: '4',
        image: require('../../assets/images/dance/dance_4.jpg'),
    },
    {
        id: '5',
        image: require('../../assets/images/dance/dance_5.jpg'),
    },
    {
        id: '6',
        image: require('../../assets/images/dance/dance_6.jpg'),
    },
    {
        id: '7',
        image: require('../../assets/images/laugh/laugh_1.jpg'),
    },
    {
        id: '8',
        image: require('../../assets/images/laugh/laugh_2.jpg'),
    },
    {
        id: '9',
        image: require('../../assets/images/laugh/laugh_3.jpg'),
    },
    {
        id: '10',
        image: require('../../assets/images/laugh/laugh_4.jpg'),
    },
    {
        id: '11',
        image: require('../../assets/images/laugh/laugh_5.jpg'),
    },
    {
        id: '12',
        image: require('../../assets/images/laugh/laugh_6.jpg'),
    },
    {
        id: '13',
        image: require('../../assets/images/dance/dance_1.jpg'),
    },
    {
        id: '14',
        image: require('../../assets/images/dance/dance_2.jpg'),
    },
    {
        id: '15',
        image: require('../../assets/images/dance/dance_3.jpg'),
    },
    {
        id: '16',
        image: require('../../assets/images/dance/dance_4.jpg'),
    },
    {
        id: '17',
        image: require('../../assets/images/dance/dance_5.jpg'),
    },
    {
        id: '18',
        image: require('../../assets/images/dance/dance_6.jpg'),
    },
    {
        id: '19',
        image: require('../../assets/images/laugh/laugh_1.jpg'),
    },
    {
        id: '20',
        image: require('../../assets/images/laugh/laugh_2.jpg'),
    },
    {
        id: '21',
        image: require('../../assets/images/laugh/laugh_3.jpg'),
    },
    {
        id: '22',
        image: require('../../assets/images/laugh/laugh_4.jpg'),
    },
    {
        id: '23',
        image: require('../../assets/images/laugh/laugh_5.jpg'),
    },
    {
        id: '24',
        image: require('../../assets/images/laugh/laugh_6.jpg'),
    },
];

class ProfileScreen extends Component {

    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton.bind(this));
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton.bind(this));
    }

    handleBackButton = () => {
        BackHandler.exitApp();
        return true;
    };

    state = {
        showOptions: false,
        currentIndex: 1,
        showLogoutDialog: false,
    }

    render() {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: Colors.blackColor }}>
                <StatusBar translucent={false} backgroundColor={Colors.blackColor} />
                <NavigationEvents onDidFocus={() => {
                    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton.bind(this));
                }} />
                <CollapsingToolbar
                    rightItem={this.menu()}
                    toolbarColor={Colors.blackColor}
                    toolbarMinHeight={130}
                    toolbarMaxHeight={400}
                    element={this.profileInfo()}
                    tabBarOptions={
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            {this.tabBarItems({ iconName: 'view-dashboard', index: 1 })}
                            {this.tabBarItems({ iconName: 'heart-outline', index: 2 })}
                            {this.tabBarItems({ iconName: 'bookmark-outline', index: 3 })}
                        </View>
                    }
                >
                    <View style={{ paddingBottom: Sizes.fixPadding * 2.0, }}>
                        {
                            this.state.currentIndex == 1
                                ?
                                this.postsInfo()
                                :
                                this.state.currentIndex == 2
                                    ?
                                    this.postsInfo()
                                    :
                                    this.postsInfo()
                        }
                    </View>
                </CollapsingToolbar>
                {this.logoutDialog()}
            </SafeAreaView>
        )
    }

    logoutDialog() {
        return (
            <Dialog.Container visible={this.state.showLogoutDialog}
                contentStyle={styles.dialogContainerStyle}
                headerStyle={{ margin: 0.0, }}
            >
                <View style={{ backgroundColor: Colors.whiteColor, alignItems: 'center', }}>
                    <Text style={{ ...Fonts.blackColor16Bold, }}>
                        You sure want to logout?
                    </Text>
                    <View style={styles.okAndCancelButtonContainerStyle}>
                        <TouchableOpacity
                            activeOpacity={0.9}
                            onPress={() => this.setState({ showLogoutDialog: false })}
                            style={styles.cancelButtonStyle}
                        >
                            <Text style={{ ...Fonts.blackColor14Bold }}>
                                Cancel
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            activeOpacity={0.9}
                            onPress={() => {
                                this.setState({ showLogoutDialog: false })
                                this.props.navigation.push('Login')
                            }}
                            style={styles.logoutButtonStyle}
                        >
                            <Text style={{ ...Fonts.whiteColor14Bold }}>
                                Log out
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Dialog.Container>
        )
    }

    postsInfo() {
        return (
            <View style={{ marginHorizontal: Sizes.fixPadding - 9.0, flexDirection: 'row', flexWrap: 'wrap' }}>
                {postsImagesList.map((item, index) => (
                    <View key={item.id}>
                        <Image
                            style={styles.postImageStyle}
                            source={item.image}
                        />
                    </View>
                ))}
            </View>
        )
    }

    tabBarItems({ iconName, index }) {
        return (
            <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => this.setState({ currentIndex: index })}
                style={{ width: width / 3.0, alignItems: 'center' }}
            >
                <MaterialCommunityIcons
                    name={iconName}
                    color={Colors.whiteColor}
                    size={25}
                    style={{ marginBottom: Sizes.fixPadding + 5.0, }}
                />
                {
                    this.state.currentIndex == index ?
                        <View style={{
                            backgroundColor: Colors.whiteColor,
                            height: 2.0,
                            width: width / 3.0
                        }} />
                        :
                        <View style={{ height: 2.0 }} />
                }
            </TouchableOpacity>
        )
    }

    profileInfo() {
        return (
            <View style={{ flex: 1, }}>
                <View style={{ alignItems: 'center' }}>
                    <Image
                        source={require('../../assets/images/user_profile/user_3.jpg')}
                        style={styles.profileImageStyle}
                    />
                    <Text style={{ marginVertical: Sizes.fixPadding, ...Fonts.whiteColor17SemiBold }}>
                        Allison Perry
                    </Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <TouchableOpacity
                            activeOpacity={0.9}
                            onPress={() => this.props.navigation.push('EditProfile')}
                            style={styles.editProfileButtonStyle}
                        >
                            <Text style={{ ...Fonts.whiteColor15Regular }}>
                                Edit Profile
                            </Text>
                        </TouchableOpacity>
                        <Image
                            source={require('../../assets/images/insta.png')}
                            style={{ marginLeft: Sizes.fixPadding + 5.0, width: 30.0, height: 30.0, }}
                            resizeMode="contain"
                        />
                    </View>
                </View>

                <View style={{ marginTop: Sizes.fixPadding + 5.0, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly' }}>
                    <View style={{ alignItems: 'center' }}>
                        <Text style={{ ...Fonts.whiteColor16Bold }}>
                            5.5m
                        </Text>
                        <Text style={{ ...Fonts.grayColor14Regular }}>
                            Likes
                        </Text>
                    </View>
                    <View style={{ alignItems: 'center' }}>
                        <Text style={{ ...Fonts.whiteColor16Bold }}>
                            2.3m
                        </Text>
                        <Text style={{ ...Fonts.grayColor14Regular }}>
                            Followers
                        </Text>
                    </View>
                    <View style={{ alignItems: 'center' }}>
                        <Text style={{ ...Fonts.whiteColor16Bold }}>
                            59
                        </Text>
                        <Text style={{ ...Fonts.grayColor14Regular }}>
                            Following
                        </Text>
                    </View>
                </View>


            </View>
        )
    }

    menu() {
        return (
            <Menu
                visible={this.state.showOptions}
                style={{ marginRight: Sizes.fixPadding, paddingTop: Sizes.fixPadding, paddingHorizontal: Sizes.fixPadding }}
                anchor={
                    <MaterialIcons
                        name="more-vert"
                        size={25}
                        color={Colors.whiteColor}
                        onPress={() => this.setState({ showOptions: true })}
                    />
                }
                onRequestClose={() => this.setState({ showOptions: false })}
            >
                <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={() => {
                        this.setState({ showOptions: false })
                        this.props.navigation.push('ProfileSettings')
                    }}
                >
                    {this.menuItems(
                        {
                            iconName: 'person-outline',
                            option: 'Profile Setting'
                        }
                    )}
                </TouchableOpacity>
                {this.menuItems(
                    {
                        iconName: 'share',
                        option: 'Share Profile'
                    }
                )}
                <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={() => {
                        this.setState({ showOptions: false })
                        this.props.navigation.push('TermsOfUse')
                    }}
                >
                    {this.menuItems(
                        {
                            iconName: 'vpn-key',
                            option: 'Term of Use'
                        }
                    )}
                </TouchableOpacity>
                {this.menuItems(
                    {
                        iconName: 'star',
                        option: 'Rate App'
                    }
                )}
                <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={() => this.setState({ showOptions: false, showLogoutDialog: true })}
                >
                    {this.menuItems(
                        {
                            iconName: 'logout',
                            option: 'Logout'
                        }
                    )}
                </TouchableOpacity>
            </Menu>
        )
    }

    menuItems({ iconName, option }) {
        return (
            <View style={{ marginVertical: Sizes.fixPadding + 2.0, flexDirection: 'row', alignItems: 'center' }}>
                <MaterialIcons
                    name={iconName}
                    color={Colors.blackColor}
                    size={20}
                />
                <Text style={{ marginLeft: Sizes.fixPadding - 5.0, ...Fonts.blackColor14Bold }}>
                    {option}
                </Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    postImageStyle: {
        width: '100%',
        alignSelf: 'center',
        height: 130,
        borderRadius: Sizes.fixPadding - 5.0,
        marginTop: Sizes.fixPadding - 5.0,
        width: width / 3.13,
        flexDirection: 'row',
        justifyContent: 'center',
        marginHorizontal: Sizes.fixPadding - 8.0,
    },
    editProfileButtonStyle: {
        borderColor: Colors.primaryColor,
        borderWidth: 2.0,
        borderRadius: Sizes.fixPadding - 5.0,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: Sizes.fixPadding - 3.0,
        paddingHorizontal: Sizes.fixPadding * 2.0,
    },
    profileImageStyle: {
        width: 90.0,
        height: 90.0,
        borderWidth: 2.0,
        borderColor: Colors.whiteColor,
        borderRadius: 45.0,
    },
    dialogContainerStyle: {
        borderRadius: Sizes.fixPadding,
        width: width - 70,
        paddingHorizontal: Sizes.fixPadding * 2.0,
        padding: Sizes.fixPadding * 2.0
    },
    cancelButtonStyle: {
        flex: 0.50,
        backgroundColor: '#E0E0E0',
        borderRadius: Sizes.fixPadding - 5.0,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: Sizes.fixPadding,
        marginRight: Sizes.fixPadding + 5.0,
    },
    logoutButtonStyle: {
        flex: 0.50,
        backgroundColor: Colors.primaryColor,
        borderRadius: Sizes.fixPadding - 5.0,
        paddingVertical: Sizes.fixPadding,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: Sizes.fixPadding + 5.0
    },
    okAndCancelButtonContainerStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: Sizes.fixPadding * 2.0,
        marginHorizontal: Sizes.fixPadding + 5.0
    },
});

ProfileScreen.navigationOptions = () => {
    return {
        header: () => null
    }
}

export default withNavigation(ProfileScreen);
