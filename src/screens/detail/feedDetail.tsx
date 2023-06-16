import React, { useEffect, useState, useRef } from "react";
import {
  SafeAreaView,
  FlatList,
  Dimensions,
  View,
  Platform,
} from "react-native";
import styles from "./style";
import { IFeed } from "interfaces/feed";
import { feedService } from "services/feed.service";
import { performerService } from "services/perfomer.service";
const { height } = Dimensions.get("window");
import FeedCard from "components/feed/feed-card";
import { useSafeAreaInsets } from "react-native-safe-area-context";
let deviceH = Dimensions.get("screen").height;
let bottomNavBarH = deviceH - height;
import FeedTab from "components/tab/FeedTab";
import { connect } from "react-redux";
import { IPerformer } from "src/interfaces";
import HeaderMenu from "components/tab/HeaderMenu";
import CustomHeader from "components/uis/CustomHeader";
import GestureRecognizer from "react-native-swipe-gestures";
import { BottomTabBarHeightContext } from "@react-navigation/bottom-tabs";
import { getStatusBarHeight } from "react-native-status-bar-height";

interface IProps {
  route: {
    params: {
      performerId: any;
      type: string;
    };
  };
  current: IPerformer;
}
const FeedDetail = ({ route, current }: IProps): React.ReactElement => {
  const [tab, setTab] = useState(route.params.type);
  const [itemPerPage, setitemPerPage] = useState(12);
  const [feedPage, setfeedPage] = useState(0);
  const [feeds, setfeeds] = useState([] as Array<IFeed>);
  const [page, setPage] = useState(0);
  const [perfomer, setPerformer] = useState({} as IPerformer);
  const mediaRefs = useRef([]) as any;
  const insets = useSafeAreaInsets();

  const loadPerformer = async () => {
    const { performerId } = route.params;
    const { data } = await performerService.findOne(performerId);
    setPerformer(data);
  };

  const loadFeeds = async (more = false, q = "", refresh = false) => {
    const newPage = more ? page + 1 : page;
    setPage(refresh ? 0 : newPage);
    const query = {
      limit: itemPerPage,
      offset: itemPerPage * feedPage,
      performerId: route.params.performerId,
    };
    const { data } =
      tab === "video"
        ? await feedService.userSearch({
            ...query,
            type: "video",
          })
        : await feedService.userSearch({
            ...query,
            type: "photo",
          });
    setfeeds(data.data);
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
    loadPerformer();
  }, [tab]);
  return (
    <BottomTabBarHeightContext.Consumer>
      {(tabBarHeight: any) => (
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
              title: "",
              align: "center",
              showAvatar: true,
              avatar: perfomer?.avatar,
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
});
export default connect(mapStateToProp)(FeedDetail);
