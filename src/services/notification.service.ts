import { APIRequest } from "./api-request";

class NotificationService extends APIRequest {
  public static HOLDER_IDS = [] as any[];

  search(query) {
    return this.get(this.buildUrl("/notification", query));
  }

  countUnread() {
    return this.get("/notification/total-unread");
  }

  readAll() {
    return this.put("/notification/read-all");
  }

  read(id: string) {
    return this.put(`/notification/${id}/read`);
  }

  hasHolderId(id) {
    return NotificationService.HOLDER_IDS.includes(id);
  }

  addHolderId(id) {
    NotificationService.HOLDER_IDS.push(id);
  }
  public async registerToken(data: any) {
    return this.post("/push-notification-devices/register", data);
  }
  public async removeToken(data: any) {
    return this.post("/push-notification-devices/logout-device", data);
  }
}

export const notificationService = new NotificationService();
