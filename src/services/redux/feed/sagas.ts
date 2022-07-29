import { flatten } from 'lodash';
import { put } from 'redux-saga/effects';
import { createSagas } from 'lib/redux';
import { feedService } from 'services/feed.service';
import { IReduxAction } from 'src/interfaces';
import {
  getFeeds, getFeedsSuccess, getFeedsFail, getFollowingFeeds,
  moreFeeds, moreFeedsSuccess, moreFeedsFail, moreFollowingFeeds,
  getFollowingFeedsSuccess, getTrendingFeedsSuccess,
   moreFollowingFeedsFail, moreFollowingFeedsSuccess, getTrendingFeeds, moreTrendingFeeds, moreTrendingFeedsFail, moreTrendingFeedsSuccess
} from './actions';

const performerSagas = [
  {
    on: getFeeds,
    * worker(data: IReduxAction) {
      try {
        const resp = data.payload.isHome ? yield feedService.userHomeFeeds(data.payload) : yield feedService.userSearch(data.payload);
        yield put(getFeedsSuccess(resp.data));
      } catch (e) {
        const error = yield Promise.resolve(e);
        yield put(getFeedsFail(error));
      }
    }
  },
  {
    on: moreFeeds,
    * worker(data: IReduxAction) {
      try {
        const resp = data.payload.isHome ? yield feedService.userHomeFeeds(data.payload) : yield feedService.userSearch(data.payload);
        yield put(moreFeedsSuccess(resp.data));
      } catch (e) {
        const error = yield Promise.resolve(e);
        yield put(moreFeedsFail(error));
      }
    }
  },
  {
    on: getFollowingFeeds,
    * worker(data: IReduxAction) {
      try {
        const resp = yield feedService.followingSearch(data.payload);
        yield put(getFollowingFeedsSuccess(resp.data));
      } catch (e) {
        const error = yield Promise.resolve(e);
        yield put(moreFollowingFeedsFail(error));
      }
    }
  },
  {
    on: moreFollowingFeeds,
    * worker(data: IReduxAction) {
      try {
        const resp = yield feedService.followingSearch(data.payload);
        yield put(moreFollowingFeedsSuccess(resp.data));
      } catch (e) {
        const error = yield Promise.resolve(e);
        yield put(moreFollowingFeedsFail(error));
      }
    }
  },

  {
    on: getTrendingFeeds,
    * worker(data: IReduxAction) {
      try {
        const resp = yield feedService.trendingSearch(data.payload);
        yield put(getTrendingFeedsSuccess(resp.data));
        // yield put(getFeedsSuccess(resp.data));
      } catch (e) {
        const error = yield Promise.resolve(e);
        yield put(moreTrendingFeedsFail(error));
      }
    }
  },
  {
    on: moreTrendingFeeds,
    * worker(data: IReduxAction) {
      try {
        const resp = yield feedService.userSearch(data.payload);
        yield put(moreTrendingFeedsSuccess(resp.data));
      } catch (e) {
        const error = yield Promise.resolve(e);
        yield put(moreTrendingFeedsFail(error));
      }
    }
  },


];

export default flatten([createSagas(performerSagas)]);
