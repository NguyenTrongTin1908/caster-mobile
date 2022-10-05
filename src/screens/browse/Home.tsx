import React, { useEffect, useContext, useState, useRef } from "react";
import { connect } from "react-redux";
import { useNavigation } from "@react-navigation/core";
import { getFeeds, moreFeeds } from "services/redux/feed/actions";
import {
  getRecommendFeeds,
  moreRecommendFeeds,
  getTrendingFeeds,
} from "services/redux/feed/actions";
import {
  Dimensions,
  FlatList,
  View,
  SafeAreaView,
  Platform,
  Alert,
} from "react-native";
const { height } = Dimensions.get("window");
import styles from "./style";
import FeedCard from "components/feed/feed-card";
import { IFeed } from "interfaces/feed";
import { BottomTabBarHeightContext } from "@react-navigation/bottom-tabs";
import { getStatusBarHeight } from "react-native-status-bar-height";
import FeedTab from "components/tab/FeedTab";
import HeaderMenu from "components/tab/HeaderMenu";
import { IPerformer } from "src/interfaces";
let deviceH = Dimensions.get("screen").height;
let bottomNavBarH = deviceH - height;
interface IProps {
  current: IPerformer;
  isLoggedIn: boolean;
  handleGetFeeds: Function;
  handleGetMore: Function;
  handleGetRecommendFeeds: Function;
  handleGetMoreRecommendFeeds: Function;
  handleGetTrendingFeeds: Function;
  feedState: any;
  feedRecommendState: {
    requesting: boolean;
    items: IFeed[];
    total: number;
  };
}
const Home = ({
  handleGetFeeds,
  feedState,
  handleGetMore,
  current,
  feedRecommendState,
  handleGetRecommendFeeds,
  handleGetMoreRecommendFeeds,
  handleGetTrendingFeeds,
}: IProps): React.ReactElement => {
  const navigation = useNavigation() as any;
  const [tab, setTab] = useState("video");
  const [itemPerPage, setitemPerPage] = useState(12);
  const [feedPage, setfeedPage] = useState(0);
  const [orientation, setOrientation] = useState("");
  const [keyword, setKeyword] = useState("");
  const [isLoadTrendingFeed, setLoadTrendingFeed] = useState(false);
  const mediaRefs = useRef([]) as any;
  useEffect(() => {
    navigation.setOptions({ headerShown: false });
    getFeeds();
  }, [useContext]);
  useEffect(() => {
    getFeeds();
  }, [tab]);
  useEffect(() => {
    feedState.total !== undefined && loadmoreFeeds();
  }, [isLoadTrendingFeed]);
  useEffect(() => {
    feedState.success &&
      !feedState.items.length &&
      feedState.total !== undefined &&
      loadmoreFeeds();
  }, [feedState]);
  const onViewableItemsChange = useRef(({ changed }) => {
    changed.forEach((element) => {
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
  const getFeeds = async () => {
    await handleGetRecommendFeeds({
      list: 3,
      q: keyword,
      orientation,
      limit: itemPerPage,
      offset: itemPerPage * feedPage,
      type: tab === "video" ? "video" : "photo",
    });
  };
  const handleTabChange = async () => {
    tab === "video" ? setTab("photo") : setTab("video");
    setfeedPage(0);
  };

  const loadmoreFeeds = async () => {
    const { total: totalFeeds } = feedState;
    try {
      if ((feedPage + 1) * itemPerPage >= totalFeeds) {
        !isLoadTrendingFeed && setLoadTrendingFeed(true);
        feedPage !== 0 && setfeedPage(0);
        return await loadmoreTrendingFeeds();
      }
      if (isLoadTrendingFeed) {
        return loadmoreTrendingFeeds();
      }

      !isLoadTrendingFeed &&
        (await handleGetMore({
          q: keyword,
          orientation,
          limit: itemPerPage,
          offset: itemPerPage * (feedPage + 1),
          isHome: false,
          type: tab === "video" ? "video" : "photo",
        }));
      setfeedPage(feedPage + 1);
    } catch (e) {
      Alert.alert("Something went wrong, please try again later");
    }
  };
  const loadmoreTrendingFeeds = async () => {
    const { items: recommendFeeds } = feedRecommendState;
    const { total: totalFeeds } = feedState;

    if ((feedPage + 1) * itemPerPage >= totalFeeds) {
      setfeedPage(0);
    }
    try {
      await handleGetMore({
        limit: itemPerPage,
        offset: feedPage * itemPerPage,
        type: tab === "video" ? "video" : "photo",
        sortBy: "mostViewInCurrentDay",
        excludeIds: recommendFeeds.map((item) => item._id).join(","),
      });
      setfeedPage(feedPage + 1);
    } catch (e) {}
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
                    Platform.OS === "ios"
                      ? deviceH - (tabBarHeight + getStatusBarHeight(true))
                      : deviceH - (bottomNavBarH + tabBarHeight),
                },
                index % 2 == 0
                  ? { backgroundColor: "#000000" }
                  : { backgroundColor: "#000000" },
              ]}
            >
              <FeedCard
                feed={item}
                mediaRefs={mediaRefs}
                currentTab={tab}
                current={current}
              />
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
            keyExtractor={(item) => item._id}
            decelerationRate={"fast"}
            showsVerticalScrollIndicator={false}
            onViewableItemsChanged={onViewableItemsChange.current}
            windowSize={2}
            onEndReachedThreshold={0.5}
            onEndReached={loadmoreFeeds}
            initialNumToRender={0}
            maxToRenderPerBatch={2}
            removeClippedSubviews
            snapToInterval={
              Platform.OS === "ios"
                ? deviceH - (tabBarHeight + getStatusBarHeight(true))
                : deviceH - (bottomNavBarH + tabBarHeight)
            }
            viewabilityConfig={{
              itemVisiblePercentThreshold: 100,
            }}
            snapToAlignment={"start"}
          />
          <HeaderMenu />
          <FeedTab onTabChange={handleTabChange} tab={tab}></FeedTab>
        </SafeAreaView>
      )}
    </BottomTabBarHeightContext.Consumer>
  );
};
const mapStateToProp = (state: any): any => ({
  ...state.user,
  isLoggedIn: state.auth.loggedIn,
  feedState: { ...state.feed?.feeds },
  feedRecommendState: { ...state.feed.recommendFeeds },
});
const mapDispatch = {
  handleGetRecommendFeeds: getRecommendFeeds,
  handleGetMoreRecommendFeeds: moreRecommendFeeds,
  handleGetTrendingFeeds: getTrendingFeeds,
  handleGetFeeds: getFeeds,
  handleGetMore: moreFeeds,
};
export default connect(mapStateToProp, mapDispatch)(Home);
