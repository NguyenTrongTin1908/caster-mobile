import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { Box, FlatList } from 'native-base';
import PerformerCard from 'components/message/PerformerCard';
import { IConversation } from 'interfaces/conversation';
import BadgeText from 'components/uis/BadgeText';
import LoadingSpinner from 'components/uis/LoadingSpinner';
import { messageService } from 'services/message.service';

const PrivateConversationList = (): React.ReactElement => {
  const [conversations, setConversations] = useState(
    [] as Array<IConversation>
  );
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [moreable, setMoreable] = useState(true);

  const loadConversations = async (more = false) => {
    if (more && !moreable) return;
    setLoading(true);
    const newPage = more ? page + 1 : page;
    setPage(newPage);

    const { data } = await messageService.getConversations({
      offset: newPage * 10,
      limit: 10,
      type: 'private'
    });
    if (data.length < 10) setMoreable(false);
    setConversations(conversations.concat(data));
    setLoading(false);
  };

  const renderEmpty = () => (
    <View>
      {!loading && !conversations.length && (
        <BadgeText content={'There is no conversation available!'} />
      )}
    </View>
  );

  useEffect(() => {
    loadConversations();
  }, []);

  return (
    <Box flex={1} mx="auto" w="100%">
      <FlatList
        data={conversations}
        renderItem={({ item }) => (
          <PerformerCard
            performer={item.recipientInfo}
            navigationScreen="PrivateChatDetail"
            navigationParams={{
              conversationId: item._id
            }}
          />
        )}
        keyExtractor={(item, index) => item._id + '_' + index}
        onEndReachedThreshold={0.5}
        onEndReached={() => loadConversations(true)}
        ListEmptyComponent={renderEmpty()}
      />
      {loading && <LoadingSpinner />}
    </Box>
  );
};

export default PrivateConversationList;
