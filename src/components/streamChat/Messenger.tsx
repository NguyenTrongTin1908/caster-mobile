import { View } from "native-base";
import { connect } from "react-redux";
import { getStreamConversation } from "services/redux/stream-chat/actions";
import MessageList from "./MessageList";
import React, { useContext, useEffect, useState } from "react";

// import './Messenger.less';

interface IProps {
  streamId?: string;
  loggedIn?: boolean;
  getStreamConversation: Function;
  activeConversation: any;
}
const StreamMessenger = ({
  activeConversation,
  loggedIn,
}: IProps): React.ReactElement => {
  return (
    <View flex={1}>
      {activeConversation &&
      activeConversation.data &&
      activeConversation.data.streamId ? (
        <MessageList loggedIn={loggedIn} />
      ) : (
        <p>No conversation found.</p>
      )}
    </View>
  );
};
const mapStates = (state: any) => ({
  activeConversation: state.streamMessage.activeConversation,
});
const mapDispatchs = { getStreamConversation };
export default connect(mapStates, mapDispatchs)(StreamMessenger);
