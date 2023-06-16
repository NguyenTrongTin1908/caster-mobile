import React, {
  useEffect,
  useContext,
  useState,
  useRef,
  useCallback,
} from "react";
import { useFocusEffect, useNavigation } from "@react-navigation/core";
import { feedService } from "services/feed.service";
import {
  Dimensions,
  FlatList,
  View,
  SafeAreaView,
  Platform,
} from "react-native";
const { height } = Dimensions.get("window");
import styles from "./style";
import FeedCard from "components/feed/feed-card";
import { IFeed } from "interfaces/feed";
import { BottomTabBarHeightContext } from "@react-navigation/bottom-tabs";
import { getStatusBarHeight } from "react-native-status-bar-height";
import FeedTab from "components/tab/FeedTab";
import HeaderMenu from "components/tab/HeaderMenu";
import { connect } from "react-redux";
import { IPerformer } from "src/interfaces";
import CustomHeader from "components/uis/CustomHeader";
import GestureRecognizer from "react-native-swipe-gestures";
import { useSafeAreaInsets } from "react-native-safe-area-context";

let deviceH = Dimensions.get("screen").height;
let bottomNavBarH = deviceH - height;
interface IProps {
  current: IPerformer;
  isLoggedIn: boolean;
}
const Trending = ({ current }: IProps): React.ReactElement => {
  const navigation = useNavigation() as any;
  const [tab, setTab] = useState("video");
  const [itemPerPage, setItemPerPage] = useState(12);
  const [feedPage, setFeedPage] = useState(0);
  const [keyword, setKeyword] = useState("");
  const mediaRefs = useRef([]) as any;
  const [feeds, setFeeds] = useState([] as Array<IFeed>);
  const [trendingFeeds, setTrendingfeeds] = useState([] as Array<IFeed>);
  const [lastViewableItem, setLastViewableItem] = useState(null) as any;
  const insets = useSafeAreaInsets();

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
    loadFeeds();
  }, [useContext]);

  const loadFeeds = async () => {
    const { data } = await feedService.trendingSearch({
      q: keyword,
      limit: itemPerPage,
      offset: itemPerPage * feedPage,
      isHome: true,
      sortBy: "mostViewInCurrentDay",
      type: tab === "video" ? "video" : "photo",
    });
    setFeeds(feeds.concat(data.data));
    setTrendingfeeds(feeds.concat(data.data));
  };

  const loadMoreFeeds = async () => {
    setFeedPage(feedPage + 1);
    const { data } = await feedService.userSearch({
      q: keyword,
      limit: itemPerPage,
      offset: itemPerPage * feedPage,
      isHome: false,
      type: tab === "video" ? "video" : "photo",
      sortBy: "mostViewInCurrentDay",
      excludeIds: trendingFeeds.map((item) => item._id).join(","),
    });
    data.data.length == 0
      ? resetLoadFeeds()
      : setFeeds(feeds.concat(data.data));
  };

  const resetLoadFeeds = async () => {
    setFeedPage(feedPage + 1);
    const { data } = await feedService.userSearch({
      q: keyword,
      limit: itemPerPage,
      offset: 0,
      isHome: false,
      type: tab === "video" ? "video" : "photo",
      sortBy: "mostViewInCurrentDay",
      excludeIds: trendingFeeds.map((item) => item._id).join(","),
    });
    setFeeds(feeds.concat(data.data));
    setFeedPage(1);
  };

  const onSwipeLeft = (gestureState) => {
    handleTabChange("photo");
  };

  const onSwipeRight = (gestureState) => {
    handleTabChange("video");
  };

  const onViewableItemsChange = useRef(({ changed }) => {
    changed.forEach((element) => {
      const cell = mediaRefs.current[element.key];
      if (cell) {
        if (element.isViewable) {
          setLastViewableItem(element);
          cell.setStatus(true);
        } else {
          cell.setStatus(false);
        }
      }
    });
  }) as any;

  const handleTabChange = async (tab) => {
    setTab(tab);
    setFeeds([]);
    setFeedPage(0);
  };
  const renderItem = ({ item, index }: { item: IFeed; index: number }) => {
    return (
      <BottomTabBarHeightContext.Consumer>
        {(tabBarHeight: any) => {
          return (
            <GestureRecognizer
              onSwipeLeft={(state) => onSwipeLeft(state)}
              onSwipeRight={(state) => onSwipeRight(state)}
              style={{
                flex: 1,
              }}
            >
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
            </GestureRecognizer>
          );
        }}
      </BottomTabBarHeightContext.Consumer>
    );
  };

  useEffect(() => {
    loadFeeds();
  }, [tab]);

  const checkBeforeLeaving = (lastViewableItem) => {
    if (lastViewableItem) {
      const cell = mediaRefs.current[lastViewableItem.key];
      if (cell && cell.playing) {
        cell.setStatus(false);
      }
    }
  };

  useFocusEffect(
    useCallback(() => {
      if (lastViewableItem) {
        const cell = mediaRefs.current[lastViewableItem.key];
        if (cell && !cell.playing) {
          cell.setStatus(true);
        }
      }
      return () => checkBeforeLeaving(lastViewableItem);
    }, [lastViewableItem])
  );

  return (
    <BottomTabBarHeightContext.Consumer>
      {(tabBarHeight: any) => {
        return (
          <SafeAreaView style={styles.container}>
            <FlatList
              data={feeds}
              renderItem={renderItem}
              pagingEnabled={true}
              keyExtractor={(item) => item._id}
              decelerationRate={"fast"}
              showsVerticalScrollIndicator={false}
              onViewableItemsChanged={onViewableItemsChange.current}
              windowSize={2}
              initialNumToRender={0}
              maxToRenderPerBatch={2}
              onEndReached={loadMoreFeeds}
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
            <CustomHeader
              header={{
                title: "Trending",
                align: "center",
              }}
              headerStyle={{ color: "white", fontSize: 15 }}
            >
              <FeedTab
                onTabChange={handleTabChange}
                tab={tab}
                tabs={[
                  {
                    key: "video",
                    title: "Videos",
                  },
                  { key: "photo", title: "Photos" },
                ]}
              />
            </CustomHeader>
          </SafeAreaView>
        );
      }}
    </BottomTabBarHeightContext.Consumer>
  );
};
const mapStateToProp = (state: any): any => ({
  ...state.user,
  isLoggedIn: state.auth.loggedIn,
});
export default connect(mapStateToProp)(Trending);
