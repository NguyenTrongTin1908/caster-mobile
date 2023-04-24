import CommentItem from "./comment-item";
import { IPerformer } from "interfaces/index";
import { Actionsheet, View, useDisclose, HStack, Image } from "native-base";
import { FlatList, Text, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import AntDesign from "react-native-vector-icons/AntDesign";
import { shortenLargeNumber } from "../../lib/number";
import CommentForm from "./comment-form";
import { colors, Sizes } from "utils/theme";
import { Keyboard, KeyboardEvent } from "react-native";

import {
  getComments,
  moreComment,
  deleteComment,
  createComment,
} from "services/redux/comment/actions";
import { connect } from "react-redux";
import BadgeText from "../uis/BadgeText";
interface IProps {
  user: IPerformer;
  canReply?: boolean;
  feed: any;
  getComments: Function;
  moreComment: Function;
  deleteComment: Function;
  createComment: Function;
  commentMapping: any;
}
const ListComments = React.memo(
  ({
    user,
    canReply,
    feed,
    getComments,
    moreComment,
    deleteComment,
    createComment,
    commentMapping,
  }: IProps): React.ReactElement => {
    const [itemPerPage, setitemPerPage] = useState(12);
    const [commentPage, setcommentPage] = useState(0);
    const [requesting, setRequesting] = useState(true);
    const { onOpen, isOpen, onClose } = useDisclose();
    const [totalComment, setTotalComment] = useState(feed.totalComment);
    const [comments, setComments] = useState([] as any);

    useEffect(() => {
      const data = commentMapping?.hasOwnProperty(feed._id)
        ? commentMapping[feed._id]?.items
        : [];
      setComments(data);
      if (data.length !== 0) {
      }
      setRequesting(false);
    }, [commentMapping[feed._id]?.items?.length]);
    const [keyboardHeight, setKeyboardHeight] = useState(0);

    function onKeyboardDidShow(e: KeyboardEvent) {
      // Remove type here if not using TypeScript
      setKeyboardHeight(e.endCoordinates.height - 170);
    }

    function onKeyboardDidHide() {
      setKeyboardHeight(0);
    }

    useEffect(() => {
      const showSubscription = Keyboard.addListener(
        "keyboardDidShow",
        onKeyboardDidShow
      );
      const hideSubscription = Keyboard.addListener(
        "keyboardDidHide",
        onKeyboardDidHide
      );
      return () => {
        showSubscription.remove();
        hideSubscription.remove();
      };
    }, []);
    const handleOpenComment = async () => {
      setcommentPage(0);
      handleShowComment();
      onOpen();
    };

    const handleShowComment = async () => {
      try {
        setRequesting(true);
        getComments({
          objectId: feed._id,
          objectType: "feed",
          limit: itemPerPage,
          offset: 0,
        });
      } catch (error) {}
    };
    const handleGetmore = async () => {
      console.log("get more");
      setcommentPage(commentPage + 1);
      moreComment({
        objectId: feed._id,
        objectType: "feed",
        limit: itemPerPage,
        offset: (commentPage + 1) * itemPerPage,
      });
    };
    const handleCreateComment = async (data) => {
      try {
        createComment(data);
        setTotalComment(totalComment + 1);
      } catch (error) {
        console.log(error);
      }
    };
    const handleDeleteComment = async (item) => {
      deleteComment(item._id);
      setTotalComment(totalComment - 1);
    };
    const renderItem = ({ item }) => {
      return (
        <>
          <CommentItem
            canReply={canReply}
            key={item._id}
            item={item}
            onDelete={handleDeleteComment}
          />
        </>
      );
    };
    // const renderEmpty = () => (
    //   <View>
    //     {!requesting && !comments?.lenght && (
    //       <BadgeText content={"No comments !"} />
    //     )}
    //   </View>
    // );
    return (
      <View>
        <TouchableOpacity onPress={() => handleOpenComment()}>
          <MaterialCommunityIcons
            name="comment-processing"
            color={colors.lightText}
            size={28}
          />
        </TouchableOpacity>
        <Actionsheet isOpen={isOpen} onClose={onClose} size="full" padding={0}>
          <Actionsheet.Content height={380}>
            <TouchableOpacity
              onPress={() => onClose()}
              style={{
                alignSelf: "flex-end",
              }}
            >
              <AntDesign name="close" color={colors.darkText} size={26} />
            </TouchableOpacity>
            <View
              style={{
                width: "100%",
                marginBottom: 200 + (keyboardHeight - 100),
              }}
            >
              <FlatList
                keyExtractor={(item) => item._id}
                data={comments}
                renderItem={renderItem}
                showsVerticalScrollIndicator={false}
                style={{ width: "100%" }}
                onEndReachedThreshold={0.5}
                onEndReached={() => handleGetmore()}
                // ListEmptyComponent={renderEmpty()}
                // inverted
                contentContainerStyle={{
                  paddingTop: 100 + keyboardHeight,
                  flexDirection: "column",
                }}
              />
            </View>
            <CommentForm
              creator={user}
              objectId={feed._id}
              objectType="feed"
              isReply={false}
              handleOnSubmit={handleCreateComment}
              height={keyboardHeight}
            ></CommentForm>
          </Actionsheet.Content>
        </Actionsheet>
        <Text
          style={{
            marginTop: Sizes.fixPadding - 7.0,
            color: colors.lightText,
            textAlign: "center",
          }}
        >
          {shortenLargeNumber(totalComment)}
        </Text>
      </View>
    );
  }
);
const mapStates = (state: any) => {
  const { commentMapping, comment } = state.comment;
  return {
    commentMapping,
    comment,
    currentUser: state.user.current,
  };
};
const mapDispatch = {
  getComments,
  moreComment,
  deleteComment,
  createComment,
};
export default connect(mapStates, mapDispatch)(ListComments);
