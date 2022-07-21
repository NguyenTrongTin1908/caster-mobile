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

interface IProps {
  conversationId: string;
  authUser: IUser;
}

const MessageList = ({
  conversationId,
  authUser
}: IProps): React.ReactElement => {
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [moreable, setMoreable] = useState(true);
  const [messages, setMessages] = useState([] as Array<IMessage>);
  const [message, setMessage] = useState({} as IMessage);
  const sendMessage = useRef(false);

  const loadMessages = async (more = false) => {
    if (more && !moreable) return;
    setLoading(true);
    const newPage = more ? page + 1 : page;
    setPage(newPage);

    const { data } = await messageService.getPublicMessages(conversationId, {
      offset: newPage * 25,
      limit: 25,
      sort: 'desc'
    });

    if (data.length < 10) setMoreable(false);
    setMessages(messages.concat(data));

    setLoading(false);
  };

  const renderEmpty = () => (
    <View>
      {!loading && !messages.length && (
        <BadgeText content={'There is no message available!'} />
      )}
    </View>
  );

  const handleSocket = async (socket) => {
    const joinRoom = () => {
      // join room to listen socket event
      socket.emit('public-stream/join', {
        conversationId
      });
    };
    joinRoom();

    socket.on('reconnect', joinRoom);
    // listen socket event
    socket.on(`message_created_conversation_${conversationId}`, (data) => {
      setMessage(data);
      sendMessage.current = true;
    });
  };

  const handleDisconnect = (socket) => {
    if (!socket) return;
    socket.off(`message_created_conversation_${conversationId}`);
    socket.emit('public-stream/leave', {
      conversationId
    });
  };

  useEffect(() => {
    loadMessages();
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
      setMessages([message].concat(messages));
      sendMessage.current = false;
    }
  }, [message]);

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

export default MessageList;
