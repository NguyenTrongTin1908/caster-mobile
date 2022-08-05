import { APIRequest } from './api-request';

export class FollowService extends APIRequest {
  search(query?: { [key: string]: any }) {
    return this.get(this.buildUrl('/follow/search', query));
  }

  create(payload: any) {
    return this.post('/follow', payload);
  }

  delete(performerId: string) {
    return this.del(`/follow/${performerId}`);
  }
}

export const followService = new FollowService();
