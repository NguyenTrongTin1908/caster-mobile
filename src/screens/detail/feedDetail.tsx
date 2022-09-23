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
const { height } = Dimensions.get("window");
import FeedCard from "components/feed/feed-card";
import { useSafeAreaInsets } from "react-native-safe-area-context";
let deviceH = Dimensions.get("screen").height;
let bottomNavBarH = deviceH - height;
import FeedTab from "components/tab/FeedTab";
import { connect } from "react-redux";
import { IPerformer } from "src/interfaces";
import HeaderMenu from "components/tab/HeaderMenu";
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
  const mediaRefs = useRef([]) as any;
  const insets = useSafeAreaInsets();

  const loadfeeds = async (more = false, q = "", refresh = false) => {
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
  const handleTabChange = async () => {
    tab === "video" ? setTab("photo") : setTab("video");
    setfeeds([]);
    setfeedPage(0);
  };

  const renderItem = ({ item, index }: { item: IFeed; index: number }) => {
    return (
      <View
        style={[
          {
            height:
              Platform.OS === "ios"
                ? deviceH - (insets.bottom + insets.top)
                : deviceH - bottomNavBarH,
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
    );
  };
  useEffect(() => {
    loadfeeds();
  }, [tab]);
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
        removeClippedSubviews
        snapToInterval={
          Platform.OS === "ios"
            ? deviceH - (insets.bottom + insets.top)
            : deviceH - bottomNavBarH
        }
        viewabilityConfig={{
          itemVisiblePercentThreshold: 100,
        }}
        snapToAlignment={"start"}
      />
      <HeaderMenu />

      <FeedTab onTabChange={handleTabChange} tab={tab}></FeedTab>
    </SafeAreaView>
  );
};

const mapStateToProp = (state: any): any => ({
  ...state.user,
});
export default connect(mapStateToProp)(FeedDetail);
