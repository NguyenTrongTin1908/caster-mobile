import React from "react";
import { Box, FlatList, View } from "native-base";
import BadgeText from "components/uis/BadgeText";
import MessageCard from "components/message/MessageCard";
import { IPerformer } from "src/interfaces";
import { connect } from "react-redux";
import moment from "moment";

interface IProps {
  conversationId: string;
  authUser: IPerformer;
  message: any;
  sendMessage: any;
  conversation: any;
  currentUser: any;
}

const MessageList = ({
  message,
  currentUser,
  conversation,
}: IProps): React.ReactElement => {
  const renderMessages = () => {
    const recipientInfo = conversation && conversation.recipientInfo;
    const messages = message.items;
    let i = 0;
    const messageCount = messages.length;
    const tempMessages = [] as any;
    while (i < messageCount) {
      const previous = messages[i - 1];
      const current = messages[i];
      const next = messages[i + 1];
      const isMine = current.senderId === currentUser._id;
      const currentMoment = moment(current.createdAt);
      let prevBySameAuthor = false;
      let nextBySameAuthor = false;
      let startsSequence = true;
      let endsSequence = true;
      let showTimestamp = true;

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
          ["recipientInfo"]: recipientInfo,
        });
      }
      // Proceed to the next message.
      i += 1;
    }

    return (
      <View flex={1}>
        <FlatList
          data={tempMessages}
          renderItem={({ item }: any) => (
            <MessageCard
              isOwner={item.senderId}
              key={item._id}
              isMe={item.senderId === currentUser._id}
              startsSequence={item.startsSequence}
              endsSequence={item.endsSequence}
              showTimestamp={item.showTimestamp}
              message={item}
            />
          )}
          keyExtractor={(item: any, index) => item._id + "_" + index}
        />
      </View>
    );
  };

  return <Box flex={1}>{renderMessages()}</Box>;
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
    sendMessage,
    message: {
      items: messages,
      total: totalMessages,
      fetching,
    },
    conversation: activeConversation,
    currentUser: state.user.current,
  };
};

export default connect(mapStates)(MessageList);
