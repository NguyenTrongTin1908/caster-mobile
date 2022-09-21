import React, { useEffect, useContext, useState, useRef } from 'react';
import { connect } from 'react-redux';
import { useNavigation } from '@react-navigation/core';
import { getFollowingFeeds, moreFollowingFeeds } from 'services/redux/feed/actions';
import { Dimensions, FlatList, View, SafeAreaView, Platform, Alert } from 'react-native';
const { height } = Dimensions.get('window');
import styles from './style';
import FeedCard from 'components/feed/feed-card';
import FeedTab from 'components/tab/FeedTab';
import { IFeed } from 'interfaces/feed';
import { BottomTabBarHeightContext } from '@react-navigation/bottom-tabs';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { IPerformer } from 'src/interfaces';
let deviceH = Dimensions.get('screen').height;
let bottomNavBarH = deviceH - height;
interface IProps {
  current: IPerformer;
  isLoggedIn: boolean;
  handleGetFeeds: Function;
  handleGetMore: Function;
  feedState: {
    requesting: boolean;
    items: IFeed[];
    total: number;
  };
}
const FollowPost = ({ handleGetFeeds, feedState, handleGetMore,current }: IProps): React.ReactElement => {
  const navigation = useNavigation() as any;
  const [tab, setTab] = useState('video')
  const [itemPerPage, setitemPerPage] = useState(12);
  const [feedPage, setfeedPage] = useState(0);
  const [orientation, setOrientation] = useState('');
  const [keyword, setKeyword] = useState('');
  const mediaRefs = useRef([]) as any;
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
  const loadmoreFeeds = async () => {
    const { total: totalFeeds } = feedState;
    try {
      if ((feedPage + 1) * itemPerPage >= totalFeeds) {
        resetloadFeeds();
      } else {
        setfeedPage(feedPage + 1)
        handleGetMore({
          q: keyword,
          orientation,
          limit: itemPerPage,
          offset: itemPerPage * (feedPage + 1),
          isHome: false,
          type: tab === 'video' ? 'video' : 'photo'
        });
      }
    } catch (e) {
      Alert.alert('Something went wrong, please try again later');
    }
  }
  const resetloadFeeds = async () => {
    handleGetMore({
      q: keyword,
      orientation,
      limit: itemPerPage,
      offset: 0,
      isHome: false,
      type: tab === 'video' ? 'video' : 'photo'
    });
    setfeedPage(1)
  }

  const getFeeds = () => {
    handleGetFeeds({
      q: keyword,
      orientation,
      limit: itemPerPage,
      offset: itemPerPage * feedPage,
      isHome: false,
      type: tab === 'video' ? 'video' : 'photo'
    });
  };
  const handleTabChange = async () => {
    tab === 'video' ? (
      setTab('photo')
    ) : setTab('video')
    setfeedPage(0)
  }

  useEffect(() => {
    getFeeds()
  }, [tab])
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
              <FeedCard feed={item} mediaRefs={mediaRefs} currentTab={tab} current={current}/>
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
            windowSize={4}
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
          <FeedTab onTabChange={handleTabChange} tab={tab}></FeedTab>
        </SafeAreaView>
      )}
    </BottomTabBarHeightContext.Consumer>
  );
};
const mapStateToProp = (state: any): any => ({
  ...state.user,
  isLoggedIn: state.auth.loggedIn,
  feedState: { ...state.feed?.followingFeeds }
});
const mapDispatch = {
  handleGetFeeds: getFollowingFeeds,
  handleGetMore: moreFollowingFeeds,
};
export default connect(mapStateToProp, mapDispatch)(FollowPost);
