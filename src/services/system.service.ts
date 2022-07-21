import { APIRequest } from './api-request';

class SystemService extends APIRequest {
  getConfig() {
    return this.get('/settings/public');
  }

  inviteFriend(data: { email: string }) {
    return this.post('/newsletter/invite-friend', data);
  }
}

export const systemService = new SystemService();
