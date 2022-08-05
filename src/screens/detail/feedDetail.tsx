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
interface IProps {
  route: {
    params: {
      performerId: any;
    };
  };
}
const FeedDetail = ({ route }: IProps): React.ReactElement => {
  const [videoScreen, setvideoScreen] = useState(true)
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
    const { data } = videoScreen ? await feedService.userSearch({
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
              <FeedCard feed={item} mediaRefs={mediaRefs} />
            </View>
          );
        }}
      </BottomTabBarHeightContext.Consumer>
    );
  };
  useEffect(() => {
    loadfeeds();
  }, [videoScreen]);

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
          <View style={styles.tabViewRelated}>
            <TouchableOpacity onPress={() => setvideoScreen(true)}>
              <Text style={{ color: videoScreen ? colors.lightText : '#979797', fontSize: 18 }}>
                Video
              </Text>
            </TouchableOpacity>
            <View style={{
              marginHorizontal: Sizes.fixPadding + 5.0,
              height: 18.0,
              width: 2.0,
              backgroundColor: colors.lightText
            }} />
            <TouchableOpacity onPress={() => setvideoScreen(false)}>
              <Text style={{ color: videoScreen ? '#979797' : colors.lightText, fontSize: 18 }}>
                Photo
              </Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      )}
    </BottomTabBarHeightContext.Consumer>
  );
}
export default (FeedDetail);
