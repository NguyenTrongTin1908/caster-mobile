import React from "react";
import { Component } from "react";
import { BackHandler, SafeAreaView, Animated, Easing, Image, FlatList, Dimensions, StatusBar, TouchableWithoutFeedback, TouchableOpacity, StyleSheet, Text, View } from "react-native";
import { withNavigation } from "react-navigation";
import { Colors, Fonts, Sizes } from "../../constants/styles";
import { Video } from 'expo-av'
import VideoPlayer from 'expo-video-player';
import Carousel from 'react-native-snap-carousel';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { NavigationEvents } from 'react-navigation';

const { width, height } = Dimensions.get('window');

const itemWidth = Math.round(width * 0.78);

const postsList = [
    {
        id: '1',
        videoUrl: require('../../assets/images/vod_1.mp4'),
        profilePicture: require('../../assets/images/spook.png'),
        postLikes: '427.9K',
        isLike: false,
        postComments: '2051',
        postUserName: 'saraalikhan',
        postDescription: 'Eiffel Tower #beautiful',
        postSongName: 'R10 - Oboy',
        postSongImage: require('../../assets/images/oboy.jpg'),
    },
    {
        id: '2',
        videoUrl: require('../../assets/images/vod_1.mp4'),
        profilePicture: require('../../assets/images/spook.png'),
        postLikes: '427.9K',
        isLike: false,
        postComments: '2051',
        postUserName: 'saraalikhan',
        postDescription: 'Eiffel Tower #beautiful',
        postSongName: 'R10 - Oboy',
        postSongImage: require('../../assets/images/oboy.jpg'),
    },
    {
        id: '3',
        videoUrl: require('../../assets/images/vod_1.mp4'),
        profilePicture: require('../../assets/images/spook.png'),
        postLikes: '427.9K',
        isLike: false,
        postComments: '2051',
        postUserName: 'saraalikhan',
        postDescription: 'Eiffel Tower #beautiful',
        postSongName: 'R10 - Oboy',
        postSongImage: require('../../assets/images/oboy.jpg'),
    },
    {
        id: '4',
        videoUrl: require('../../assets/images/vod_1.mp4'),
        profilePicture: require('../../assets/images/spook.png'),
        postLikes: '427.9K',
        isLike: false,
        postComments: '2051',
        postUserName: 'saraalikhan',
        postDescription: 'Eiffel Tower #beautiful',
        postSongName: 'R10 - Oboy',
        postSongImage: require('../../assets/images/oboy.jpg'),
    },
    {
        id: '5',
        videoUrl: require('../../assets/images/vod_1.mp4'),
        profilePicture: require('../../assets/images/spook.png'),
        postLikes: '427.9K',
        isLike: false,
        postComments: '2051',
        postUserName: 'saraalikhan',
        postDescription: 'Eiffel Tower #beautiful',
        postSongName: 'R10 - Oboy',
        postSongImage: require('../../assets/images/oboy.jpg'),
    },
    {
        id: '6',
        videoUrl: require('../../assets/images/vod_1.mp4'),
        profilePicture: require('../../assets/images/spook.png'),
        postLikes: '427.9K',
        isLike: false,
        postComments: '2051',
        postUserName: 'saraalikhan',
        postDescription: 'Eiffel Tower #beautiful',
        postSongName: 'R10 - Oboy',
        postSongImage: require('../../assets/images/oboy.jpg'),
    },
];

const trendyCreatorsList = [
    {
        videoUrl: require('../../assets/images/vod_1.mp4'),
        profilePicture: require('../../assets/images/spook.png'),
        postShortUserName: 'Sara',
        postUserName: 'saraalikhan',
    },
    {
        videoUrl: require('../../assets/images/vod_1.mp4'),
        profilePicture: require('../../assets/images/spook.png'),
        postShortUserName: 'Sara',
        postUserName: 'saraalikhan',
    },
    {
        videoUrl: require('../../assets/images/vod_1.mp4'),
        profilePicture: require('../../assets/images/spook.png'),
        postShortUserName: 'Sara',
        postUserName: 'saraalikhan',
    }
];

class HomeScreen extends Component {

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
        playVideo: true,
        relatedScreen: false,
        trendyCreators: trendyCreatorsList,
        activeSlide: 0,
        posts: postsList,
    }

    spinValue = new Animated.Value(0);

    render() {

        Animated.loop(
            Animated.timing(
                this.spinValue,
                {
                    toValue: 1,
                    duration: 4000,
                    easing: Easing.linear,
                    useNativeDriver: true
                }
            )
        ).start();

        const spin = this.spinValue.interpolate({
            inputRange: [0, 1],
            outputRange: ['0deg', '360deg']
        })

        const renderItem = ({ item }) => (
            <View style={styles.container}>
                <TouchableWithoutFeedback
                    onPress={() => this.setState({ playVideo: !this.state.playVideo })}
                >
                    <View>
                        <VideoPlayer
                            videoProps={{
                                shouldPlay: this.state.playVideo,
                                resizeMode: Video.RESIZE_MODE_STRETCH,
                                source: item.videoUrl,
                                isLooping: true,
                            }}
                            icon={{
                                play: <View></View>,
                                pause: <View />,
                            }}
                            fullscreen={{
                                inFullscreen: true,
                                visible: true,
                            }}
                            style={styles.video}
                            slider={{
                                visible: false,
                            }}
                            timeVisible={false}
                            activityIndicator={() => null}
                        />
                        <View style={styles.uiContainer}>

                            <View style={styles.rightContainer}>

                                <View style={{ marginRight: Sizes.fixPadding - 5.0, marginBottom: Sizes.fixPadding + 14.0, alignItems: 'center' }}>
                                    <TouchableOpacity
                                        activeOpacity={0.9}
                                        onPress={() => this.props.navigation.push('VideoMakerProfile')}
                                    >
                                        <Image
                                            style={styles.profilePicture}
                                            source={item.profilePicture}
                                        />
                                    </TouchableOpacity>
                                    <View style={styles.profilePictureAddButtonWrapStyle}>
                                        <MaterialIcons
                                            name="add"
                                            color={Colors.whiteColor}
                                            size={18}
                                        />
                                    </View>
                                </View>

                                <View style={{ marginRight: Sizes.fixPadding - 5.0, marginVertical: Sizes.fixPadding + 2.0, alignItems: 'center' }}>
                                    <MaterialIcons
                                        name="favorite"
                                        color={item.isLike ? Colors.darkPinkColor : Colors.whiteColor}
                                        size={28}
                                        onPress={() => this.updatePosts({ id: item.id })}
                                    />
                                    <Text style={{ marginTop: Sizes.fixPadding - 7.0, ...Fonts.whiteColor13Regular, }}>
                                        {item.postLikes}
                                    </Text>
                                </View>
                                <View style={{ marginRight: Sizes.fixPadding, marginVertical: Sizes.fixPadding + 2.0, alignItems: 'center' }}>
                                    <MaterialCommunityIcons
                                        name="comment-processing"
                                        color={Colors.whiteColor}
                                        size={28}
                                    />
                                    <Text style={{ marginTop: Sizes.fixPadding - 7.0, ...Fonts.whiteColor13Regular, }}>
                                        {item.postComments}
                                    </Text>
                                </View>
                                <View style={{ marginRight: Sizes.fixPadding, marginTop: Sizes.fixPadding + 2.0, alignItems: 'center' }}>
                                    <MaterialCommunityIcons
                                        name="share"
                                        color={Colors.whiteColor}
                                        size={28}
                                    />
                                    <Text style={{ marginTop: Sizes.fixPadding - 7.0, ...Fonts.whiteColor13Regular, }}>
                                        Share
                                    </Text>
                                </View>
                            </View>

                            <View style={styles.bottomContainer}>
                                <View>
                                    <Text style={{ ...Fonts.whiteColor15Regular }}>
                                        @{item.postUserName}
                                    </Text>
                                    <Text style={{ marginTop: Sizes.fixPadding, ...Fonts.whiteColor15Regular }}>
                                        {item.postDescription}
                                    </Text>
                                    <Text style={{ marginBottom: Sizes.fixPadding, ...Fonts.whiteColor13Regular }}>
                                        See the translation
                                    </Text>

                                    <View style={styles.songRow}>
                                        <MaterialIcons name='music-note' size={15} color="white" />
                                        <Text style={{ ...Fonts.whiteColor16Regular }}>
                                            {item.postSongName}
                                        </Text>
                                    </View>
                                </View>

                                <View style={styles.postSongImageWrapStyle}>
                                    <Animated.Image
                                        style={{
                                            width: 27.0,
                                            height: 27.0,
                                            borderRadius: 13.5,
                                            transform: [{ rotate: spin }]
                                        }}
                                        source={item.postSongImage}
                                    />
                                </View>
                            </View>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </View>
        )
        return (
            <SafeAreaView style={{ flex: 1, }}>
                <NavigationEvents onDidFocus={() => {
                    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton.bind(this));
                }} />
                <StatusBar translucent={false} backgroundColor={Colors.blackColor} />
                {
                    this.state.relatedScreen
                        ?
                        this.relatedInfo()
                        :
                        <FlatList
                            data={this.state.posts}
                            keyExtractor={(item) => `${item.id}`}
                            renderItem={renderItem}
                            showsVerticalScrollIndicator={false}
                            snapToInterval={Dimensions.get('window').height - 60}
                            snapToAlignment={'start'}
                            decelerationRate={'fast'}
                        />
                }
                <View style={styles.relatedAndForYouInfoWrapStyle}>
                    <Text
                        onPress={() => this.setState({ relatedScreen: true })}
                        style={this.state.relatedScreen ? { ...Fonts.whiteColor18Bold } : { ...Fonts.whiteColor17SemiBold }}
                    >
                        Related
                    </Text>
                    <View style={{
                        marginHorizontal: Sizes.fixPadding + 5.0,
                        height: 5.0,
                        width: 1.0,
                        backgroundColor: Colors.whiteColor
                    }} />
                    <Text
                        onPress={() => this.setState({ relatedScreen: false })}
                        style={this.state.relatedScreen ? { ...Fonts.whiteColor17SemiBold } : { ...Fonts.whiteColor18Bold }}
                    >
                        For You
                    </Text>
                </View>
            </SafeAreaView>
        )
    }

    updatePosts({ id }) {
        const newList = this.state.posts.map((item) => {
            if (item.id === id) {
                const updatedItem = { ...item, isLike: !item.isLike };
                return updatedItem;
            }
            return item;
        });
        this.setState({ posts: newList })
    }

    relatedInfo() {

        const renderItem = ({ item }) => (
            <View activeOpacity={0.9}>
                <View style={styles.relatedInfoWrapStyle}>
                    <VideoPlayer
                        videoProps={{
                            shouldPlay: true,
                            resizeMode: Video.RESIZE_MODE_STRETCH,
                            source: item.videoUrl,
                            isLooping: true,
                        }}
                        icon={{
                            play: <View></View>,
                            pause: <View />,
                        }}
                        style={{ width: width - 100, height: 390, }}
                        slider={{
                            visible: false,
                        }}
                        timeVisible={false}
                        activityIndicator={() => null}
                    />
                    <MaterialIcons
                        name="close"
                        color={Colors.whiteColor}
                        style={{ position: 'absolute', right: 5.0, top: 5.0, }}
                        size={18}
                    />
                    <View style={{
                        position: 'absolute',
                        bottom: 0.0,
                        alignItems: 'center',
                    }}>
                        <Image
                            source={item.profilePicture}
                            style={{
                                width: 60.0,
                                height: 60.0,
                                borderRadius: 30.0,
                            }}
                        />
                        <Text style={{ marginTop: Sizes.fixPadding - 5.0, ...Fonts.whiteColor15Regular }}>
                            Sara
                        </Text>
                        <Text style={{ marginTop: Sizes.fixPadding - 5.0, marginBottom: Sizes.fixPadding - 5.0, ...Fonts.whiteColor14Regular }}>
                            @saraalikhan
                        </Text>
                        <View style={styles.followButtonWrapStyle}>
                            <Text style={{ ...Fonts.whiteColor16Regular }}>
                                Follow
                            </Text>
                        </View>
                    </View>
                </View>
            </View>
        )

        return (
            <View style={{
                justifyContent: 'center',
                flex: 1,
                backgroundColor: Colors.blackColor
            }}>
                <View>
                    <Text style={{ textAlign: 'center', ...Fonts.whiteColor21SemiBold }}>
                        Trendy creators
                    </Text>
                    <Text style={{ marginTop: Sizes.fixPadding, marginBottom: Sizes.fixPadding + 10.0, textAlign: 'center', ...Fonts.grayColor14Regular }}>
                        {`Follow to an account to discover its\nLatest videos here.`}
                    </Text>
                </View>
                <View>
                    <Carousel
                        ref={ref => this.carousel = ref}
                        data={this.state.trendyCreators}
                        sliderWidth={width}
                        itemWidth={itemWidth}
                        renderItem={renderItem}
                        lockScrollWhileSnapping={true}
                        showsHorizontalScrollIndicator={false}
                        onSnapToItem={(index) => this.setState({ activeSlide: index })}
                    />
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: height - 60,
    },
    videPlayButton: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        zIndex: 100,
    },
    video: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        zIndex: 100,
    },
    uiContainer: {
        position: 'absolute',
        bottom: 60.0,
        left: 0.0,
        right: 0.0,
        height: height,
        justifyContent: 'flex-end',
    },
    bottomContainer: {
        paddingHorizontal: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        paddingBottom: Sizes.fixPadding * 3.0,
    },
    songRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    rightContainer: {
        alignSelf: 'flex-end',
        height: 270,
        justifyContent: 'space-between',
        marginRight: 5,
    },
    profilePicture: {
        width: 50,
        height: 50,
        borderRadius: 25,
        borderWidth: 2,
        borderColor: '#fff',
    },
    iconContainer: {
        alignItems: 'center',
    },
    profilePictureAddButtonWrapStyle: {
        position: 'absolute',
        bottom: -10.0,
        width: 20.0, height: 20.0,
        borderRadius: 10.0,
        backgroundColor: Colors.darkPinkColor,
        alignItems: 'center',
        justifyContent: 'center',
    },
    postSongImageWrapStyle: {
        marginRight: Sizes.fixPadding - 5.0,
        backgroundColor: '#222222',
        width: 45.0, height: 45.0,
        borderRadius: 22.5,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'flex-end',
        marginBottom: Sizes.fixPadding - 30.0,
    },
    relatedAndForYouInfoWrapStyle: {
        position: 'absolute',
        top: 20.0,
        left: 0.0,
        right: 0.0,
        backgroundColor: 'transparent',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    followButtonWrapStyle: {
        marginBottom: Sizes.fixPadding + 5.0,
        backgroundColor: Colors.darkPinkColor,
        borderRadius: Sizes.fixPadding - 5.0,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: Sizes.fixPadding + 5.0,
        paddingHorizontal: Sizes.fixPadding * 8.0,
    },
    relatedInfoWrapStyle: {
        width: width - 100,
        height: 390,
        borderRadius: Sizes.fixPadding,
        alignItems: 'center',
        overflow: 'hidden'
    }
});

HomeScreen.navigationOptions = () => {
    return {
        header: () => null
    }
}

export default withNavigation(HomeScreen);
