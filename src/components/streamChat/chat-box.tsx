import React from "react";
import { View } from "native-base";
import { connect } from "react-redux";
import { IUser } from "src/interfaces";
import { messageService } from "../../services";
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
  totalParticipant,
  members,
  loggedIn,
  canSendMessage,
}: IProps) => {
  const [removing, setRemoving] = React.useState(false);
  const [canReset, setCanReset] = React.useState(false);

  React.useEffect(() => {
    setCanReset(checkPermission(user, activeConversation));
  }, [user, activeConversation]);

  const removeAllMessage = async () => {
    if (!canReset) {
      return;
    }

    try {
      setRemoving(true);
      // if (!window.confirm('Are you sure you want to remove chat history?')) {
      //   return;
      // }
      await messageService.deleteAllMessageInConversation(
        activeConversation.data._id
      );
      resetAllStreamMessage &&
        resetAllStreamMessage({ conversationId: activeConversation.data._id });
    } catch (e) {
      const error = await Promise.resolve(e);
    } finally {
      setRemoving(false);
    }
  };

  return (
    // <KeyboardDismiss>
    <View style={styles.chatContainer}>
      {activeConversation &&
        activeConversation.data &&
        activeConversation.data.streamId && (
          <MessageList loggedIn={loggedIn} canSendMessage={canSendMessage} />
        )}
    </View>
    // </KeyboardDismiss>
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
