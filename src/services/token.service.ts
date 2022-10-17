import { APIRequest } from './api-request';

export class TokenService extends APIRequest {
  public sendPaidToken(conversationId: string) {
    return this.post(`/token-transactions/pay-token/${conversationId}`);
  }
}

export const tokenService = new TokenService();
