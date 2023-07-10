import React, { useEffect, useContext, useState, useRef } from "react";
import { useNavigation } from "@react-navigation/core";
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
import { IPerformer } from "src/interfaces";
import HeaderMenu from "components/tab/HeaderMenu";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import CustomHeader from "components/uis/CustomHeader";
import GestureRecognizer from "react-native-swipe-gestures";

let deviceH = Dimensions.get("screen").height;
let bottomNavBarH = deviceH - height;
interface IProps {
  current: IPerformer;
  isLoggedIn: boolean;
  route: {
    params: { query: string; currentTab: string };
  };
}
const Hashtag = ({
  current,
  isLoggedIn,
  route,
}: IProps): React.ReactElement => {
  const navigation = useNavigation() as any;
  const [tab, setTab] = useState(route.params?.currentTab || "video");
  const [title, setTitle] = useState(route.params?.query || "Hashtag");
  const [itemPerPage, setitemPerPage] = useState(12);
  const [feedPage, setfeedPage] = useState(0);
  const [keyword, setKeyword] = useState("");
  const mediaRefs = useRef([]) as any;
  const [feeds, setfeeds] = useState([] as Array<IFeed>);
  const [trendingfeeds, settrendingfeeds] = useState([] as Array<IFeed>);
  const insets = useSafeAreaInsets();

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
      type: tab === "video" ? "video" : "photo",
    });
    setfeeds(feeds.concat(data.data));
  };
  const loadmoreFeeds = async () => {
    setfeedPage(feedPage + 1);
    const { data } = await feedService.userSearch({
      q: route.params.query ? route.params.query : keyword,
      limit: itemPerPage,
      offset: itemPerPage * feedPage,
      isHome: false,
      type: tab === "video" ? "video" : "photo",
    });
    setfeeds(feeds.concat(data.data));
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
          cell.setStatus(true);
        } else {
          cell.setStatus(false);
        }
      }
    });
  }) as any;
  const handleTabChange = async (tab) => {
    setTab(tab);
    setfeeds([]);
    setfeedPage(0);
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
          <GestureRecognizer
            onSwipeLeft={(state) => onSwipeLeft(state)}
            onSwipeRight={(state) => onSwipeRight(state)}
            style={{
              flex: 1,
            }}
          >
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
                title: `#${title}`,
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
          </GestureRecognizer>
        </SafeAreaView>
      )}
    </BottomTabBarHeightContext.Consumer>
  );
};
export default Hashtag;
