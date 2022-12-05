/* eslint-disable no-param-reassign */
import { merge } from "lodash";
import { createReducers } from "lib/redux";
// import { onFollow } from 'redux/performer/actions';
import {
  getFeeds,
  getFeedsSuccess,
  getFeedsFail,
  moreFeeds,
  moreFeedsFail,
  moreFeedsSuccess,
  removeFeedSuccess,
  getFollowingFeeds,
  getFollowingFeedsSuccess,
  getFollowingFeedsFail,
  moreFollowingFeeds,
  moreFollowingFeedsSuccess,
  moreFollowingFeedsFail,
  getTrendingFeeds,
  getTrendingFeedsSuccess,
  getTrendingFeedsFail,
  getRecommendFeeds,
  getRecommendFeedsSuccess,
  getRecommendFeedsFail,
  moreRecommendFeeds,
  moreRecommendFeedsSuccess,
  moreRecommendFeedsFail,
  moreTrendingFeeds,
  moreTrendingFeedsSuccess,
  moreTrendingFeedsFail,
} from "./actions";

const initialState = {
  feeds: {
    requesting: false,
    error: null,
    data: null,
    success: false,
  },

  followingFeeds: {
    requesting: false,
    error: null,
    data: null,
    success: false,
  },
  trendingFeeds: {
    requesting: false,
    error: null,
    data: null,
    success: false,
  },
  recommendFeeds: {
    requesting: false,
    error: null,
    data: null,
    success: false,
  },
};

const feedReducers = [
  {
    on: getFeeds,
    reducer(prevState: any) {
      return {
        ...prevState,
        feeds: {
          ...initialState.feeds,
          requesting: true,
        },
      };
    },
  },
  {
    on: getFeedsSuccess,
    reducer(prevState: any, data: any) {
      return {
        ...prevState,
        feeds: {
          ...prevState.feeds,
          requesting: false,
          items: data.payload.data,
          total: data.payload.total,
          success: true,
        },
      };
    },
  },
  {
    on: getFeedsFail,
    reducer(prevState: any, data: any) {
      return {
        ...prevState,
        feeds: {
          ...prevState.feeds,
          requesting: false,
          error: data.payload,
        },
      };
    },
  },
  {
    on: moreFeeds,
    reducer(prevState: any) {
      return {
        ...prevState,
        feeds: {
          ...prevState.feeds,
          requesting: true,
          error: null,
          success: false,
        },
      };
    },
  },
  {
    on: moreFeedsSuccess,
    reducer(prevState: any, data: any) {
      return {
        ...prevState,
        feeds: {
          ...prevState.feeds,
          requesting: false,
          total: data.payload.total,
          items: [...prevState.feeds.items, ...data.payload.data],
          success: true,
        },
      };
    },
  },
  {
    on: moreFeedsFail,
    reducer(prevState: any, data: any) {
      return {
        ...prevState,
        feeds: {
          ...prevState.feeds,
          requesting: false,
          error: data.payload,
          success: false,
        },
      };
    },
  },
  {
    on: getFollowingFeeds,
    reducer(prevState: any) {
      return {
        ...prevState,
        followingFeeds: {
          ...initialState.followingFeeds,
          requesting: true,
        },
      };
    },
  },
  {
    on: getFollowingFeedsSuccess,
    reducer(prevState: any, data: any) {
      return {
        ...prevState,
        followingFeeds: {
          ...prevState.followingFeeds,
          requesting: false,
          items: data.payload.data,
          total: data.payload.total,
          success: true,
        },
      };
    },
  },
  {
    on: getFollowingFeedsFail,
    reducer(prevState: any, data: any) {
      return {
        ...prevState,
        followingFeeds: {
          ...prevState.followingFeeds,
          requesting: false,
          error: data.payload,
        },
      };
    },
  },
  {
    on: moreFollowingFeeds,
    reducer(prevState: any) {
      return {
        ...prevState,
        followingFeeds: {
          ...prevState.followingFeeds,
          requesting: true,
          error: null,
          success: false,
        },
      };
    },
  },
  {
    on: moreFollowingFeedsSuccess,
    reducer(prevState: any, data: any) {
      return {
        ...prevState,
        followingFeeds: {
          ...prevState.followingFeeds,
          requesting: false,
          total: data.payload.total,
          items: [...prevState.followingFeeds.items, ...data.payload.data],
          success: true,
        },
      };
    },
  },
  {
    on: moreFollowingFeedsFail,
    reducer(prevState: any, data: any) {
      return {
        ...prevState,
        followingFeeds: {
          ...prevState.followingFeeds,
          requesting: false,
          error: data.payload,
          success: false,
        },
      };
    },
  },
  {
    on: moreRecommendFeeds,
    reducer(prevState: any) {
      return {
        ...prevState,
        recommendFeeds: {
          ...prevState.recommendFeeds,
          requesting: true,
          error: null,
          success: false,
        },
      };
    },
  },
  {
    on: moreRecommendFeedsSuccess,
    reducer(prevState: any, data: any) {
      return {
        ...prevState,
        recommendFeeds: {
          ...prevState.recommendFeeds,
          requesting: false,
          total: data.payload.total,
          items: [...prevState.recommendFeeds.items, ...data.payload.data],
          success: true,
        },
      };
    },
  },
  {
    on: moreRecommendFeedsFail,
    reducer(prevState: any, data: any) {
      return {
        ...prevState,
        recommendFeeds: {
          ...prevState.recommendFeeds,
          requesting: false,
          error: data.payload,
          success: false,
        },
      };
    },
  },
  {
    on: getTrendingFeeds,
    reducer(prevState: any) {
      return {
        ...prevState,
        trendingFeeds: {
          ...initialState.trendingFeeds,
          requesting: true,
        },
      };
    },
  },
  {
    on: getTrendingFeedsSuccess,
    reducer(prevState: any, data: any) {
      return {
        ...prevState,
        trendingFeeds: {
          ...prevState.trendingFeeds,
          requesting: false,
          items: data.payload.data,
          total: data.payload.total,
          success: true,
        },
      };
    },
  },
  {
    on: getTrendingFeedsFail,
    reducer(prevState: any, data: any) {
      return {
        ...prevState,
        trendingFeeds: {
          ...prevState.trendingFeeds,
          requesting: false,
          error: data.payload,
        },
      };
    },
  },
  {
    on: getRecommendFeeds,
    reducer(prevState: any) {
      return {
        ...prevState,
        recommendFeeds: {
          ...initialState.recommendFeeds,
          requesting: true,
        },
      };
    },
  },
  {
    on: getRecommendFeedsSuccess,
    reducer(prevState: any, data: any) {
      return {
        ...prevState,
        recommendFeeds: {
          ...prevState.recommendFeeds,
          requesting: false,
          items: data.payload.data,
          total: data.payload.total,
          success: true,
        },
      };
    },
  },
  {
    on: getRecommendFeedsFail,
    reducer(prevState: any, data: any) {
      return {
        ...prevState,
        recommendFeeds: {
          ...prevState.recommendFeeds,
          requesting: false,
          error: data.payload,
        },
      };
    },
  },
  {
    on: moreTrendingFeeds,
    reducer(prevState: any) {
      return {
        ...prevState,
        trendingFeeds: {
          ...prevState.trendingFeeds,
          requesting: true,
          error: null,
          success: false,
        },
      };
    },
  },
  {
    on: moreTrendingFeedsSuccess,
    reducer(prevState: any, data: any) {
      return {
        ...prevState,
        trendingFeeds: {
          ...prevState.trendingFeeds,
          requesting: false,
          total: data.payload.total,
          items: [...prevState.trendingFeeds.items, ...data.payload.data],
          success: true,
        },
      };
    },
  },
  {
    on: moreTrendingFeedsFail,
    reducer(prevState: any, data: any) {
      return {
        ...prevState,
        followingFeeds: {
          ...prevState.trendingFeeds,
          requesting: false,
          error: data.payload,
          success: false,
        },
      };
    },
  },

  {
    on: removeFeedSuccess,
    reducer(prevState: any, data: any) {
      const { feed } = data.payload;
      const { items } = prevState.feeds || [];
      items.splice(
        items.findIndex((f) => f._id === feed._id),
        1
      );
      return {
        ...prevState,
        feeds: {
          total: prevState.total - 1,
          items,
        },
      };
    },
  },
];

export default merge({}, createReducers("feed", [feedReducers], initialState));
