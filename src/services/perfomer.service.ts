import { APIRequest } from './api-request';
import { IApiResponse } from 'src/interfaces';

export class PerformerService extends APIRequest {
  search(query?: { [key: string]: any }) {
    return this.get(this.buildUrl('/performers/user/search', query)).then(
      (resp) => resp.data
    );
  }

  details(username: string, headers = {}): Promise<IApiResponse> {
    return this.get(`/performers/${username}/view`, headers);
  }

  requestPrivateChat(performerId: string) {
    return this.post(`/streaming/private-chat/${performerId}`);
  }

  totalOnline() {
    return this.get('/performers/total-online');
  }
}

export const performerService = new PerformerService();
