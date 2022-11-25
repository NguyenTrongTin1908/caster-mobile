import React, { createRef, useEffect, useRef, useState } from "react";
import { connect } from "react-redux";
import moment from "moment";
import {
  loadMoreStreamMessages,
  receiveStreamMessageSuccess,
  deleteMessage,
  deleteMessageSuccess,
} from "services/redux/stream-chat/actions";
import { IUser, IPerformer } from "src/interfaces";
import socketHolder from "lib/socketHolder";
import styles from "./style";

// import './MessageList.less';
import Compose from "./Compose";
import Message from "./Message";
import {
  FlatList,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { HStack, View } from "native-base";
import EmojiSelector from "react-native-emoji-selector";
import Ionicons from "react-native-vector-icons/Ionicons";
import { sendMessagePrivateStream } from "services/redux/chatRoom/actions";
import { sendStreamMessage } from "services/redux/stream-chat/actions";

import modal from "../comment/modal";
import ChatFooter from "../message/ChatFooter";
import SendTip from "../message/SendTip";
import Button from "components/uis/Button";
import { giftService } from "services/gift.service";

interface IProps {
  loadMoreStreamMessages: Function;
  receiveStreamMessageSuccess: Function;
  message: any;
  conversation: any;
  user: IPerformer;
  deleteMessage: Function;
  deleteMessageSuccess: Function;
  loggedIn?: boolean;
  sendStreamMessage: Function;
}

const canDelete = ({ isDeleted, senderId, performerId }, user): boolean => {
  if (isDeleted) return false;
  let check = false;
  if (user && user._id) {
    if (user.roles && user.roles.includes("admin")) {
      check = true;
    } else if (
      user.roles &&
      user.roles.includes("user") &&
      senderId === user._id
    ) {
      check = true;
    } else if (performerId === user._id) {
      check = true;
    }
  }
  return check;
};

const MessageList = ({
  loadMoreStreamMessages,
  receiveStreamMessageSuccess: create,
  message,
  conversation,
  user,
  deleteMessage: remove,
  deleteMessageSuccess,
  sendStreamMessage,
  loggedIn,
}: IProps) => {
  let messagesRef: any;

  // state = {
  //   offset: 1,
  //   onloadmore: false,
  // };

  const [offset, setOffset] = useState(1);
  const [onloadmore, setOnloadmore] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);
  const [modal, setModal] = useState(false);
  const [favoriteGift, setFavoriteGift] = useState({});

  const inputText = useRef("");

  useEffect(() => {
    if (messagesRef) messagesRef = createRef();
    const socket = socketHolder.getSocket() as any;

    if (conversation && conversation._id) {
      socket &&
        socket.on &&
        socket.on(
          `message_created_conversation_${conversation._id}`,
          (data) => {
            onMessage(data, "created");
          }
        );
      socket &&
        socket.on &&
        socket.on(
          `message_deleted_conversation_${conversation._id}`,
          (data) => {
            onMessage(data, "deleted");
          }
        );
    }

    return () => {
      socket && socket.off(`message_created_conversation_${conversation._id}`);
      socket && socket.off(`message_deleted_conversation_${conversation._id}`);
    };
    getfavoriteGift();
  }, []);

  // componentWillUnmount() {
  //   const { conversation } = this.props;
  //   const socket = socketHolder.getSocket() as any;
  //   socket && socket.off(`message_created_conversation_${conversation._id}`);
  //   socket && socket.off(`message_deleted_conversation_${conversation._id}`);
  // }

  const onMessage = (message, type) => {
    if (!message) {
      return;
    }

    type === "created" && create(message);
    type === "deleted" && remove(message);
  };

  const onDelete = (messageId) => {
    if (!messageId) return;
    deleteMessage({ messageId });
  };

  const getfavoriteGift = async () => {
    const respGift = await (await giftService.favoriteGift()).data;
    setFavoriteGift(respGift.data[0]);
  };

  const renderMessages = () => {
    const messages = message.items;
    let i = 0;
    const messageCount = messages && messages.length;
    const tempMessages = [] as any;
    while (i < messageCount) {
      const previous = messages[i - 1];
      const current = messages[i];
      const next = messages[i + 1];
      const isMine = user && current.senderId === user._id;
      const currentMoment = moment(current.createdAt);
      let prevBySameAuthor = false;
      let nextBySameAuthor = false;
      let startsSequence = true;
      let endsSequence = true;
      let showTimestamp = true;
      const isOwner =
        conversation && conversation.performerId === current.senderId;
      if (previous) {
        const previousMoment = moment(previous.createdAt);
        const previousDuration = moment.duration(
          currentMoment.diff(previousMoment)
        );
        prevBySameAuthor = previous.senderId === current.senderId;

        if (prevBySameAuthor && previousDuration.as("hours") < 1) {
          startsSequence = false;
        }

        if (previousDuration.as("hours") < 1) {
          showTimestamp = false;
        }
      }

      if (next) {
        const nextMoment = moment(next.createdAt);
        const nextDuration = moment.duration(nextMoment.diff(currentMoment));
        nextBySameAuthor = next.senderId === current.senderId;

        if (nextBySameAuthor && nextDuration.as("hours") < 1) {
          endsSequence = false;
        }
      }
      if (current._id) {
        tempMessages.push(
          // <Message
          //   onDelete={this.onDelete.bind(this, current._id)}
          //   canDelete={canDelete(current, user)}
          //   isOwner={isOwner}
          //   key={i}
          //   isMine={isMine}
          //   startsSequence={startsSequence}
          //   endsSequence={endsSequence}
          //   showTimestamp={showTimestamp}
          //   data={current}
          // />
          {
            ...current,
            ["startsSequence"]: startsSequence,
            ["endsSequence"]: endsSequence,
            ["showTimestamp"]: showTimestamp,
            ["isMine"]: isMine,
          }
        );
      }
      // Proceed to the next message.
      i += 1;
    }
    // this.scrollToBottom();

    return (
      <View flex={1} maxH={200} minH={200}>
        <FlatList
          data={tempMessages}
          renderItem={({ item }: any) => (
            <Message
              onDelete={onDelete.bind(this, item._id)}
              canDelete={canDelete(item, user)}
              isOwner={item.senderId}
              key={item._id}
              isMine={item.senderId === user._id}
              startsSequence={item.startsSequence}
              endsSequence={item.endsSequence}
              showTimestamp={item.showTimestamp}
              data={item}
            />
          )}
          keyExtractor={(item: any, index) => item._id + "_" + index}
          // style={styles.listModel}
          onEndReachedThreshold={0.5}
          // onEndReached={() => fetchData()}
        />
      </View>
    );
  };

  const handleScroll = (conversation, event) => {
    const { fetching, items, total } = message;
    const canloadmore = total > items.length;
    const ele = event.target;
    if (!canloadmore) return;
    if (ele.scrollTop === 0 && conversation._id && !fetching && canloadmore) {
      setOffset(offset + 1);
      setOnloadmore(true);

      loadMoreStreamMessages({
        conversationId: conversation._id,
        limit: 25,
        offset: (offset - 1) * 25,
        type: conversation.type,
      });
    }
  };
  const ButtonPrivateChatDetail = ({ ...props }) => (
    <HStack my={3} space={2} alignSelf="center">
      <Button {...props} />
    </HStack>
  );

  const onSelectEmoji = (emoji) => {
    inputText.current = `${inputText.current}${emoji}`;
    setShowEmoji(false);
  };

  const onPressEmoji = (currentText) => {
    inputText.current = currentText || "";
    setShowEmoji(true);
  };
  const favoriteHandle = (gift) => {
    setFavoriteGift(gift);
    giftService.addfavoriteGift({ giftId: gift._id });
  };

  const sendMessage = (message) => {
    const text = message.data.input;
    console.log("Data", conversation.type);
    sendStreamMessage({
      conversationId: conversation._id,
      data: {
        text,
      },
      type: conversation.type,
    });
  };

  if (messagesRef) messagesRef = createRef();

  return (
    <View style={{ flex: 1 }}>
      <>
        <View>{renderMessages()}</View>

        {showEmoji && <EmojiSelector onEmojiSelected={onSelectEmoji} />}
        {!showEmoji && (
          <ChatFooter
            authUser={user}
            conversationId={conversation._id}
            Button={ButtonPrivateChatDetail}
            setModal={setModal}
            sendMessageStream={sendMessage}
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

        <SendTip
          setModal={setModal}
          aria-label="Send Tip"
          modal={modal}
          conversationId={conversation._id}
          performerId={conversation.performerId || ""}
          saveFavorite={favoriteHandle}
          favorGift={favoriteGift}
        />
      </>
    </View>
  );
};

const mapStates = (state: any) => {
  const { conversationMap, activeConversation } = state.streamMessage;
  const messages =
    activeConversation.data && conversationMap[activeConversation.data._id]
      ? conversationMap[activeConversation.data._id].items || []
      : [];
  const totalMessages =
    activeConversation.data && conversationMap[activeConversation.data._id]
      ? conversationMap[activeConversation.data._id].total || 0
      : 0;
  const fetching =
    activeConversation.data && conversationMap[activeConversation.data._id]
      ? conversationMap[activeConversation.data._id].fetching || false
      : false;
  return {
    message: {
      items: messages,
      total: totalMessages,
      fetching,
    },
    conversation: activeConversation.data,
    user: state.user.current,
  };
};

const mapDispatch = {
  loadMoreStreamMessages,
  receiveStreamMessageSuccess,
  deleteMessage,
  deleteMessageSuccess,
  sendStreamMessage,
};

export default connect(mapStates, mapDispatch)(MessageList);
