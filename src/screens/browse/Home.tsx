import React, {
  useEffect,
  useContext,
  useState,
  useRef,
  useCallback,
} from "react";
import { connect } from "react-redux";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
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
import CustomHeader from "components/uis/CustomHeader";
let deviceH = Dimensions.get("screen").height;
let bottomNavBarH = deviceH - height;
interface IProps {
  current: IPerformer;
  isLoggedIn: boolean;
  fcmToken: any;
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
  fcmToken,
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
  const [lastViewableItem, setLastViewableItem] = useState(null) as any;
  const mediaRefs = useRef([]) as any;
  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [useContext]);

  useEffect(() => {
    getFeeds();
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

  useEffect(() => {
    feedState.total !== undefined && loadmoreFeeds();
  }, [isLoadTrendingFeed]);

  // useEffect(() => {
  //   feedState.success && !feedState.items.length && feedState.total !== undefined && loadmoreFeeds();
  // }, [feedState]);

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

  const getFeeds = () => {
    handleGetRecommendFeeds({
      list: 3,
      q: keyword,
      orientation,
      limit: itemPerPage,
      offset: itemPerPage * feedPage,
      type: tab,
    });
  };

  const handleTabChange = async (tab) => {
    setTab(tab);
    setfeedPage(0);
  };

  const loadmoreFeeds = async () => {
    const { total: totalFeeds } = feedState;
    try {
      if (isLoadTrendingFeed) {
        return loadmoreTrendingFeeds();
      }
      if ((feedPage + 1) * itemPerPage >= totalFeeds) {
        setfeedPage(0);
        setLoadTrendingFeed(true);
        return;
      }
      if (!isLoadTrendingFeed) {
        handleGetMoreRecommendFeeds({
          list: 3,
          q: keyword,
          orientation,
          limit: itemPerPage,
          offset: itemPerPage * (feedPage + 1),
          type: tab,
        });
        setfeedPage(feedPage + 1);
      }
    } catch (e) {
      Alert.alert("Something went wrong, please try again later");
    }
  };

  const loadmoreTrendingFeeds = async () => {
    const { items: recommendFeeds } = feedRecommendState;
    const { total: totalFeeds } = feedState;
    if (feedPage * itemPerPage >= totalFeeds) {
      setLoadTrendingFeed(true);
      setfeedPage(0);
      return;
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
                key={item._id}
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
            data={feedState?.items}
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
          <CustomHeader
            header={{
              title: "Home",
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
      )}
    </BottomTabBarHeightContext.Consumer>
  );
};

const mapStateToProp = (state: any): any => ({
  ...state.user,
  isLoggedIn: state.auth.loggedIn,
  fcmToken: state.auth.fcmToken,
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
