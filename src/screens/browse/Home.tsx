import React, { useEffect, useContext, useState, useRef } from 'react';
import { connect } from 'react-redux';
import { useNavigation } from '@react-navigation/core';
import { IUser } from 'interfaces/user';
import { getFeeds, getFeedsSuccess, moreFeeds } from 'services/redux/feed/actions';
import { Dimensions, FlatList, View, SafeAreaView, Platform, Text, Alert, TouchableOpacity } from 'react-native';
const { height } = Dimensions.get('window');
import styles from './style';
import FeedCard from 'components/feed/feed-card';
import { IFeed } from 'interfaces/feed';
import { BottomTabBarHeightContext } from '@react-navigation/bottom-tabs';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { colors, Sizes } from 'utils/theme'
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
const Home = ({ handleGetFeeds, feedState, handleGetMore }: IProps): React.ReactElement => {
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
          <View style={styles.tabView}>
            <TouchableOpacity onPress={() => setTab('video')}>
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
            <TouchableOpacity onPress={() => setTab('photo')}>
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
