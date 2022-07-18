import React from "react";
import { Component } from "react";
import { BackHandler, SafeAreaView, TouchableOpacity, StatusBar, Dimensions, StyleSheet, Text, View, Image } from "react-native";
import { withNavigation } from "react-navigation";
import { Colors, Fonts, Sizes } from "../../constants/styles";
import CollapsingToolbar from "../../components/sliverAppBarScreen";
import { MaterialCommunityIcons, MaterialIcons, } from '@expo/vector-icons';
import { Menu } from 'react-native-material-menu';
import Dialog from "react-native-dialog";

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

class VideoMakerProfileScreen extends Component {

    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton.bind(this));
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton.bind(this));
    }

    handleBackButton = () => {
        this.props.navigation.pop();
        return true;
    };

    state = {
        showOptions: false,
        currentIndex: 1,
        showLogoutDialog: false,
        isFollow: false,
        currentScrollIndex: 1,
        scrollDirection: null
    }

    render() {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: Colors.blackColor }}>
                <StatusBar translucent={false} backgroundColor={Colors.blackColor} />
                <CollapsingToolbar
                    leftItem={
                        <MaterialIcons
                            name="arrow-back"
                            color={Colors.whiteColor}
                            size={24}
                            onPress={() => this.props.navigation.pop()}
                        />
                    }
                    rightItem={this.menu()}
                    toolbarColor={Colors.blackColor}
                    toolbarMinHeight={130}
                    toolbarMaxHeight={420}
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
            </SafeAreaView >
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
                                this.setState({
                                    showLogoutDialog: false,
                                })
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
                        source={require('../../assets/images/spook.png')}
                        style={styles.profileImageStyle}
                    />
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={{ margin: Sizes.fixPadding, ...Fonts.whiteColor17SemiBold }}>
                            Sara Ali Khan
                        </Text>
                        <View style={{
                            width: 20.0, height: 20.0,
                            borderRadius: 10.0,
                            backgroundColor: Colors.primaryColor,
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}>
                            <MaterialIcons
                                name="done"
                                color={Colors.whiteColor}
                                size={15}
                            />
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <TouchableOpacity
                            activeOpacity={0.9}
                            onPress={() => this.props.navigation.push('Messages')}
                            style={styles.messageButtonStyle}
                        >
                            <Text style={{ ...Fonts.whiteColor15Regular }}>
                                Message
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            activeOpacity={0.9}
                            onPress={() => this.setState({ isFollow: !this.state.isFollow })}
                            style={styles.followButtonStyle}
                        >
                            <Text style={{ ...Fonts.whiteColor15Regular }}>
                                {this.state.isFollow ? 'Unfollow' : 'Follow'}
                            </Text>
                        </TouchableOpacity>
                        <Image
                            source={require('../../assets/images/insta.png')}
                            style={{ width: 30.0, height: 30.0, }}
                            resizeMode="contain"
                        />
                    </View>
                    <Text style={{ marginTop: Sizes.fixPadding + 5.0, ...Fonts.whiteColor16Bold }}>
                        Bollywood Actress
                    </Text>
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


            </View >
        )
    }

    menu() {
        return (
            <Menu
                visible={this.state.showOptions}
                style={{ paddingTop: Sizes.fixPadding, paddingHorizontal: Sizes.fixPadding }}
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
                {this.menuItems({ option: 'Report' })}
                {this.menuItems({ option: 'Block' })}
            </Menu>
        )
    }

    menuItems({ option }) {
        return (
            <Text style={{ marginRight: Sizes.fixPadding * 2.5, marginVertical: Sizes.fixPadding + 2.0, ...Fonts.blackColor14Bold }}>
                {option}
            </Text>
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
    followButtonStyle: {
        borderColor: Colors.primaryColor,
        borderWidth: 2.0,
        borderRadius: Sizes.fixPadding - 5.0,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: Sizes.fixPadding - 3.0,
        width: 110.0,
        marginHorizontal: Sizes.fixPadding + 5.0,
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
    messageButtonStyle: {
        backgroundColor: Colors.primaryColor,
        borderColor: Colors.primaryColor,
        borderWidth: 2.0,
        borderRadius: Sizes.fixPadding - 5.0,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: Sizes.fixPadding - 3.0,
        width: 110.0,
    },
});

VideoMakerProfileScreen.navigationOptions = () => {
    return {
        header: () => null
    }
}

export default withNavigation(VideoMakerProfileScreen);
