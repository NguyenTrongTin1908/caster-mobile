import React, { useEffect, useRef, useState } from 'react';
import { View } from 'react-native';
import { Box, FlatList } from 'native-base';
import BadgeText from 'components/uis/BadgeText';
import LoadingSpinner from 'components/uis/LoadingSpinner';
import MessageCard from 'components/message/MessageCard';
import { messageService } from 'services/message.service';
import { IUser } from 'interfaces/user';
import { IMessage } from 'interfaces/conversation';
import socketHolder from 'lib/socketHolder';
import { connect } from 'react-redux';
import { getMessagePrivateChat } from 'services/redux/chatRoom/actions';

interface IProps {
  conversationId: string;
  recipientId: string;
  authUser: IUser;
  messagePrivate: IMessage;
  isSet: boolean;
  getMessagePrivateChat: Function;
}

const MessageList = ({
  conversationId,
  recipientId,
  authUser,
  messagePrivate,
  isSet,
  getMessagePrivateChat
}: IProps): React.ReactElement => {
  const [messages, setMessages] = useState([] as Array<IMessage>);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [moreable, setMoreable] = useState(true);
  const [message, setMessage] = useState({} as IMessage);

  const sendMessage = useRef(false);
  
  const loadMessages = async (more = false) => {
    if (more && !moreable) return;
    setLoading(true);
    const newPage = more ? page + 1 : page;
    setPage(newPage);

    const { data } = await messageService.getMessages(conversationId, {
      offset: newPage * 25,
      limit: 25
    });

    if (data.length < 10) setMoreable(false);
    setMessages([...messages.concat(data)]);
    setLoading(false);
  };

  const readMessage = async () => {
    await messageService.readAllInConversation(conversationId, recipientId);
  };

  const renderEmpty = () => (
    <View>
      {!loading && !messages.length && (
        <BadgeText content={'There is no message available!'} />
      )}
    </View>
  );

  const handleSocket = async (socket) => {
    socket.on('message_created', (data) => {
      setMessage(data);
      sendMessage.current = true;
    });
  };

  const handleDisconnect = (socket) => {
    if (!socket) return;
    socket.off('message_created');
  };

  useEffect(() => {
    loadMessages();
    readMessage();
  }, []);

  useEffect(() => {
    const socket = socketHolder.getSocket();
    if (socket) handleSocket(socket);

    return () => {
      handleDisconnect(socket);
    };
  }, []);

  useEffect(() => {
    if (sendMessage.current) {
      messages.unshift(message)
      setMessages(messages);
    }
  }, [message]);

  useEffect(() => {
    if (isSet) {
      messages.unshift(messagePrivate);
      setMessages(messages);
      getMessagePrivateChat({ data: {}, isSet: false });
    }
  }, [messagePrivate, isSet]);

  return (
    <Box flex={1}>
      {loading && <LoadingSpinner />}
      <FlatList
        inverted
        data={messages}
        renderItem={({ item }) => (
          <MessageCard message={item} isMe={authUser._id === item.senderId} />
        )}
        keyExtractor={(item, index) => item._id + '_' + index}
        onEndReachedThreshold={0.5}
        onEndReached={() => loadMessages(true)}
        ListEmptyComponent={renderEmpty()}
      />
    </Box>
  );
};

const mapStateToProps = (state) => ({
  messagePrivate: state.chatReducer.messagePrivate,
  isSet: state.chatReducer.isSet
});

export default connect(mapStateToProps, { getMessagePrivateChat })(MessageList);
