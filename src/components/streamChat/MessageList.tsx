import React, { createRef, useEffect, useRef, useState } from "react";
import { connect } from "react-redux";
import moment from "moment";
import {
  loadMoreStreamMessages,
  receiveStreamMessageSuccess,
  deleteMessage,
  deleteMessageSuccess,
} from "services/redux/stream-chat/actions";
import { IPerformer } from "src/interfaces";
import socketHolder from "lib/socketHolder";
import Message from "./Message";
import { FlatList } from "react-native";
import { HStack, View } from "native-base";
import EmojiSelector from "react-native-emoji-selector";
import Ionicons from "react-native-vector-icons/Ionicons";
import { sendStreamMessage } from "services/redux/stream-chat/actions";
import ChatFooter from "../message/ChatFooter";
import Button from "components/uis/Button";
import { giftService } from "services/gift.service";
import { ObservableQueue } from "../../hooks/observable-queue";
import { of, delay } from "rxjs";
const queue = new ObservableQueue();

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
  canSendMessage: boolean;
  canSendTip?: boolean;
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
  deleteMessage,
  deleteMessageSuccess: remove,
  sendStreamMessage,
  canSendMessage,
  canSendTip,
}: IProps) => {
  let messagesRef: any;

  const [offset, setOffset] = useState(1);
  const [onloadmore, setOnloadmore] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);
  const [modal, setModal] = useState(false);
  const inputText = useRef("");
  const flatListRef = React.useRef() as any;

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
  }, []);

  function createObservable(data, playingTime) {
    return of(data).pipe(delay(playingTime));
  }

  function addNew(data: any, playingTime: number) {
    const original = createObservable(data, playingTime);
    return queue.addItem(original);
  }

  async function render(result) {
    if (result && result?.type === "created") create(result);
  }

  const onMessage = (message, type) => {
    if (!message) {
      return;
    }
    if (type === "deleted") {
      return remove(message);
    }
    if (type === "created") {
      const { durationInChat } = (message?.meta && message?.meta?.gift) || 0;
      durationInChat
        ? addNew({ ...message, type }, durationInChat * 1000).subscribe(render)
        : create(message);
    }
  };

  const onDelete = (messageId) => {
    if (!messageId) return;
    deleteMessage({ messageId });
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
        tempMessages.push({
          ...current,
          ["startsSequence"]: startsSequence,
          ["endsSequence"]: endsSequence,
          ["showTimestamp"]: showTimestamp,
          ["isMine"]: isMine,
        });
      }
      // Proceed to the next message.
      i += 1;
      // flatListRef.current.scrollToEnd({ animated: true })
    }

    return (
      <View flex={1} maxH={100} minH={100}>
        <FlatList
          data={tempMessages}
          ref={flatListRef}
          onContentSizeChange={() => flatListRef.current.scrollToEnd()}
          onLayout={() => flatListRef.current.scrollToEnd()}
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
          inverted
          keyExtractor={(item: any, index) => item._id + "_" + index}
          onEndReachedThreshold={0.5}
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
    try {
      if (gift && gift.length > 0) {
        giftService.addfavoriteGift({ giftId: gift._id });
      }
    } catch (error) {
      console.log("Error : ", error);
    }
  };

  const sendMessage = (message) => {
    const text = message.data.input;
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
        {!showEmoji && canSendMessage && (
          <ChatFooter
            authUser={user}
            conversationId={conversation._id}
            Button={ButtonPrivateChatDetail}
            setModal={setModal}
            canSendTip={canSendTip}
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

        {/* <SendTip
          setModal={setModal}
          aria-label="Send Tip"
          modal={modal}
          conversationId={conversation._id}
          performerId={conversation.performerId || ""}
          saveFavorite={favoriteHandle}
          favorGift={favoriteGift}
        /> */}
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
