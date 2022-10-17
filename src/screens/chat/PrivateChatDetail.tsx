import React, { useContext, useEffect, useRef, useState } from "react";
import { connect } from "react-redux";
import { Box, HStack, useDisclose } from "native-base";
import { useNavigation } from "@react-navigation/core";
import { IPerformer } from "interfaces/performer";
import ChatHeader from "components/message/ChatHeader";
import PrivateMessageList from "./component/PrivateMessageList";
import { IUser } from "interfaces/user";
import ChatFooter from "components/message/ChatFooter";
import Button from "components/uis/Button";
import { sendMessagePrivateStream } from "services/redux/chatRoom/actions";
import Ionicons from "react-native-vector-icons/Ionicons";
import SendTip from "components/message/SendTip";
import KeyboardDismiss from "components/uis/KeyboardDismiss";
import EmojiSelector from 'react-native-emoji-selector';

interface IProps {
  route: {
    params: {
      performer: IPerformer;
      conversationId: string;
    };
  };
  current: IPerformer;
  sendMessagePrivateStream: Function;
}

const PrivateChatDetail = ({
  route,
  current,
  sendMessagePrivateStream,
}: IProps): React.ReactElement => {
  const { performer, conversationId } = route.params;
  const navigation = useNavigation() as any;
  const [showEmoji, setShowEmoji] = useState(false);
  const inputText = useRef('');

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitleAlign: "left",
      title: <ChatHeader performer={performer} isPrivate={true} />,
      headerLeft: () => null,
      headerRight: () => null,
    });
  }, [useContext]);

  const ButtonPrivateChatDetail = ({ ...props }) => (
    <HStack my={3} space={2} alignSelf="center">
      <Button {...props} />
    </HStack>
  );
  const [modal, setModal] = useState(false);

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
      {current && (
        <PrivateMessageList
          conversationId={conversationId}
          authUser={current}
          recipientId={current._id}
        />
      )}
      {showEmoji && <EmojiSelector
        onEmojiSelected={onSelectEmoji}
      />}
      {!showEmoji && <ChatFooter
        authUser={current}
        conversationId={conversationId}
        Button={ButtonPrivateChatDetail}
        setModal={setModal}
        sendMessageStream={sendMessagePrivateStream}
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
      />}
      <SendTip
        setModal={setModal}
        modal={modal}
        conversationId={conversationId}
        performerId={performer._id || ""}
      />
    </Box>
  );
};

const mapStateToProp = (state: any): any => ({
  current: state.user.current,
});

const mapDispatch = { sendMessagePrivateStream };

export default connect(mapStateToProp, mapDispatch)(PrivateChatDetail);
