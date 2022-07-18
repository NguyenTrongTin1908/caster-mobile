import React from "react";
import { Component } from "react";
import { BackHandler, SafeAreaView, Dimensions, StatusBar, StyleSheet, FlatList, Image, Text, TouchableOpacity, View } from "react-native";
import { withNavigation } from "react-navigation";
import { Colors, Fonts, Sizes } from "../../constants/styles";
import { MaterialIcons, } from '@expo/vector-icons';
import { NavigationEvents } from 'react-navigation';

const { width } = Dimensions.get('window');

const notificationsList = [
    {
        id: '1',
        profileImageOfOther: require('../../assets/images/user_profile/user_1.jpg'),
        nameOfOther: 'Robert Junior',
        isLiked: true,
        timeOfResponse: '7m ago',
        post: require('../../assets/images/dance/dance_1.jpg'),
    },
    {
        id: '2',
        profileImageOfOther: require('../../assets/images/user_profile/user_2.jpg'),
        nameOfOther: 'Don Hart',
        isLiked: true,
        timeOfResponse: '7m ago',
        post: require('../../assets/images/dance/dance_2.jpg'),
    },
    {
        id: '3',
        profileImageOfOther: require('../../assets/images/user_profile/user_3.jpg'),
        nameOfOther: 'Emili Williamson',
        isLiked: false,
        timeOfResponse: '8m ago',
        post: require('../../assets/images/dance/dance_3.jpg'),
    },
    {
        id: '4',
        profileImageOfOther: require('../../assets/images/user_profile/user_4.jpg'),
        nameOfOther: 'Ema Waston',
        isLiked: false,
        timeOfResponse: '9m ago',
        post: require('../../assets/images/dance/dance_4.jpg'),
    },
    {
        id: '5',
        profileImageOfOther: require('../../assets/images/user_profile/user_5.jpg'),
        nameOfOther: 'Rosy Gold',
        isLiked: true,
        timeOfResponse: '11m ago',
        post: require('../../assets/images/dance/dance_1.jpg'),
    },
    {
        id: '6',
        profileImageOfOther: require('../../assets/images/user_profile/user_1.jpg'),
        nameOfOther: 'Robert Junior',
        isLiked: false,
        timeOfResponse: '13m ago',
        post: require('../../assets/images/dance/dance_6.jpg'),
    },
    {
        id: '7',
        profileImageOfOther: require('../../assets/images/user_profile/user_3.jpg'),
        nameOfOther: 'Emili Williamson',
        isLiked: true,
        timeOfResponse: '15m ago',
        post: require('../../assets/images/dance/dance_3.jpg'),
    },
    {
        id: '8',
        profileImageOfOther: require('../../assets/images/user_profile/user_4.jpg'),
        nameOfOther: 'Ema Waston',
        isLiked: true,
        timeOfResponse: '16m ago',
        post: require('../../assets/images/dance/dance_4.jpg'),
    }
];

const messagesList = [
    {
        id: '1',
        profileImageOfSender: require('../../assets/images/user_profile/user_3.jpg'),
        nameOfSender: 'Ellison Perry',
        lastMessage: 'Hey, How are you?',
        receiveTime: '1d ago',
        isReadable: true,
    },
    {
        id: '2',
        profileImageOfSender: require('../../assets/images/user_profile/user_1.jpg'),
        nameOfSender: 'Mark Perry',
        lastMessage: 'You\'re so funny',
        receiveTime: '2d ago',
    },
    {
        id: '3',
        profileImageOfSender: require('../../assets/images/user_profile/user_2.jpg'),
        nameOfSender: 'Robert Junior',
        lastMessage: 'Hello beautiful',
        receiveTime: '2d ago',
    },
    {
        id: '4',
        profileImageOfSender: require('../../assets/images/user_profile/user_4.jpg'),
        nameOfSender: 'Emma Waston',
        lastMessage: 'I miss you very badly',
        receiveTime: '3d ago',
        isReadable: true,
    },
    {
        id: '5',
        profileImageOfSender: require('../../assets/images/user_profile/user_5.jpg'),
        nameOfSender: 'Emily Hemsworth',
        lastMessage: 'Can we meet today?',
        receiveTime: '6d ago',
    },
    {
        id: '6',
        profileImageOfSender: require('../../assets/images/user_profile/user_6.jpg'),
        nameOfSender: 'Rocky Waton',
        lastMessage: 'Hi sweatheart',
        receiveTime: '1w ago',
    },
    {
        id: '7',
        profileImageOfSender: require('../../assets/images/user_profile/user_6.jpg'),
        nameOfSender: 'Cris Maxwell',
        lastMessage: 'How are you today?',
        receiveTime: '1w ago',
    },
    {
        id: '8',
        profileImageOfSender: require('../../assets/images/user_profile/user_6.jpg'),
        nameOfSender: 'David Lynn',
        lastMessage: 'Oh my god!',
        receiveTime: '2w ago',
        isReadable: true,
    }
];

class NotificationsScreen extends Component {

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
        notificationsSelected: true
    }

    render() {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: Colors.backColor }}>
                <StatusBar translucent={false} backgroundColor={Colors.blackColor} />
                <NavigationEvents onDidFocus={() => {
                    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton.bind(this));
                }} />
                <View style={{ flex: 1 }}>
                    {this.header()}
                    {
                        this.state.notificationsSelected
                            ?
                            this.notifications()
                            :
                            this.messages()
                    }
                </View>
            </SafeAreaView>
        )
    }

    messages() {

        const renderItem = ({ item }) => (
            <View>
                <View style={{ backgroundColor: 'rgba(255,255,255,0.1)', height: 1.0, }} />
                <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={() => this.props.navigation.push('Messages')}
                    style={styles.notificationWrapStyle}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Image
                            source={item.profileImageOfSender}
                            style={{ width: 40.0, height: 40.0, borderRadius: 20.0, }}
                        />
                        <View style={{ maxWidth: width - 130, marginHorizontal: Sizes.fixPadding, }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Text numberOfLines={1} style={{ ...Fonts.whiteColor14Bold }}>
                                    {item.nameOfSender}
                                </Text>
                                {
                                    item.isReadable
                                        ?
                                        <View style={styles.messageIsReadableIndicatorStyle} />
                                        :
                                        null
                                }
                            </View>
                            <Text
                                numberOfLines={1}
                                style={{ marginTop: Sizes.fixPadding - 7.0, ...Fonts.lightGrayColor13Regular }}
                            >
                                {item.lastMessage}
                            </Text>
                        </View>
                    </View>
                    <Text style={{ ...Fonts.lightGrayColor13Regular }}>
                        {item.receiveTime}
                    </Text>
                </TouchableOpacity>
            </View>
        )

        return (
            <FlatList
                data={messagesList}
                keyExtractor={(item) => `${item.id}`}
                renderItem={renderItem}
                showsVerticalScrollIndicator={false}
            />
        )
    }

    notifications() {

        const renderItem = ({ item }) => (
            <View>
                <View style={{ backgroundColor: 'rgba(255,255,255,0.1)', height: 1.0, }} />
                <View style={styles.notificationWrapStyle}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Image
                            source={item.profileImageOfOther}
                            style={{ width: 40.0, height: 40.0, borderRadius: 20.0, }}
                        />
                        <View style={{ marginHorizontal: Sizes.fixPadding, }}>
                            <Text style={{ ...Fonts.whiteColor14Bold }}>
                                {item.nameOfOther}
                            </Text>
                            <Text style={{ marginTop: Sizes.fixPadding - 7.0, ...Fonts.lightGrayColor13Regular }}>
                                {item.isLiked ? 'liked' : 'commented'} your video.  {item.timeOfResponse}
                            </Text>
                        </View>
                    </View>
                    <View>
                        <Image
                            source={item.post}
                            style={{ width: 40.0, height: 50.0, borderRadius: Sizes.fixPadding - 5.0, }}
                        />
                        <View style={styles.likeOrCommentIconWrapStyle}>
                            <MaterialIcons
                                name={item.isLiked ? "favorite" : 'mode-comment'}
                                color={Colors.whiteColor}
                                size={13}
                            />
                        </View>
                    </View>
                </View>
            </View>
        )
        return (
            <FlatList
                data={notificationsList}
                keyExtractor={(item) => `${item.id}`}
                renderItem={renderItem}
                showsVerticalScrollIndicator={false}
            />
        )
    }

    header() {
        return (
            <View style={{
                marginVertical: Sizes.fixPadding + 10.0,
                flexDirection: 'row',
                alignItems: 'center',
            }}>
                <Text
                    onPress={() => this.setState({ notificationsSelected: true })}
                    style={{
                        marginHorizontal: Sizes.fixPadding,
                        ...this.state.notificationsSelected ? { ...Fonts.whiteColor18Bold } : { ...Fonts.grayColor16Regular }
                    }}
                >
                    Notifications
                </Text>
                <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={() => this.setState({ notificationsSelected: false })}
                >
                    <Text style={{
                        marginHorizontal: Sizes.fixPadding,
                        ...this.state.notificationsSelected ? { ...Fonts.grayColor16Regular } : { ...Fonts.whiteColor18Bold }
                    }}>
                        Messages
                    </Text>
                    {
                        this.state.notificationsSelected
                            ?
                            <View style={styles.messagesComesIndicatorStyle} />
                            :
                            null
                    }
                </TouchableOpacity>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    notificationWrapStyle: {
        marginHorizontal: Sizes.fixPadding,
        marginVertical: Sizes.fixPadding + 7.0,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    likeOrCommentIconWrapStyle: {
        width: 20.0,
        height: 20.0,
        borderRadius: 10.0,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.yellowColor,
        position: 'absolute',
        bottom: 0.0,
        left: -10.0,
    },
    messageIsReadableIndicatorStyle: {
        marginLeft: Sizes.fixPadding - 3.0,
        backgroundColor: Colors.yellowColor,
        width: 7.0,
        height: 7.0,
        borderRadius: 3.5,
    },
    messagesComesIndicatorStyle: {
        width: 7.0,
        height: 7.0,
        borderRadius: 3.5,
        backgroundColor: Colors.yellowColor,
        position: 'absolute',
        top: 0.0,
        right: 0.0,
    }

});

NotificationsScreen.navigationOptions = () => {
    return {
        header: () => null
    }
}

export default withNavigation(NotificationsScreen);
