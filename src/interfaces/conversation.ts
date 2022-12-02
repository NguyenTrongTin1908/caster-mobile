import { IUser } from "./user";
import { IPerformer } from "./performer";
export interface IConversation {
  _id: string;
  name?: string;
  performerId: string;
  recipients?: Array<any>;
  streamId: string;
  type: string;
  recipientInfo?: IPerformer;
  totalNotSeenMessages?: number;
  lastSenderId: string;
  lastMessage?: string;
}

export interface IMessage {
  _id: string;
  conversationId: string;
  senderId: string;
  senderInfo?: IPerformer;
  text: string;
  type: string;
  isSystem?: boolean;
}
