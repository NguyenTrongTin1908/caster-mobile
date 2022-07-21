import React, { useEffect, useContext, useState } from 'react';
import { connect } from 'react-redux';
import { Heading, VStack, ScrollView, View, Image, Text } from 'native-base';
import { useNavigation } from '@react-navigation/core';
import { IUser } from 'interfaces/user';
import { colors, Fonts, Sizes } from 'utils/theme';
import Button from 'components/uis/Button';
import NumberFormat from 'components/uis/NumberFormat';
import DailyQuote from 'components/home/daily-quote';
import ConversationStarters from 'components/home/conversation-starters';
import PicOfTheDay from 'components/home/pic-of-the-day';
import ModelOnline from 'components/home/model-online';
import {
  Animated,
  BackHandler,
  Dimensions,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  FlatList
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
const { width, height } = Dimensions.get('window');
import Video from 'react-native-video';

interface IProps {
  current: IUser;
  isLoggedIn: boolean;
}
const Home = ({ current }: IProps): React.ReactElement => {
  const navigation = useNavigation() as any;
  const postsList = [
    {
      id: '1',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      profilePicture: require('../../assets/spook.png'),
      postLikes: '427.9K',
      isLike: false,
      postComments: '2051',
      postUserName: 'saraalikhan',
      postDescription: 'Eiffel Tower #beautiful',
      postSongName: 'R10 - Oboy aewfaewfawefawe',
      postSongImage: require('../../assets/oboy.jpg')
    },
    {
      id: '2',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      profilePicture: require('../../assets/spook.png'),
      postLikes: '427.9K',
      isLike: false,
      postComments: '2051',
      postUserName: 'saraalikhan',
      postDescription: 'Eiffel Tower #beautiful',
      postSongName: 'R10 - Oboy',
      postSongImage: require('../../assets/oboy.jpg')
    },
    {
      id: '3',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      profilePicture: require('../../assets/spook.png'),
      postLikes: '427.9K',
      isLike: false,
      postComments: '2051',
      postUserName: 'saraalikhan',
      postDescription: 'Eiffel Tower #beautiful',
      postSongName: 'R10 - Oboy',
      postSongImage: require('../../assets/oboy.jpg')
    },
    {
      id: '4',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      profilePicture: require('../../assets/spook.png'),
      postLikes: '427.9K',
      isLike: false,
      postComments: '2051',
      postUserName: 'saraalikhan',
      postDescription: 'Eiffel Tower #beautiful',
      postSongName: 'R10 - Oboy',
      postSongImage: require('../../assets/oboy.jpg')
    },
    {
      id: '5',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      profilePicture: require('../../assets/spook.png'),
      postLikes: '427.9K',
      isLike: false,
      postComments: '2051',
      postUserName: 'saraalikhan',
      postDescription: 'Eiffel Tower #beautiful',
      postSongName: 'R10 - Oboy',
      postSongImage: require('../../assets/oboy.jpg')
    },
    {
      id: '6',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      profilePicture: require('../../assets/spook.png'),
      postLikes: '427.9K',
      isLike: false,
      postComments: '2051',
      postUserName: 'saraalikhan',
      postDescription: 'Eiffel Tower #beautiful',
      postSongName: 'R1232420 - Oboy',
      postSongImage: require('../../assets/oboy.jpg')
    }
  ];

  const [posts] = useState(postsList);

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [useContext]);

  const renderItem = ({ item }) => {
    const spinValue = new Animated.Value(0);
    const spin = spinValue.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '360deg']
    });
    return (
      <View style={styles.container}>
        <TouchableWithoutFeedback onPress={() => null}>
          <View>
            <Video
              source={{ uri: item.videoUrl }} // Can be a URL or a local file.
              style={{ ...styles.video }}
              resizeMode={'stretch'}
              paused={false}
            />
            <View style={styles.uiContainer}>
              <View style={styles.rightContainer}>
                <View
                  style={{
                    marginRight: Sizes.fixPadding - 5.0,
                    marginBottom: Sizes.fixPadding + 14.0,
                    alignItems: 'center'
                  }}>
                  <TouchableOpacity activeOpacity={0.9} onPress={() => null}>
                    <Image style={styles.profilePicture} source={item.profilePicture} alt="a" />
                  </TouchableOpacity>
                  <View style={styles.profilePictureAddButtonWrapStyle}>
                    <MaterialIcons name="add" color={colors.lightText} size={18} />
                  </View>
                </View>

                <View
                  style={{
                    marginRight: Sizes.fixPadding - 5.0,
                    marginVertical: Sizes.fixPadding + 2.0,
                    alignItems: 'center'
                  }}>
                  <MaterialIcons
                    name="favorite"
                    color={item.isLike ? colors.primary : colors.secondary}
                    size={28}
                    onPress={() => null}
                  />
                  <Text style={{ marginTop: Sizes.fixPadding - 7.0 }} color={colors.lightText}>
                    {item.postLikes}
                  </Text>
                </View>
                <View
                  style={{
                    marginRight: Sizes.fixPadding,
                    marginVertical: Sizes.fixPadding + 2.0,
                    alignItems: 'center'
                  }}>
                  <MaterialCommunityIcons name="comment-processing" color={colors.lightText} size={28} />
                  <Text style={{ marginTop: Sizes.fixPadding - 7.0 }} color={colors.lightText}>
                    {item.postComments}
                  </Text>
                </View>
                <View
                  style={{ marginRight: Sizes.fixPadding, marginTop: Sizes.fixPadding + 2.0, alignItems: 'center' }}>
                  <MaterialCommunityIcons name="share" color={colors.lightText} size={28} />
                  <Text style={{ marginTop: Sizes.fixPadding - 7.0 }} color={colors.lightText}>
                    Share
                  </Text>
                </View>
              </View>

              <View style={styles.bottomContainer}>
                <View>
                  <Text style={{}} color={colors.lightText}>
                    @{item.postUserName}
                  </Text>
                  <Text style={{ marginTop: Sizes.fixPadding }} color={colors.lightText}>
                    {item.postDescription}
                  </Text>
                  <Text style={{ marginBottom: Sizes.fixPadding }} color={colors.lightText}>
                    See the translation
                  </Text>

                  <View style={styles.songRow}>
                    <MaterialIcons name="music-note" size={15} color="white" />
                    <Text style={{}} color={colors.lightText}>
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
    );
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar translucent={false} backgroundColor={colors.dark} />
      <FlatList
        data={posts}
        keyExtractor={item => `${item.id}`}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        snapToInterval={Dimensions.get('window').height - 60}
        snapToAlignment={'start'}
        decelerationRate={'fast'}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: height - 60,
    position: 'relative',
    backgroundColor: 'red'
  },
  videPlayButton: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    zIndex: 100
  },
  video: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    zIndex: 100,
    width: width,
    height: height
  },
  uiContainer: {
    position: 'absolute',
    bottom: 60.0,
    left: 0.0,
    right: 0.0,
    height: height,
    justifyContent: 'flex-end'
    // backgroundColor: 'blue'
  },
  bottomContainer: {
    paddingHorizontal: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingBottom: Sizes.fixPadding * 3.0
  },
  songRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  rightContainer: {
    alignSelf: 'flex-end',
    height: 270,
    justifyContent: 'space-between',
    marginRight: 5
  },
  profilePicture: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#fff'
  },
  iconContainer: {
    alignItems: 'center'
  },
  profilePictureAddButtonWrapStyle: {
    position: 'absolute',
    bottom: -10.0,
    width: 20.0,
    height: 20.0,
    borderRadius: 10.0,
    backgroundColor: colors.appBgColor,
    alignItems: 'center',
    justifyContent: 'center'
  },
  postSongImageWrapStyle: {
    marginRight: Sizes.fixPadding - 5.0,
    backgroundColor: '#222222',
    width: 45.0,
    height: 45.0,
    borderRadius: 22.5,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-end',
    marginBottom: Sizes.fixPadding - 30.0
  },
  relatedAndForYouInfoWrapStyle: {
    position: 'absolute',
    top: 20.0,
    left: 0.0,
    right: 0.0,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  followButtonWrapStyle: {
    marginBottom: Sizes.fixPadding + 5.0,
    backgroundColor: colors.btnPrimaryColor,
    borderRadius: Sizes.fixPadding - 5.0,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Sizes.fixPadding + 5.0,
    paddingHorizontal: Sizes.fixPadding * 8.0
  },
  relatedInfoWrapStyle: {
    width: width - 100,
    height: 390,
    borderRadius: Sizes.fixPadding,
    alignItems: 'center',
    overflow: 'hidden'
  }
});

const mapStateToProp = (state: any): any => ({
  ...state.user,
  isLoggedIn: state.auth.loggedIn
});
const mapDispatch = {};
export default connect(mapStateToProp, mapDispatch)(Home);
