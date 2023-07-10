import React, { useEffect, useContext, useState, useRef } from "react";
import { connect } from "react-redux";
import { useNavigation } from "@react-navigation/core";
import {
  getFollowingFeeds,
  moreFollowingFeeds,
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
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { IPerformer } from "src/interfaces";
import HeaderMenu from "components/tab/HeaderMenu";
import CustomHeader from "components/uis/CustomHeader";
import GestureRecognizer from "react-native-swipe-gestures";
let deviceH = Dimensions.get("screen").height;
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
const FollowPost = ({
  handleGetFeeds,
  feedState,
  handleGetMore,
  current,
}: IProps): React.ReactElement => {
  const navigation = useNavigation() as any;
  const [tab, setTab] = useState("video");
  const [itemPerPage, setitemPerPage] = useState(12);
  const [feedPage, setfeedPage] = useState(0);
  const [orientation, setOrientation] = useState("");
  const [keyword, setKeyword] = useState("");
  const mediaRefs = useRef([]) as any;
  const insets = useSafeAreaInsets();

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
    getFeeds();
  }, [useContext]);
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
  const loadmoreFeeds = async () => {
    const { total: totalFeeds } = feedState;
    try {
      if ((feedPage + 1) * itemPerPage >= totalFeeds) {
        resetloadFeeds();
      } else {
        setfeedPage(feedPage + 1);
        handleGetMore({
          q: keyword,
          orientation,
          limit: itemPerPage,
          offset: itemPerPage * (feedPage + 1),
          isHome: false,
          type: tab === "video" ? "video" : "photo",
          sortBy: "mostViewInCurrentDay",
        });
      }
    } catch (e) {
      Alert.alert("Something went wrong, please try again later");
    }
  };
  const resetloadFeeds = async () => {
    handleGetMore({
      q: keyword,
      orientation,
      limit: itemPerPage,
      offset: 0,
      isHome: false,
      type: tab === "video" ? "video" : "photo",
      sortBy: "mostViewInCurrentDay",
    });
    setfeedPage(1);
  };

  const getFeeds = () => {
    handleGetFeeds({
      q: keyword,
      orientation,
      limit: itemPerPage,
      offset: itemPerPage * feedPage,
      isHome: false,
      type: tab === "video" ? "video" : "photo",
      sortBy: "mostViewInCurrentDay",
    });
  };

  const onSwipeLeft = (gestureState) => {
    handleTabChange("photo");
  };

  const onSwipeRight = (gestureState) => {
    handleTabChange("video");
  };

  const handleTabChange = async (tab) => {
    setTab(tab);
    setfeedPage(0);
  };

  useEffect(() => {
    getFeeds();
  }, [tab]);
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
                  ,
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
            initialNumToRender={0}
            onEndReachedThreshold={0.5}
            maxToRenderPerBatch={2}
            onEndReached={loadmoreFeeds}
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
              title: "Following",
              align: "center",
            }}
            headerStyle={{ color: "white", fontSize: 18 }}
            onTabChange={handleTabChange}
            tab={tab}
            tabs={[
              {
                key: "video",
                title: "Videos",
              },
              { key: "photo", title: "Photos" },
            ]}
          ></CustomHeader>
        </SafeAreaView>
      )}
    </BottomTabBarHeightContext.Consumer>
  );
};
const mapStateToProp = (state: any): any => ({
  ...state.user,
  isLoggedIn: state.auth.loggedIn,
  feedState: { ...state.feed?.followingFeeds },
});
const mapDispatch = {
  handleGetFeeds: getFollowingFeeds,
  handleGetMore: moreFollowingFeeds,
};
export default connect(mapStateToProp, mapDispatch)(FollowPost);
