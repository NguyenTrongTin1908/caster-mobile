import { APIRequest } from './api-request';

export class FollowService extends APIRequest {
  searchFollower(query?: { [key: string]: any }) {
    return this.get(this.buildUrl('/follow/search/follower', query));
  }
  searchFollowing(query?: { [key: string]: any }) {
    return this.get(this.buildUrl('/follow/search/following', query));
  }

  create(payload: any) {
    return this.post('/follow', payload);
  }

  delete(performerId: string) {
    return this.del(`/follow/${performerId}`);
  }
}

export const followService = new FollowService();
