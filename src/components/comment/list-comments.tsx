import CommentItem from "./comment-item";
import { IPerformer } from "interfaces/index";
import { Actionsheet, View, useDisclose, HStack, Image } from "native-base";
import { FlatList, Text, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import CommentForm from "./comment-form";
import { colors, Sizes } from "utils/theme";

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
    const [itemPerPage, setitemPerPage] = useState(5);
    const [commentPage, setcommentPage] = useState(0);
    const [requesting, setRequesting] = useState(true);
    const { onOpen, isOpen, onClose } = useDisclose();
    const [totalComment, setTotalComment] = useState(feed.totalComment);
    const comments = commentMapping.hasOwnProperty(feed._id)
      ? commentMapping[feed._id].items
      : [];

    useEffect(() => {
      comments.length !== 0 && setTotalComment(comments.length);
    }, [comments]);
    const handleOpenComment = async () => {
      setcommentPage(0);
      handleShowComment();
      onOpen();
    };

    const handleShowComment = async () => {
      try {
        setRequesting(true);
        await getComments({
          objectId: feed._id,
          objectType: "feed",
          limit: itemPerPage,
          offset: 0,
        });
        setRequesting(false);
      } catch (error) {}
    };
    const handleGetmore = async () => {
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
        <View>
          <CommentItem
            canReply={canReply}
            key={item._id}
            item={item}
            onDelete={handleDeleteComment}
          />
        </View>
      );
    };
    const renderEmpty = () => (
      <View>
        {!requesting && !comments.length && (
          <Text style={{ fontSize: 16, fontWeight: "bold" }}>No comments</Text>
        )}
      </View>
    );
    return (
      <View>
        <TouchableOpacity onPress={() => handleOpenComment()}>
          <MaterialCommunityIcons
            name="comment-processing"
            color={colors.lightText}
            size={28}
          />
        </TouchableOpacity>
        <Actionsheet isOpen={isOpen} onClose={onClose} padding={0}>
          <Actionsheet.Content height={400}>
            {renderEmpty()}
            <FlatList
              keyExtractor={(item) => item._id}
              data={comments}
              renderItem={renderItem}
              showsVerticalScrollIndicator={false}
              style={{ width: "100%" }}
              onEndReachedThreshold={0.1}
              onEndReached={() => handleGetmore()}
              inverted
            />
            {commentMapping[feed._id] && commentMapping[feed._id].requesting}
            <HStack space={2} w="100%">
              <View w="15%">
                <Image
                  source={
                    user?.avatar
                      ? { uri: user?.avatar }
                      : require("../../assets/avatar-default.png")
                  }
                  style={{
                    width: 40,
                    height: 40,
                    marginLeft: 5,
                    borderRadius: 35.0,
                    borderColor: "blue",
                    borderWidth: 1.0,
                    alignItems: "center",
                  }}
                  alt="avatar"
                />
              </View>
              <View width={"85%"}>
                <CommentForm
                  creator={user}
                  objectId={feed._id}
                  objectType="feed"
                  handleOnSubmit={handleCreateComment}
                ></CommentForm>
              </View>
            </HStack>
          </Actionsheet.Content>
        </Actionsheet>
        <Text
          style={{
            marginTop: Sizes.fixPadding - 7.0,
            color: colors.lightText,
            textAlign: "center",
          }}
        >
          {totalComment}
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
