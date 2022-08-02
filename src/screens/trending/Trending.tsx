import React, { useEffect, useContext, useState, useRef } from 'react';
import { connect } from 'react-redux';
import { useNavigation } from '@react-navigation/core';
import { IUser } from 'interfaces/user';
import { getTrendingFeeds, moreTrendingFeeds } from 'services/redux/feed/actions';
import {
  Animated,
  Dimensions,
  FlatList,
  Easing,
  View,
  SafeAreaView,
  Platform,
} from 'react-native';

const { height } = Dimensions.get('window');
import styles from './style';
import FeedCard from 'components/feed/feed-card';
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
const Trending = ({ handleGetFeeds, feedState }: IProps): React.ReactElement => {
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
                ,
                index % 2 == 0 ? { backgroundColor: '#000000' } : { backgroundColor: '#000000' }
              ]}>
              <FeedCard feed={item} mediaRefs={mediaRefs} />

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
            initialNumToRender={0}
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
  feedState: { ...state.feed?.trendingFeeds }
});
const mapDispatch = {
  handleGetFeeds: getTrendingFeeds,
  handleGetMore: moreTrendingFeeds
};
export default connect(mapStateToProp, mapDispatch)(Trending);
