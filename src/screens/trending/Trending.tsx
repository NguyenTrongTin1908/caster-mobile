import React, { useEffect, useContext, useState, useRef } from 'react';
import { connect } from 'react-redux';
import { useNavigation } from '@react-navigation/core';
import { IUser } from 'interfaces/user';
import { feedService } from 'services/feed.service';
import { getTrendingFeeds, moreFeeds } from 'services/redux/feed/actions';
import {
  Animated,
  Dimensions,
  FlatList,
  Easing,
  View,
  SafeAreaView,
  Platform,
  TouchableOpacity,
  Text,
  Alert,
} from 'react-native';
const { height } = Dimensions.get('window');
import styles from './style';
import FeedCard from 'components/feed/feed-card';
import { IFeed } from 'interfaces/feed';
import { BottomTabBarHeightContext } from '@react-navigation/bottom-tabs';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { Sizes, colors } from 'utils/theme';
let deviceH = Dimensions.get('screen').height;
let bottomNavBarH = deviceH - height;
interface IProps {
  current: IUser;
  isLoggedIn: boolean;

}
const Trending = (): React.ReactElement => {
  const navigation = useNavigation() as any;
  const [tab, setTab] = useState('video')
  const [itemPerPage, setitemPerPage] = useState(12);
  const [feedPage, setfeedPage] = useState(0);
  const [orientation, setOrientation] = useState('');
  const [keyword, setKeyword] = useState('');
  const mediaRefs = useRef([]) as any;
  const [feeds, setfeeds] = useState([] as Array<IFeed>);
  const [trendingfeeds, settrendingfeeds] = useState([] as Array<IFeed>);
  const [feedLoading, setfeedLoading] = useState(true);
  const [page, setPage] = useState(0);
  useEffect(() => {
    navigation.setOptions({ headerShown: false });
    loadfeeds();
  }, [useContext]);
  const loadfeeds = async () => {
    setfeedLoading(true);
    const { data } = await feedService.trendingSearch({
      q: keyword,
      orientation,
      limit: itemPerPage,
      offset: itemPerPage * feedPage,
      isHome: false,
      type: (tab === 'video') ? 'video' : 'photo'
    });
    setfeeds(feeds.concat(data.data));
    settrendingfeeds(feeds.concat(data.data));
    setfeedLoading(false);
  };
  const loadmoreFeeds = async () => {
    setfeedLoading(true);
    setfeedPage(feedPage + 1)
    const { data } = await feedService.userSearch({
      q: keyword,
      orientation,
      limit: itemPerPage,
      offset: itemPerPage * feedPage,
      isHome: false,
      type: (tab === 'video') ? 'video' : 'photo',
      sortBy: 'mostViewInCurrentDay',
      excludeIds: trendingfeeds.map((item) => item._id).join(',')
    });
    console.log('data :', data.data.length);
    (data.data.length == 0) ? resetloadFeeds() :
      setfeeds(feeds.concat(data.data))


  };
  const resetloadFeeds = async () => {
    console.log('vo')
    setfeedLoading(true);
    setfeedPage(feedPage + 1)
    const { data } = await feedService.userSearch({
      q: keyword,
      orientation,
      limit: itemPerPage,
      offset: 0,
      isHome: false,
      type: (tab === 'video') ? 'video' : 'photo',
      sortBy: 'mostViewInCurrentDay',
      excludeIds: trendingfeeds.map((item) => item._id).join(',')
    });
    setfeeds(feeds.concat(data.data));
    setfeedLoading(false);
    setfeedPage(1)
  };

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

  const handleTabChange = async () => {
    tab === 'video' ? (
      setTab('photo')
    ) : setTab('video')
    setfeeds([])
  }
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
  useEffect(() => {

    setfeedPage(0)
  }, [tab])


  useEffect(() => {

    loadfeeds();
  }, [tab])
  return (
    <BottomTabBarHeightContext.Consumer>
      {(tabBarHeight: any) => (
        <SafeAreaView style={styles.container}>
          <FlatList
            data={feeds}
            renderItem={renderItem}
            pagingEnabled={true}
            keyExtractor={item => item._id}
            decelerationRate={'fast'}
            showsVerticalScrollIndicator={false}
            onViewableItemsChanged={onViewableItemsChange.current}
            windowSize={2}
            onEndReached={loadmoreFeeds}
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
          <View style={styles.tabView}>
            <TouchableOpacity onPress={handleTabChange}>
              <Text style={{ color: tab === 'video' ? colors.lightText : '#979797', fontSize: 18 }}>
                Video
              </Text>
            </TouchableOpacity>
            <View style={{
              marginHorizontal: Sizes.fixPadding + 5.0,
              height: 18.0,
              width: 2.0,
              backgroundColor: colors.lightText
            }} />
            <TouchableOpacity onPress={handleTabChange}>
              <Text style={{ color: tab === 'video' ? '#979797' : colors.lightText, fontSize: 18 }}>
                Photo
              </Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      )}
    </BottomTabBarHeightContext.Consumer>
  );
};

export default Trending;
