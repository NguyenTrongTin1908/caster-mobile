import React, { useEffect, useContext, useState, useRef } from 'react';
import { connect } from 'react-redux';
import { useNavigation } from '@react-navigation/core';
import { IUser } from 'interfaces/user';
import { colors, Fonts, Sizes } from 'utils/theme';
import {
  Animated,
  BackHandler,
  Dimensions,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  FlatList,
  Easing,
  View,
  Image,
  Text
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
const { width, height } = Dimensions.get('window');
// import Video from 'react-native-video';
import styles from './style';
import FeedCard from 'components/feed/feed-card';

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
  const mediaRefs = useRef([]) as any;

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [useContext]);

  const onViewableItemsChange = useRef(({ changed }) => {
    changed.forEach(element => {
      console.log(element.key, element.isViewable);
      const cell = mediaRefs.current[element.key];
      if (cell) {
        if (element.isViewable) {
          cell.play();
        } else {
          cell.pause();
        }
      }
    });
  }) as any;

  const renderItem = ({ item, index }) => {
    const spinValue = new Animated.Value(0);
    Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 4000,
        easing: Easing.linear,
        useNativeDriver: true
      })
    ).start();
    const spin = spinValue.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '360deg']
    });
    return (
      <View
        style={[
          { flex: 1, height: height - 79 },
          index % 2 == 0 ? { backgroundColor: 'blue' } : { backgroundColor: 'pink' }
        ]}>
        <FeedCard url={item.videoUrl} ref={FeedRef => (mediaRefs.current[item.id] = FeedRef)} />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={posts}
        renderItem={renderItem}
        pagingEnabled={true}
        keyExtractor={item => item.id}
        decelerationRate={'fast'}
        showsVerticalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChange.current}
        windowSize={4}
        initialNumToRender={0}
        maxToRenderPerBatch={2}
        removeClippedSubviews
        viewabilityConfig={{
          itemVisiblePercentThreshold: 100
        }}
      />
    </View>
  );
};

const mapStateToProp = (state: any): any => ({
  ...state.user,
  isLoggedIn: state.auth.loggedIn
});
const mapDispatch = {};
export default connect(mapStateToProp, mapDispatch)(Home);
