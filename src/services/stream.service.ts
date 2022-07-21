
import { APIRequest } from './api-request';

class StreamService extends APIRequest {
  requestPrivateChat(performerId: string) {
    return this.post(`/streaming/private-chat/${performerId}`);
  }

  public sendPaidToken(conversationId: string) {
    return this.post(`/member/send-pay-token/${conversationId}`);
  }
}

export const streamService = new StreamService();
