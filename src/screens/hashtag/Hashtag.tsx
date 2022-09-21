import React, { useEffect, useContext, useState, useRef } from 'react';
import { useNavigation } from '@react-navigation/core';
import { feedService } from 'services/feed.service';
import {
  Dimensions,
  FlatList,
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
import FeedTab from 'components/tab/FeedTab';
import { IPerformer } from 'src/interfaces';
let deviceH = Dimensions.get('screen').height;
let bottomNavBarH = deviceH - height;
interface IProps {
  current: IPerformer;
  isLoggedIn: boolean;
  route: {
    params: { query: string, currentTab: string }
  }
}
const Hashtag = ({ current, isLoggedIn, route }: IProps): React.ReactElement => {
  const navigation = useNavigation() as any;
  const [tab, setTab] = useState(route.params.currentTab)
  const [itemPerPage, setitemPerPage] = useState(12);
  const [feedPage, setfeedPage] = useState(0);
  const [keyword, setKeyword] = useState('');
  const mediaRefs = useRef([]) as any;
  const [feeds, setfeeds] = useState([] as Array<IFeed>);
  const [trendingfeeds, settrendingfeeds] = useState([] as Array<IFeed>);
  useEffect(() => {
    navigation.setOptions({ headerShown: false });
    loadfeeds();
  }, []);
  const loadfeeds = async () => {
    const { data } = await feedService.userSearch({
      q: route.params.query ? route.params.query : keyword,
      limit: itemPerPage,
      offset: itemPerPage * feedPage,
      isHome: false,
      type: (tab === 'video') ? 'video' : 'photo'
    });
    setfeeds(feeds.concat(data.data));
    settrendingfeeds(feeds.concat(data.data));
  };
  const loadmoreFeeds = async () => {
    setfeedPage(feedPage + 1)
    const { data } = await feedService.userSearch({
      q: route.params.query ? route.params.query : keyword,
      limit: itemPerPage,
      offset: itemPerPage * feedPage,
      isHome: false,
      type: (tab === 'video') ? 'video' : 'photo',

    });
    setfeeds(feeds.concat(data.data))
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
    setfeedPage(0)
  }
  const renderItem = ({ item, index }: { item: IFeed; index: number }) => {
    return (
      <BottomTabBarHeightContext.Consumer>
        {(tabBarHeight: any) => {
          return (
            <View
              style={[
                {
                  height: Platform.OS === 'ios'
                    ? deviceH - (getStatusBarHeight(true))
                    : deviceH - (bottomNavBarH)
                },
                ,
                index % 2 == 0 ? { backgroundColor: '#000000' } : { backgroundColor: '#000000' }
              ]}>
              <FeedCard feed={item} mediaRefs={mediaRefs} currentTab={tab} current={current} />
            </View>
          );
        }}
      </BottomTabBarHeightContext.Consumer>
    );
  };

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
                ? deviceH - getStatusBarHeight(true)
                : deviceH - bottomNavBarH
            }
            viewabilityConfig={{
              itemVisiblePercentThreshold: 100
            }}
            snapToAlignment={'start'}
          />
          <FeedTab onTabChange={handleTabChange} tab={tab}></FeedTab>
        </SafeAreaView>
      )}
    </BottomTabBarHeightContext.Consumer>
  );
};
export default Hashtag;
