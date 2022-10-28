import { APIRequest } from './api-request';

export class GiftService extends APIRequest {
  search(query?: { [key: string]: any }) {
    return this.get(this.buildUrl('/gifts/all', query));
  }

  favoriteGift() {
    return this.get(
      this.buildUrl('/gifts/favorite')
    );
  }

  addfavoriteGift(payload: any) {
    return this.post('/gifts/add-to-favorite', payload);
  }
}

export const giftService = new GiftService();
