import React, { useEffect, useState } from "react";
import { View, SafeAreaView, TouchableOpacity, Alert } from "react-native";
import { Box, Image, ScrollView, Text } from "native-base";
import { IPerformer } from "interfaces/performer";
import styles from "../style";
import { feedService } from "services/feed.service";
import Carousel from "react-native-snap-carousel";
import { Dimensions } from "react-native";
import { connect } from "react-redux";
const { width } = Dimensions.get("window");
import {
  getTrendingFeeds,
  getFeeds,
  moreFeeds,
  moreTrendingFeeds,
  resetFeeds,
} from "services/redux/feed/actions";
import { colors } from "utils/theme";
import { useIsFocused } from "@react-navigation/native";
import { IFeed } from "src/interfaces";

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

const Video = ({
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
  const [feeds, setfeeds] = useState([] as Array<IFeed>);
  const [feedTrending, setfeedTrending] = useState([] as Array<IFeed>);
  const [page, setPage] = useState(0);
  const [itemPerPage] = useState(12);
  const [hashtagPerPage] = useState(4);
  const [feedPage, setFeedPage] = useState(0);
  const [hashTagPage, setHashTagPage] = useState(0);
  const [trendingPage, setTrendingPage] = useState(0);
  const [totalSlideMostView, setTotalSlideMostView] = useState(5);
  const [totalSlideTrending, setTotalSlideTrending] = useState(5);
  const [mostViewIndex, setMostViewIndex] = useState(0);
  const [trendingViewIndex, setTrendingViewIndex] = useState(0);
  const [hashTagIndex, setHashTagIndex] = useState({} as any);
  const [hashTagTrendingPost, setHashTagTrendingPost] = useState([] as any);
  const [orientation] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const [keyword] = useState("");
  const [feedFilter] = useState({
    sortBy: "currentMonthViews",
  });
  const isFocused = useIsFocused();
  const loadFeed = async (more = false, refresh = false) => {
    if (more && !moreable) return;
    setLoading(true);
    const newPage = more ? page + 1 : page;
    setPage(refresh ? 0 : newPage);
    const { data } = await feedService.userSearch({
      limit: itemPerPage,
      type: "video",
      ...feedFilter,
      offset: feedPage * itemPerPage,
    });
    if (!refresh && data.length < 100) {
      setMoreable(false);
    }
    if (refresh && !moreable) {
      setMoreable(true);
    }
    setLoading(false);
    setfeeds(refresh ? data.data : feeds.concat(data.data));
  };

  const loadTrendingFeed = async (more = false, refresh = false) => {
    if (more && !moreable) return;
    setLoading(true);
    const newPage = more ? page + 1 : page;
    setPage(refresh ? 0 : newPage);
    const { data } = await feedService.trendingSearch({
      limit: itemPerPage,
      offset: itemPerPage * trendingPage,
      type: "video",
      sortBy: "mostViewInCurrentDay",
      sort: "desc",
    });
    if (!refresh && data.length < 100) {
      setMoreable(false);
    }
    if (refresh && !moreable) {
      setMoreable(true);
    }
    setLoading(false);
    setfeedTrending(refresh ? data.data : feedTrending.concat(data.data));
  };

  const loadHashtag = async () => {
    try {
      setLoading(true);
      const resp = await feedService.getTrendingHashtag("video", {
        limit: hashtagPerPage,
        offset: hashTagPage * hashtagPerPage,
      });
      if (resp.data.length) {
        const hashTag = await resp.data.reduce(async (lp, item) => {
          const results = await lp;
          const respPost = await feedService.userSearch({
            q: item.hashTag,
            orientation,
            limit: itemPerPage,
            offset: itemPerPage * feedPage,
            type: "video",
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

  const loadMoreHashtag = async () => {
    try {
      if (loading) {
        return;
      }
      setLoading(true);
      setHashTagPage(hashTagPage + 1);
      const resp = await feedService.getTrendingHashtag("video", {
        limit: hashtagPerPage,
        offset: (hashTagPage + 1) * hashtagPerPage,
      });
      if (resp.data.length) {
        const hashTag = await resp.data.reduce(async (lp, item) => {
          const results = await lp;
          const respPost = await feedService.userSearch({
            q: item.hashTag,
            orientation,
            limit: itemPerPage,
            offset: itemPerPage * feedPage,
            type: "video",
            sortBy: "mostViewInCurrentDay",
            sort: "desc",
          });
          results.push({ hashtag: item.hashTag, data: respPost.data.data });
          return results;
        }, []);
        hashTagTrendingPost.length > 0 &&
          setHashTagTrendingPost(hashTagTrendingPost.concat(hashTag));
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      Alert.alert("Error occured, please try again later");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setTotalSlideTrending(5);
      setTotalSlideMostView(5);
      setMostViewIndex(0);
      setTrendingViewIndex(0);
      setFeedPage(0);
      setTrendingPage(0);
      setHashTagPage(0);
      loadFeed();
      loadTrendingFeed();
      await loadHashtag();
    };
    fetchData();
    return () => {
      handleResetFeeds();
    };
  }, [isFocused]);

  console.log("VOO Video");

  const _renderItem = ({ item, index }) => {
    return (
      <TouchableOpacity>
        <View style={styles.carouselItem} key={item._id}>
          <Image
            alt={"thumbnail-video"}
            key={item._id}
            style={styles.carouselImage}
            source={
              item?.files[0]
                ? { uri: item?.files[0].thumbnails[0] }
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
                layout={"default"}
                data={feeds}
                sliderWidth={width}
                itemWidth={200}
                renderItem={_renderItem}
                onSnapToItem={(index) => setActiveIndex(index)}
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
                layout={"default"}
                data={feedTrending}
                sliderWidth={width}
                itemWidth={150}
                renderItem={_renderItem}
                onSnapToItem={(index) => setActiveIndex(index)}
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

export default connect(mapStateToProp, mapDispatch)(Video);
