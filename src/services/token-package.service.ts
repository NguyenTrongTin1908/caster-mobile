import { APIRequest } from './api-request';

class TokenPackageService extends APIRequest {
  search(params?: { [key: string]: string }) {
    return this.get(this.buildUrl('/package/token/search', params)).then(
      (resp) => resp.data
    );
  }

  buyTokens(id: string, data = {}) {
    return this.post(`/payment/purchase-tokens/${id}`, data);
  }
}

export const tokenPackageService = new TokenPackageService();
