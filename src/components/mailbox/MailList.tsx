import { HStack, Pressable, Icon, Box } from "native-base";
import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/core";
import styles from "./style";
import MailCard from "./MailCard";
import socketHolder from "lib/socketHolder";
import { SwipeListView } from "react-native-swipe-list-view";
import LoadingSpinner from "components/uis/LoadingSpinner";

import {
  searchConversations,
  getConversations,
  setActiveConversation,
  getConversationDetail,
  receiveMessageSuccess,
} from "services/redux/message/actions";
import { messageService } from "services/message.service";
import { IPerformer } from "src/interfaces";
import { connect } from "react-redux";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

interface IProps {
  searchConversations: Function;
  getConversations: Function;
  setActiveConversation: Function;
  getConversationDetail: Function;
  receiveMessageSuccess: Function;
  activeConversation: any;
  toSource: any;
  toId: any;
  user: IPerformer;
  conversation: {
    list: {
      requesting: boolean;
      error: any;
      data: any[];
      total: number;
      success: boolean;
    };
    mapping: Record<string, any>;
    activeConversation: Record<string, any>;
  };
  message: {
    conversationMap: {};
    sendMessage: {};
  };
}

const MailList = ({
  getConversations: getConversationsHandler,
  setActiveConversation: setActiveConversationHandler,
  getConversationDetail: getConversationDetailHandler,
  receiveMessageSuccess: receiveMessageSuccessHandler,
  conversation,
  toSource,
  toId,
  user,
}: IProps) => {
  const socket = socketHolder.getSocket() as any;
  const navigation = useNavigation() as any;
  const [conversationPage, setConversationPage] = useState(0);
  const [keyword, setKeyword] = useState("");
  const [Loading, setLoading] = useState(true);
  const [moreable, setMoreable] = useState(true);
  const [refresh, setRefresh] = useState(false);
  const [itemPerPage] = useState(25);

  const { mapping } = conversation;
  const [listData, setListData] = useState([] as any) as any;
  let data = [] as any;

  useEffect(() => {
    data = conversation.list.data.map((c, i) => ({
      key: `${i}`,
      ...mapping[c],
    }));
    if (!refresh && data.length < conversationPage * itemPerPage) {
      setMoreable(false);
    }
    if (refresh && !moreable) {
      setMoreable(true);
    }
    setListData(data);
  }, [conversation?.list?.data?.length]);

  useEffect(() => {
    socket.on("message_created", onMessage);
    fetchData();
  }, []);

  const fetchData = (more = false, refresh = false) => {
    if (more && !moreable) return;
    setLoading(true);
    const newPage = more ? conversationPage + 1 : conversationPage;
    setConversationPage(refresh ? 0 : newPage);
    getConversationsHandler({
      limit: itemPerPage,
      offset: refresh ? 0 : newPage * itemPerPage,
      type: "private",
      keyword,
    });

    if (toSource && toId) {
      setTimeout(() => {
        setActiveConversationHandler({
          source: toSource,
          sourceId: toId,
          recipientId: user._id,
        });
      }, 1000);
    }
    setLoading(false);
  };

  const onMessage = (message: { conversationId: string | number }) => {
    if (!message) {
      return;
    }
    const { mapping } = conversation;
    if (!mapping[message.conversationId]) {
      getConversationDetailHandler({
        id: message.conversationId,
      });
    }
    receiveMessageSuccessHandler(message);
  };
  const closeRow = (rowMap, rowKey) => {
    if (rowMap[rowKey]) {
      rowMap[rowKey].closeRow();
    }
  };

  const deleteRow = async (rowMap, rowKey, conversationId) => {
    closeRow(rowMap, rowKey);
    await messageService.deleteConversation(conversationId);
    const newData = [...listData];
    const prevIndex = listData.findIndex((item) => item.key === rowKey);
    newData.splice(prevIndex, 1);
    setListData(newData);
    fetchData();
  };

  const renderHiddenItem = (data, rowMap) => (
    <HStack flex={1} pl={1} my={1.5}>
      <Pressable
        px={4}
        ml="auto"
        bg="red.500"
        justifyContent="center"
        onPress={() => deleteRow(rowMap, data.item.key, data.item._id)}
        _pressed={{
          opacity: 0.5,
        }}
      >
        <Icon as={<MaterialIcons name="delete" />} color="white" />
      </Pressable>
    </HStack>
  );

  const setActive = (conversationId: any, performer: IPerformer) => {
    setActiveConversationHandler({ conversationId, recipientId: user._id });
    navigation.navigate("ChatRoom", { performer: performer, conversationId });
  };

  return (
    <>
      {Loading && <LoadingSpinner />}
      {listData && listData.length > 0 && (
        <SwipeListView
          data={listData}
          renderItem={({ item }) => (
            <MailCard
              user={user}
              key={item.key}
              message={item}
              setActive={setActive}
            />
          )}
          keyExtractor={(item: any, index) => item.key + "_" + index}
          style={styles.listModel}
          onEndReachedThreshold={0.5}
          onEndReached={() => fetchData(true, false)}
          renderHiddenItem={renderHiddenItem}
          rightOpenValue={-80}
          previewRowKey={"0"}
          previewOpenValue={-40}
          previewOpenDelay={3000}
          onRefresh={() => fetchData()}
          refreshing={Loading}
        />
      )}
    </>
  );
};

const mapStates = (state: any) => ({
  conversation: { ...state.conversation },
  message: { ...state.message },
  user: { ...state.user.current },
  activeConversation: { ...state.conversation },
});

const mapDispatch = {
  searchConversations,
  getConversations,
  setActiveConversation,
  getConversationDetail,
  receiveMessageSuccess,
};

export default connect(mapStates, mapDispatch)(MailList);
