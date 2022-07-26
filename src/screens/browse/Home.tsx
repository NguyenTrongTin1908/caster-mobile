import React, { useEffect, useContext, useState, useRef } from 'react';
import { connect } from 'react-redux';
import { useNavigation } from '@react-navigation/core';
import { IUser } from 'interfaces/user';
import { getFeeds, moreFeeds, removeFeedSuccess } from 'services/redux/feed/actions';;

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
import { Button } from 'native-base';
import { navigationRef } from 'src/navigations/RootStackNavigator';

interface IProps {
  current: IUser;
  isLoggedIn: boolean;
  handleGetFeeds: Function;
  handleGetMore: Function;
  feeds: any;
}
const Home = ({ current, handleGetFeeds, handleGetMore, feeds }: IProps): React.ReactElement => {
  const navigation = useNavigation() as any;
  const [itemPerPage, setitemPerPage] = useState(12);
  const [feedPage, setfeedPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [orientation, setOrientation] = useState('');
  const [keyword, setKeyword] = useState('');
  const [currentTab, setcurrentTab] = useState('recommended-videos');


  const mediaRefs = useRef([]) as any;

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
    getFeeds();

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

  const getFeeds = () => {

    handleGetFeeds({
      q: keyword,
      orientation,
      limit: itemPerPage,
      offset: itemPerPage * feedPage,
      isHome: false,
      type: 'video'
    });
  }

  const handleRedirect = () => {
    navigation.navigate('/')
  }



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
        <FeedCard url={item?.files[0]?.url} ref={FeedRef => (mediaRefs.current[item._id] = FeedRef)} />
        <View style={styles.uiContainer}>

          <View style={styles.rightContainer}>

            <View style={{ marginRight: Sizes.fixPadding - 5.0, marginBottom: Sizes.fixPadding + 14.0, alignItems: 'center' }}>
              <TouchableOpacity
                activeOpacity={0.9}
              // onPress={() => this.props.navigation.push('VideoMakerProfile')}
              >
                <Image
                  style={styles.profilePicture}
                  source={item.profilePicture}
                />
              </TouchableOpacity>
              <View style={styles.profilePictureAddButtonWrapStyle}>
                <MaterialIcons
                  name="add"
                  color={colors.light}
                  size={18}
                />
              </View>
            </View>

            <View style={{ marginRight: Sizes.fixPadding - 5.0, marginVertical: Sizes.fixPadding + 2.0, alignItems: 'center' }}>
              {/* <MaterialIcons
                name="favorite"
                color={item.isLike ? colors.dark : colors.light}
                size={28}
              // onPress={() => this.updatePosts({ id: item.id })}
              /> */}
              <Button size={44} backgroundColor='orange.400' onPress={handleRedirect}
              >Live Now</Button>


              <Text style={{ marginTop: Sizes.fixPadding - 7.0 }}>
                {item.postLikes}
              </Text>
            </View>
            <View style={{ marginRight: Sizes.fixPadding, marginVertical: Sizes.fixPadding + 2.0, alignItems: 'center' }}>
              <MaterialIcons
                name="bookmark"
                color={colors.light}
                size={28}
              />
              <Text style={{ marginTop: Sizes.fixPadding - 7.0 }}>
                {item.postComments}
              </Text>
            </View>
            <View style={{ marginRight: Sizes.fixPadding, marginTop: Sizes.fixPadding + 2.0, alignItems: 'center' }}>
              <MaterialIcons
                name="visibility"
                color={colors.light}
                size={28}
              />
              <Text style={{ marginTop: Sizes.fixPadding - 7.0 }}>
                Share
              </Text>
            </View>
          </View>

          <View style={styles.bottomContainer}>

            {/* <View>
              <Text >
                @{item.postUserName}
              </Text>
              <Text style={{ marginTop: Sizes.fixPadding, }}>
                {item.postDescription}
              </Text>
              <Text style={{ marginBottom: Sizes.fixPadding, }}>
                See the translation
              </Text>

              <View style={styles.songRow}>
                <MaterialIcons name='music-note' size={15} color="white" />
                <Text >
                  {item.postSongName}
                </Text>
              </View>
            </View> */}

            <View style={styles.postSongImageWrapStyle}>
              <MaterialCommunityIcons
                name="comment-processing"
                color={colors.light}
                size={28}
              />
            </View>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={feeds.items}
        renderItem={renderItem}
        pagingEnabled={true}
        keyExtractor={item => item._id}
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
  isLoggedIn: state.auth.loggedIn,
  feeds: state.feed?.feeds,

});
const mapDispatch = {

  handleGetFeeds: getFeeds,
  handleGetMore: moreFeeds,

};
export default connect(mapStateToProp, mapDispatch)(Home);
