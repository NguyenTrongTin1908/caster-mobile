import React, { useContext, useState, useEffect, useRef } from "react";
import { connect } from "react-redux";
import { Box, Button } from "native-base";
import { useNavigation } from "@react-navigation/core";
import { IPerformer } from "interfaces/performer";
import ChatHeader from "components/message/ChatHeader";
import PublicMessageList from "./component/PublicMessageList";
import ChatFooter from "components/message/ChatFooter";
import BottomButton from "screens/chat/component/BottomButton";
import Ionicons from "react-native-vector-icons/Ionicons";
import EmojiSelector from "react-native-emoji-selector";
import { loadMoreMessages } from "services/redux/message/actions";
import {
  sendMessage,
  sentFileSuccess,
  sendMessageSuccess,
} from "services/redux/message/actions";
import { setActiveConversation } from "services/redux/message/actions";
import { messageService } from "../../services";

interface IProps {
  route: {
    params: {
      performer: IPerformer;
      conversationId: string;
      toSource: string;
      toId: string;
    };
  };
  currentUser: IPerformer;
  loadMoreMessages: Function;
  message: any;
  conversation: any;
  sendMessage: Function;
  sentFileSuccess: Function;
  setActiveConversation: Function;
  sendMessageSuccess: Function;
}

const ChatRoom = ({
  route,
  currentUser,
  sendMessage: sendMessageHandle,
  loadMoreMessages,
  setActiveConversation: setActiveConversationHandler,
  message,
  conversation,
  sendMessageSuccess,
}: IProps): React.ReactElement => {
  const { performer, conversationId, toId, toSource } = route.params;
  const navigation = useNavigation() as any;
  const [modal, setModal] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);
  const inputText = useRef("");
  const [loading, setLoading] = useState(true);
  let messagesRef: any;

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitleAlign: "left",
      title: <ChatHeader performer={performer} />,
      headerLeft: () => null,
      headerRight: () => null,
    });
  }, [useContext]);

  useEffect(() => {
    setLoading(true);
    if (toSource && toId) {
      setTimeout(() => {
        setActiveConversationHandler({
          source: toSource,
          sourceId: toId,
          recipientId: currentUser._id,
        });
      }, 1000);
    }
    setLoading(false);
  }, []);

  const send = async (text: any) => {
    const resp = await messageService.sendMessage(conversationId, {
      text: text.data.input,
    });
    sendMessageSuccess(resp.data);
  };

  const onSelectEmoji = (emoji) => {
    inputText.current = `${inputText.current}${emoji}`;
    setShowEmoji(false);
  };

  const onPressEmoji = (currentText) => {
    inputText.current = currentText || "";
    setShowEmoji(true);
  };

  return (
    <Box flex={1} safeAreaBottom={8} safeAreaX={4}>
      {!loading && (
        <PublicMessageList
          conversationId={conversation._id}
          authUser={currentUser}
        />
      )}
      {showEmoji && <EmojiSelector onEmojiSelected={onSelectEmoji} />}
      {!showEmoji && (
        <ChatFooter
          authUser={currentUser}
          conversationId={conversation._id}
          Button={BottomButton}
          sendMessageStream={send}
          setModal={setModal}
          performerId={conversation.performerId}
          PrivateBtnSendMessage={({ ...props }) => (
            <Ionicons
              name="send-outline"
              size={34}
              style={{
                width: 50,
                paddingHorizontal: 10,
                alignItems: "center",
              }}
              color="#ff8284"
              {...props}
            />
          )}
          onPressEmoji={onPressEmoji}
          defaultInput={inputText.current}
        />
      )}
    </Box>
  );
};

const mapStates = (state: any) => {
  const { conversationMap, sendMessage } = state.message;
  const { activeConversation } = state.conversation;
  const messages = conversationMap[activeConversation._id]
    ? conversationMap[activeConversation._id].items || []
    : [];
  const totalMessages = conversationMap[activeConversation._id]
    ? conversationMap[activeConversation._id].total || 0
    : 0;
  const fetching = conversationMap[activeConversation._id]
    ? conversationMap[activeConversation._id].fetching || false
    : false;
  return {
    // sendMessage,
    message: {
      items: messages,
      total: totalMessages,
      fetching,
    },
    conversation: activeConversation,
    currentUser: state.user.current,
  };
};

const mapDispatch = {
  loadMoreMessages,
  sendMessage,
  sentFileSuccess,
  setActiveConversation,
  sendMessageSuccess,
};
export default connect(mapStates, mapDispatch)(ChatRoom);
