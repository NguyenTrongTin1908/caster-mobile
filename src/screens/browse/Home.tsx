import React, { useEffect, useContext, useState, useRef } from 'react';
import { connect } from 'react-redux';
import { useNavigation } from '@react-navigation/core';
import { IUser } from 'interfaces/user';
import { getFeeds, moreFeeds } from 'services/redux/feed/actions';

import { colors, Sizes } from 'utils/theme';
import {
  Animated,
  Dimensions,
  TouchableOpacity,
  FlatList,
  Easing,
  View,
  Image,
  Text,
  TouchableWithoutFeedback,
  SafeAreaView,
  StatusBar,
  Platform,
  NativeModules
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
const { width, height } = Dimensions.get('window');
import styles from './style';
import FeedCard from 'components/feed/feed-card';
import { Button } from 'native-base';
import { IFeed } from 'interfaces/feed';
import { BottomTabBarHeightContext } from '@react-navigation/bottom-tabs';
import { getStatusBarHeight } from 'react-native-status-bar-height';
let deviceH = Dimensions.get('screen').height;
let bottomNavBarH = deviceH - height;
interface IProps {
  current: IUser;
  isLoggedIn: boolean;
  handleGetFeeds: Function;
  handleGetMore: Function;
  feedState: {
    requesting: boolean;
    items: IFeed[];
    total: number;
  };
}
const Home = ({ handleGetFeeds, feedState }: IProps): React.ReactElement => {
  const navigation = useNavigation() as any;
  const [itemPerPage, setitemPerPage] = useState(12);
  const [feedPage, setfeedPage] = useState(0);
  const [orientation, setOrientation] = useState('');
  const [keyword, setKeyword] = useState('');
  const mediaRefs = useRef([]) as any;
  const spinValue = new Animated.Value(0);
  useEffect(() => {
    navigation.setOptions({ headerShown: false });
    getFeeds();
  }, [useContext]);

  const onViewableItemsChange = useRef(({ changed }) => {
    changed.forEach(element => {
      const cell = mediaRefs.current[element.key];
      if (cell) {
        if (element.isViewable) {
          cell.setStatus(true);
        } else {
          cell.setStatus(false);
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
  };

  const handleRedirect = () => {
    navigation.navigate('LiveNow');
  };
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

  const renderItem = ({ item, index }: { item: IFeed; index: number }) => {
    return (
      <BottomTabBarHeightContext.Consumer>
        {(tabBarHeight: any) => {
          return (
            <View
              style={[
                {
                  height:
                    Platform.OS === 'ios'
                      ? deviceH - (tabBarHeight + getStatusBarHeight(true))
                      : deviceH - (bottomNavBarH + tabBarHeight)
                },
                index % 2 == 0 ? { backgroundColor: '#000000' } : { backgroundColor: '#000000' }
              ]}>
              <TouchableWithoutFeedback
                onPress={() =>
                  !mediaRefs.current[item._id].playing
                    ? mediaRefs.current[item._id].play()
                    : mediaRefs.current[item._id].pause()
                }>
                <View style={{ flex: 1 }}>
                  <FeedCard feed={item} ref={FeedRef => (mediaRefs.current[item._id] = FeedRef)} />
                  <View style={styles.uiContainer}>
                    <View style={styles.rightContainer}>
                      <View
                        style={{
                          marginRight: Sizes.fixPadding - 5.0,
                          marginBottom: Sizes.fixPadding + 10.0,
                          alignItems: 'center'
                        }}>
                        <TouchableOpacity activeOpacity={0.9}>
                          <Image
                            style={styles.profilePicture}
                            source={{
                              uri:
                                item?.performer.avatar || Image.resolveAssetSource(require('../../assets/user.png')).uri
                            }}
                          />
                        </TouchableOpacity>
                        <View style={styles.profilePictureAddButtonWrapStyle}>
                          <MaterialIcons name="add" color={colors.lightText} size={18} />
                        </View>
                      </View>
                      <View
                        style={{
                          marginRight: Sizes.fixPadding,
                          marginVertical: Sizes.fixPadding + 2.0,
                          alignItems: 'center'
                        }}>
                        <Button size={44} backgroundColor="orange.400" onPress={handleRedirect}>
                          Live Now
                        </Button>
                      </View>
                      <View
                        style={{
                          marginRight: Sizes.fixPadding,
                          marginTop: Sizes.fixPadding + 2.0,
                          alignItems: 'center'
                        }}>
                        <MaterialIcons name="visibility" color={colors.light} size={28} />
                        <Text style={{ marginTop: Sizes.fixPadding - 7.0, color: colors.lightText }}>
                          {item.stats.views}
                        </Text>
                      </View>
                      <View
                        style={{
                          marginRight: Sizes.fixPadding,
                          marginVertical: Sizes.fixPadding + 2.0,
                          alignItems: 'center'
                        }}>
                        <MaterialCommunityIcons name="comment-processing" color={colors.lightText} size={28} />
                        <Text style={{ marginTop: Sizes.fixPadding - 7.0, color: colors.lightText }}>
                          {item.totalComment}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.bottomContainer}>
                      <View>
                        <Text style={{ color: colors.lightText }}>@{item?.performer.username}</Text>
                        <Text style={{ marginTop: Sizes.fixPadding, color: colors.lightText }}>
                          {item.pollDescription}
                        </Text>
                        <View style={styles.songRow}>
                          <MaterialIcons name="music-note" size={15} color="white" />
                          <Text style={{ color: colors.lightText }}>{item.title || 'No name'}</Text>
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
                          source={{
                            uri: item.performer.avatar || Image.resolveAssetSource(require('../../assets/user.png')).uri
                          }}
                        />
                      </View>
                    </View>
                  </View>
                </View>
              </TouchableWithoutFeedback>
            </View>
          );
        }}
      </BottomTabBarHeightContext.Consumer>
    );
  };

  return (
    <BottomTabBarHeightContext.Consumer>
      {(tabBarHeight: any) => (
        <SafeAreaView style={styles.container}>
          <FlatList
            data={feedState.items}
            renderItem={renderItem}
            pagingEnabled={true}
            keyExtractor={item => item._id}
            decelerationRate={'fast'}
            showsVerticalScrollIndicator={false}
            onViewableItemsChanged={onViewableItemsChange.current}
            windowSize={2}
            initialNumToRender={1}
            maxToRenderPerBatch={2}
            removeClippedSubviews
            snapToInterval={
              Platform.OS === 'ios'
                ? deviceH - (tabBarHeight + getStatusBarHeight(true))
                : deviceH - (bottomNavBarH + tabBarHeight)
            }
            viewabilityConfig={{
              itemVisiblePercentThreshold: 100
            }}
            snapToAlignment={'start'}
          />
        </SafeAreaView>
      )}
    </BottomTabBarHeightContext.Consumer>
  );
};

const mapStateToProp = (state: any): any => ({
  ...state.user,
  isLoggedIn: state.auth.loggedIn,
  feedState: { ...state.feed?.feeds }
});
const mapDispatch = {
  handleGetFeeds: getFeeds,
  handleGetMore: moreFeeds
};
export default connect(mapStateToProp, mapDispatch)(Home);
