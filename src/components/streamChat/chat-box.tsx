import React, { useEffect, useState } from "react";
import { Button, View, Heading, KeyboardAvoidingView } from "native-base";
import { connect } from "react-redux";
import { IUser } from "src/interfaces";
import { streamService } from "../../services";
import { messageService } from "../../services";
import StreamMessenger from "components/streamChat/Messenger";
import EmojiSelector from "react-native-emoji-selector";
import KeyboardDismiss from "components/uis/KeyboardDismiss";

import socketHolder from "lib/socketHolder";

import {
  getStreamConversation,
  resetStreamMessage,
} from "services/redux/stream-chat/actions";
import { WEBRTC_ADAPTOR_INFORMATIONS } from "components/antmedia/constants";
import styles from "./style";
import { SafeAreaView } from "react-native-safe-area-context";
import HeaderMenu from "components/tab/HeaderMenu";
import { colors } from "utils/theme";
import { isAndroid } from "utils/common";

// eslint-disable-next-line no-shadow
// enum EVENT_NAME {
//   ROOM_INFORMATIOM_CHANGED = "public-room-changed",
// }
interface IProps {
  resetAllStreamMessage?: Function;
  user?: any;
  activeConversation?: any;
  totalParticipant?: number;
  members?: IUser[];
  loggedIn?: boolean;
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
      // message.error(getResponseError(error));
    } finally {
      setRemoving(false);
    }
  };

  return (
    // <KeyboardDismiss>
    <View style={styles.chatbox}>
      {activeConversation &&
        activeConversation.data &&
        activeConversation.data.streamId && (
          <StreamMessenger
            streamId={activeConversation.data.streamId}
            loggedIn={loggedIn}
          />
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
