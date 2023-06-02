import { createAction, createAsyncAction } from "lib/redux";

export const { getFeeds, getFeedsSuccess, getFeedsFail } = createAsyncAction(
  "getFeeds",
  "GET_FEEDS"
);

export const { moreFeeds, moreFeedsSuccess, moreFeedsFail } = createAsyncAction(
  "moreFeeds",
  "GET_MODE_FEEDS"
);

export const {
  getFollowingFeeds,
  getFollowingFeedsSuccess,
  getFollowingFeedsFail,
} = createAsyncAction("getFollowingFeeds", "GET_FOLLOWING_FEEDS");

export const {
  moreTrendingFeeds,
  moreTrendingFeedsSuccess,
  moreTrendingFeedsFail,
} = createAsyncAction("moreTrendingFeeds", "GET_MODE_TRENDING_FEEDS");

export const {
  getTrendingFeeds,
  getTrendingFeedsSuccess,
  getTrendingFeedsFail,
} = createAsyncAction("getTrendingFeeds", "GET_TRENDING_FEEDS");

export const {
  getRecommendFeeds,
  getRecommendFeedsSuccess,
  getRecommendFeedsFail,
} = createAsyncAction("getRecommendFeeds", "GET_RECOMMEND_FEEDS");

export const {
  moreRecommendFeeds,
  moreRecommendFeedsSuccess,
  moreRecommendFeedsFail,
} = createAsyncAction("moreRecommendFeeds", "GET_MODE_RECOMMEND_FEEDS");

export const {
  moreFollowingFeeds,
  moreFollowingFeedsSuccess,
  moreFollowingFeedsFail,
} = createAsyncAction("moreFollowingFeeds", "GET_MODE_FOLLOWING_FEEDS");

export const removeFeedSuccess = createAction("removeFeedSuccess");
export const resetFeeds = createAction("resetFeeds");
