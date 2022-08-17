import React, { useEffect, useContext, useState, useRef } from 'react';
import {
  SafeAreaView, FlatList, Dimensions, TouchableOpacity, Text, View, Platform
} from 'react-native';
import styles from './style';
import { Sizes } from "../../constants/styles";
import { IFeed } from 'interfaces/feed';
import { feedService } from 'services/feed.service';
import { colors } from 'utils/theme'
import { BottomTabBarHeightContext } from '@react-navigation/bottom-tabs';
const { height } = Dimensions.get('window');
import { getStatusBarHeight } from 'react-native-status-bar-height';
import FeedCard from 'components/feed/feed-card';
let deviceH = Dimensions.get('screen').height;
let bottomNavBarH = deviceH - height;
import MenuTab from 'components/tab/MenuTab';
import FeedTab from 'components/tab/FeedTab';
interface IProps {
  route: {
    params: {
      performerId: any;
      type: string
    };
  };
}
const FeedDetail = ({ route }: IProps): React.ReactElement => {
  const [tab, setTab] = useState(route.params.type)
  const [itemPerPage, setitemPerPage] = useState(12);
  const [feedPage, setfeedPage] = useState(0);
  const [feeds, setfeeds] = useState([] as Array<IFeed>);
  const [page, setPage] = useState(0);
  const mediaRefs = useRef([]) as any;

  const loadfeeds = async (more = false, q = '', refresh = false) => {
    const newPage = more ? page + 1 : page;
    setPage(refresh ? 0 : newPage);
    const query = {
      limit: itemPerPage,
      offset: itemPerPage * feedPage,
      performerId: route.params.performerId,
    };
    const { data } = tab === 'video' ? await feedService.userSearch({
      ...query,
      type: 'video'
    }) :
      await feedService.userSearch({
        ...query,
        type: 'photo'
      })
    setfeeds(data.data);
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
                index % 2 == 0 ? { backgroundColor: '#000000' } : { backgroundColor: '#000000' }
              ]}>
              <FeedCard feed={item} mediaRefs={mediaRefs} currentTab={tab} />
            </View>
          );
        }}
      </BottomTabBarHeightContext.Consumer>
    );
  };
  useEffect(() => {
    loadfeeds();
  }, [tab]);

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
          <MenuTab></MenuTab>
          <FeedTab onTabChange={handleTabChange} tab={tab}></FeedTab>
        </SafeAreaView>
      )}
    </BottomTabBarHeightContext.Consumer>
  );
}
export default (FeedDetail);
