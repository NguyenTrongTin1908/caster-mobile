import React, { useContext, useState, useEffect, useRef } from "react";
import { connect } from "react-redux";
import { Box } from "native-base";
import { useNavigation } from "@react-navigation/core";
import { IPerformer } from "interfaces/performer";
import ChatHeader from "components/message/ChatHeader";
import { messageService } from "services/message.service";
import { IConversation } from "interfaces/conversation";
import LoadingSpinner from "components/uis/LoadingSpinner";
import PublicMessageList from "./component/PublicMessageList";
import { IUser } from "interfaces/user";
import ChatFooter from "components/message/ChatFooter";
import BottomButton from "screens/chat/component/BottomButton";
import { sendMessageStream } from "services/redux/chatRoom/actions";
import Ionicons from "react-native-vector-icons/Ionicons";
import SendTip from "components/message/SendTip";
import EmojiSelector from 'react-native-emoji-selector';

interface IProps {
  route: {
    params: {
      performer: IPerformer;
    };
  };
  current: IUser;
  sendMessageStream: Function;
}

const ChatRoom = ({
  route,
  current,
  sendMessageStream,
}: IProps): React.ReactElement => {
  const { performer } = route.params;
  const navigation = useNavigation() as any;
  const [modal, setModal] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);
  const inputText = useRef('');

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitleAlign: "left",
      title: <ChatHeader performer={performer} />,
      headerLeft: () => null,
      headerRight: () => null,
    });
  }, [useContext]);

  const [conversation, setConversation] = useState({} as IConversation);
  const [loading, setLoading] = useState(true);

  const loadPublicConversation = async () => {
    if (!performer || !performer._id) return navigation.goBack();
    setLoading(true);
    const { data } = await messageService.findPublicConversationPerformer(
      performer._id
    );
    setConversation(data);
    setLoading(false);
  };

  useEffect(() => {
    loadPublicConversation();
  }, []);

  const onSelectEmoji = (emoji) => {
    inputText.current = `${inputText.current}${emoji}`;
    setShowEmoji(false);
  };

  const onPressEmoji = (currentText) => {
    inputText.current = currentText || '';
    setShowEmoji(true);
  };

  return (
    <Box flex={1} safeAreaBottom={8} safeAreaX={4}>
      {loading && <LoadingSpinner />}
      {!loading && conversation && current && (
        <PublicMessageList
          conversationId={conversation._id}
          authUser={current}
        />
      )}
      {showEmoji && <EmojiSelector
        onEmojiSelected={onSelectEmoji}
      />}
      {!showEmoji &&
        <ChatFooter
          authUser={current}
          conversationId={conversation._id}
          Button={BottomButton}
          sendMessageStream={sendMessageStream}
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
      }
      <SendTip
        setModal={setModal}
        modal={modal}
        conversationId={conversation._id}
        performerId={performer._id || ""}
      />
    </Box>
  );
};

const mapStateToProp = (state: any): any => ({
  ...state.user,
});
const mapDispatch = { sendMessageStream };
export default connect(mapStateToProp, mapDispatch)(ChatRoom);
