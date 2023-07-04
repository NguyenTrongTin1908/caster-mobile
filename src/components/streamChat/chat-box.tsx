import React from "react";
import { View } from "native-base";
import { connect } from "react-redux";
import { IUser } from "src/interfaces";
import {
  getStreamConversation,
  resetStreamMessage,
} from "services/redux/stream-chat/actions";
import styles from "./style";
import MessageList from "./MessageList";

interface IProps {
  resetAllStreamMessage?: Function;
  user?: any;
  activeConversation?: any;
  totalParticipant?: number;
  members?: IUser[];
  loggedIn?: boolean;
  canSendMessage: boolean;
  canSendTip?: boolean;
}
const checkPermission = (performer, conversation) => {
  if (
    performer &&
    conversation &&
    conversation.data &&
    performer._id === conversation.data.performerId
  ) {
    return true;
  }
  return false;
};

const ChatBox = ({
  resetAllStreamMessage,
  user,
  activeConversation,
  loggedIn,
  canSendMessage,
  canSendTip,
}: IProps) => {
  const [canReset, setCanReset] = React.useState(false);

  React.useEffect(() => {
    setCanReset(checkPermission(user, activeConversation));
  }, [user, activeConversation]);

  // const removeAllMessage = async () => {
  //   if (!canReset) {
  //     return;
  //   }
  //   try {
  //     await messageService.deleteAllMessageInConversation(
  //       activeConversation.data._id
  //     );
  //     resetAllStreamMessage &&
  //       resetAllStreamMessage({ conversationId: activeConversation.data._id });
  //   } catch (e) {
  //     const error = await Promise.resolve(e);
  //   }
  // };

  return (
    <View style={styles.chatContainer}>
      {activeConversation &&
        activeConversation.data &&
        activeConversation.data.streamId && (
          <MessageList
            loggedIn={loggedIn}
            canSendMessage={canSendMessage}
            canSendTip={canSendTip}
          />
        )}
    </View>
  );
};

const mapStateToProps = (state) => ({
  currentUser: state.user.current,
  activeConversation: state.streamMessage.activeConversation,
  system: { ...state.system },
});
const mapDispatchs = {
  getStreamConversation,
  resetStreamMessage,
};
export default connect(mapStateToProps, mapDispatchs)(ChatBox);
