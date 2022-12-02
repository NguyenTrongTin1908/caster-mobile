import { APIRequest } from "./api-request";

export class MessageService extends APIRequest {
  getConversations(query?: Record<string, any>) {
    return this.get(this.buildUrl("/conversations", query));
  }

  searchConversations(query?: Record<string, any>) {
    return this.get(this.buildUrl("/conversations/search", query));
  }

  createConversation(data: Record<string, string>) {
    return this.post("/conversations", data);
  }

  getConversationDetail(id: string) {
    return this.get(`/conversations/${id}`);
  }

  deleteConversation(id: string) {
    return this.del(`/conversations/${id}`);
  }

  getConversationByStreamId(streamId: string) {
    return this.get(`/conversations/stream/${streamId}`);
  }

  getMessages(conversationId: string, query?: Record<string, any>) {
    return this.get(
      this.buildUrl(`/messages/conversations/${conversationId}`, query)
    );
  }

  getPublicMessages(conversationId: string, query?: Record<string, any>) {
    return this.get(
      this.buildUrl(`/messages/conversations/public/${conversationId}`, query)
    );
  }

  sendMessage(conversationId: string, data: Record<string, any>) {
    return this.post(`/messages/conversations/${conversationId}`, data);
  }

  sendStreamMessage(conversationId: string, data: Record<string, any>) {
    return this.post(`/messages/stream/conversations/${conversationId}`, data);
  }

  sendPublicStreamMessage(conversationId: string, data: Record<string, any>) {
    return this.post(
      `/messages/stream/public/conversations/${conversationId}`,
      data
    );
  }

  findPublicConversationPerformer(performerId: string) {
    return this.get(`/conversations/stream/public/${performerId}`);
  }

  countTotalNotRead() {
    return this.get("/messages/counting-not-read-messages");
  }

  readAllInConversation(conversationId: string) {
    return this.post(`/messages/read-all/${conversationId}`);
  }

  getMessageUploadUrl() {
    return `${process.env.NEXT_PUBLIC_API_ENDPOINT}/messages/private/file`;
  }

  deleteMessage(id) {
    return this.del(`/messages/${id}`);
  }

  deleteAllMessageInConversation(conversationId) {
    return this.del(`/messages/${conversationId}/remove-all-message`);
  }

  sendToken(conversationId: string | number, data: Record<string, any>) {
    return this.post(`/member/send-tip-token/${conversationId}`, data);
  }
}

export const messageService = new MessageService();
