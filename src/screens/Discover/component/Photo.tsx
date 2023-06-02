import React, { useEffect, useState } from "react";
import { View, SafeAreaView, TouchableOpacity, Alert } from "react-native";
import {
  getTrendingFeeds,
  getFeeds,
  moreFeeds,
  moreTrendingFeeds,
  resetFeeds,
} from "services/redux/feed/actions";
import { Box, Image, ScrollView, Text } from "native-base";
import { IPerformer } from "interfaces/performer";
import styles from "../style";
import Carousel from "react-native-snap-carousel";
import { Dimensions } from "react-native";
import { connect } from "react-redux";
import { colors } from "utils/theme";
import { useIsFocused } from "@react-navigation/native";
import { IFeed } from "src/interfaces";
const { width } = Dimensions.get("window");
import { feedService } from "services/feed.service";

interface IProps {
  performer: IPerformer;
  getTrendingFeeds: Function;
  getFeeds: Function;
  moreFeeds: Function;
  moreTrendingFeeds: Function;
  handleGetFeeds: Function;
  currentUser: IPerformer;
  feedState: any;
  resetFeeds: Function;
  feedTrendingState: any;
}

const Photo = ({
  getTrendingFeeds: handleGetTrendingFeeds,
  moreFeeds: handleGetMore,
  getFeeds: handleGetFeed,
  feedTrendingState,
  feedState,
  moreTrendingFeeds: handleMoreTrendingFeed,
  resetFeeds: handleResetFeeds,
}: IProps): React.ReactElement => {
  const [loading, setLoading] = useState(true);
  const [moreable, setMoreable] = useState(true);
  const [trendingMoreable, setTrendingMoreable] = useState(true);
  const [feeds, setfeeds] = useState([] as Array<IFeed>);
  const [feedTrending, setfeedTrending] = useState([] as Array<IFeed>);
  const [itemPerPage] = useState(12);
  const [hashtagPerPage] = useState(4);
  const [feedPage, setFeedPage] = useState(0);
  const [hashTagPage, setHashTagPage] = useState(0);
  const [trendingPage, setTrendingPage] = useState(0);
  const [viewIndex, setViewIndex] = useState(0);
  const [trendingIndex, setTrendingIndex] = useState(0);
  const [hashTagTrendingPost, setHashTagTrendingPost] = useState([] as any);
  const [moreTrending, setMoreTrending] = useState(false);

  const [keyword] = useState("");
  const [feedFilter] = useState({
    sortBy: "currentMonthViews",
  });
  const isFocused = useIsFocused();

  const loadFeed = async (more = false, refresh = false) => {
    if (more && !moreable) return;
    setLoading(true);
    const newPage = more ? feedPage + 1 : feedPage;
    setFeedPage(refresh ? 0 : newPage);
    const { data } = await feedService.userSearch({
      limit: itemPerPage,
      type: "photo",
      ...feedFilter,
      offset: refresh ? 0 : newPage * itemPerPage,
    });
    if (!refresh && data.length < itemPerPage) {
      setMoreable(false);
    }
    if (refresh && !moreable) {
      setMoreable(true);
    }
    setLoading(false);
    setfeeds(refresh ? data.data : feeds.concat(data.data));
  };

  const loadTrendingFeed = async () => {
    const { data } = await feedService.trendingSearch({
      limit: itemPerPage,
      offset: 0,
      type: "photo",
      sortBy: "mostViewInCurrentDay",
      sort: "desc",
    });
    setLoading(false);
    setfeedTrending(data.data);
  };

  const loadMoreTrendingData = async (more = false, refresh = false) => {
    if (more && !trendingMoreable) return;
    setLoading(true);
    const newPage = more && moreTrending ? trendingPage + 1 : trendingPage;
    setTrendingPage(refresh ? 0 : newPage);
    console.log("Data : ", newPage);
    const { data } = await feedService.userSearch({
      limit: itemPerPage,
      offset: newPage * itemPerPage,
      type: "photo",
      sortBy: "mostViewInCurrentDay",
      sort: "desc",
      excludeIds: feedTrending.map((item) => item._id).join(","),
    });
    !moreTrending && setMoreTrending(true);
    if (!refresh && data.length < itemPerPage) {
      setTrendingMoreable(false);
    }
    if (refresh && !trendingMoreable) {
      setTrendingMoreable(true);
    }
    setLoading(false);
    setfeedTrending(refresh ? data.data : feedTrending.concat(data.data));
  };

  const loadHashtag = async () => {
    try {
      setLoading(true);
      const resp = await feedService.getTrendingHashtag("photo", {
        limit: hashtagPerPage,
        offset: hashTagPage * hashtagPerPage,
      });
      if (resp.data.length) {
        const hashTag = await resp.data.reduce(async (lp, item) => {
          const results = await lp;
          const respPost = await feedService.userSearch({
            q: item.hashTag,
            limit: itemPerPage,
            offset: itemPerPage * feedPage,
            type: "photo",
            sortBy: "mostViewInCurrentDay",
            sort: "desc",
          });
          results.push({ hashtag: item.hashTag, data: respPost.data.data });
          return results;
        }, []);
        await setHashTagTrendingPost(hashTag);
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      Alert.alert("Error occured, please try again later");
    }
  };

  // const handleFeedChange = async (index, type) => {
  //   const { items: feeds = [], requesting: loadingFeed } = feedState;
  //   const { items: feedTrending = [], requesting: loadingTrendingFeed } =
  //     feedTrendingState;
  //   switch (type) {
  //     case "mostView": {
  //       setMostViewIndex(index);
  //       if (totalSlideMostView + index >= feeds.length && !loadingFeed) {
  //         loadMoreFeed();
  //         setTotalSlideMostView(totalSlideMostView + index);
  //       }
  //       break;
  //     }
  //     case "Trending": {
  //       setTrendingViewIndex(index);
  //       if (
  //         totalSlideTrending + index >= feedTrending.length &&
  //         !loadingTrendingFeed
  //       ) {
  //         getMoreTrendingData();
  //         setTotalSlideTrending(totalSlideTrending + index);
  //       }
  //       break;
  //     }
  //     default:
  //       break;
  //   }
  // };

  useEffect(() => {
    const fetchData = async () => {
      setFeedPage(0);
      setTrendingPage(0);
      setTrendingIndex(0);
      setViewIndex(0);
      setHashTagPage(0);
      loadFeed();
      loadTrendingFeed();
      loadHashtag();
    };
    fetchData();
    console.log("FOCUS");
    return () => {
      handleResetFeeds();
    };
  }, [isFocused]);

  // const { items: feeds = [] } = feedState;
  // const { items: feedTrending = [] } = feedTrendingState;
  console.log("VOO PHOTO :", trendingIndex);
  console.log("feedState :", feedTrending.length);

  const _renderItem = ({ item, index }) => {
    return (
      <TouchableOpacity>
        <View style={styles.carouselItem} key={item._id}>
          <Image
            alt={"item-carousel"}
            key={item._id}
            fallbackSource={require("../../../assets/no-image.jpg")}
            style={styles.carouselImage}
            source={
              item?.files[0]
                ? { uri: item?.files[0].url }
                : require("../../../assets/avatar-default.png")
            }
          />
        </View>
      </TouchableOpacity>
    );
  };
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Box flex={1} mx="auto" w="100%">
        <ScrollView my={2}>
          {feeds.length > 0 && (
            <>
              <View style={styles.range}>
                <Text style={{ fontSize: 22 }} color={colors.lightText}>
                  Most Viewed This Month
                </Text>
              </View>
              <Carousel
                loop={false}
                layout={"default"}
                data={feeds}
                sliderWidth={width}
                itemWidth={200}
                renderItem={_renderItem}
                onSnapToItem={(index) => setViewIndex(index)}
                onEndReached={() => loadFeed(true, false)}
              />
            </>
          )}
          {feedTrending.length > 0 && (
            <>
              <View style={styles.range}>
                <Text style={{ fontSize: 20 }} color={colors.lightText}>
                  Trending
                </Text>
              </View>
              <Carousel
                loop={false}
                layout={"default"}
                data={feedTrending}
                sliderWidth={width}
                itemWidth={150}
                renderItem={_renderItem}
                onSnapToItem={(index) => setTrendingIndex(index)}
                onEndReached={() => loadMoreTrendingData(true, false)}
              />
            </>
          )}
          {/* <>
            <Carousel
              layout={"default"}
              data={performers}
              sliderWidth={width}
              itemWidth={100}
              renderItem={_renderItem}
              onSnapToItem={(index) => setActiveIndex(index)}
            />
          </> */}
        </ScrollView>
      </Box>
    </SafeAreaView>
  );
};

const mapStateToProp = (state: any) => ({
  user: state.user.current,
  feedState: { ...state.feed.feeds },
  feedTrendingState: { ...state.feed.trendingFeeds },
  settings: { ...state.settings },
});

const mapDispatch = {
  moreTrendingFeeds,
  getTrendingFeeds,
  getFeeds,
  moreFeeds,
  resetFeeds,
};

export default connect(mapStateToProp, mapDispatch)(Photo);
