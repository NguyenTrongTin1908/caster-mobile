import React, { createRef, useEffect, useState } from "react";
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
import { FlatList, TextInput, TouchableOpacity } from "react-native";
import { View } from "native-base";

interface IProps {
  loadMoreStreamMessages: Function;
  receiveStreamMessageSuccess: Function;
  message: any;
  conversation: any;
  user: IPerformer;
  deleteMessage: Function;
  deleteMessageSuccess: Function;
  loggedIn?: boolean;
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
  loggedIn,
}: IProps) => {
  let messagesRef: any;

  // state = {
  //   offset: 1,
  //   onloadmore: false,
  // };

  const [offset, setOffset] = useState(1);
  const [onloadmore, setOnloadmore] = useState(false);

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

  const renderMessages = () => {
    console.log("Data : ", message);
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
      <View style={styles.chatbox}>
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
    // const {
    //   message: { fetching, items, total },
    //   loadMoreStreamMessages: loadMore,
    // } = this.props;
    // const { offset } = this.state;
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

  // render() {
  //   const { conversation } = this.props;
  //   const {
  //     message: { fetching },
  //   } = this.props;
  if (messagesRef) messagesRef = createRef();

  return (
    // <div
    //   className="message-list"
    //   ref={this.messagesRef}
    //   onScroll={this.handleScroll.bind(this, conversation)}
    // >
    //   {conversation && conversation._id && (
    //     <>
    //       <div className="message-list-container">
    //         {fetching && <p className="text-center">fetching...</p>}
    // {this.renderMessages()}

    //       </div>
    //       <Compose conversation={conversation} />
    //     </>
    //   )}
    // </div>
    <View>
      {renderMessages()}
      <Compose conversation={conversation} />
      {/* <View>
        <HStack width="100%">
          <View width="88%">
            <FormControl>
              <Controller
                control={control}
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    selectionColor={colors.gray}
                    value={value}
                    placeholder={"Add a comment here"}
                    placeholderTextColor={colors.gray}
                    secureTextEntry={true}
                    multiline
                    numberOfLines={6}
                    onChangeText={(val) => onChange(val)}
                    style={{
                      backgroundColor: colors.lightGray,
                      borderRadius: 50,
                      width: "100%",
                      height: 40,
                      alignItems: "center",
                    }}
                  />
                )}
                name="content"
                rules={{ required: "Comment is required" }}
                defaultValue=""
              />
            </FormControl>
          </View>

          <View width="10%" style={styles.sendComment}>
            <TouchableOpacity>
              <Ionicons
                name="send-sharp"
                size={22}
                color={"crimson"}
                style={styles.sendComment}
              />
            </TouchableOpacity>
          </View>
        </HStack>
      </View> */}
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
};
export default connect(mapStates, mapDispatch)(MessageList);
