import { APIRequest } from "./api-request";
import { IApiResponse } from "src/interfaces";

export class PerformerService extends APIRequest {
  search(query?: { [key: string]: any }) {
    return this.get(this.buildUrl("/performers/user/search", query)).then(
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
    return this.get("/performers/total-online");
  }

  getAvatarUploadUrl() {
    return `/performers/avatar/upload`;
  }

  getCoverUploadUrl() {
    return `/performers/cover/upload`;
  }

  getVideoUploadUrl() {
    return `/performers/welcome-video/upload`;
  }

  getDocumentUploadUrl() {
    return `/performers/documents/upload`;
  }

  updateMe(id: string, payload: any) {
    return this.put(`/performers/${id}`, payload);
  }

  getTopPerformer(query?: { [key: string]: any }) {
    return this.get(this.buildUrl("/performers/top", query));
  }

  updateBanking(id: string, payload) {
    return this.put(`/performers/${id}/banking-settings`, payload);
  }

  updatePaymentGateway(id, payload) {
    return this.put(`/performers/${id}/payment-gateway-settings`, payload);
  }

  getBookmarked(payload) {
    return this.get(this.buildUrl("/reactions/performers/bookmark", payload));
  }
  updateNotificationSetting(id: string, payload: any) {
    return this.put(`/performers/${id}/notification-settings`, payload);
  }
  findOne(id: string, headers?: { [key: string]: string }) {
    return this.get(`/performers/${id}`, headers);
  }
}

export const performerService = new PerformerService();
