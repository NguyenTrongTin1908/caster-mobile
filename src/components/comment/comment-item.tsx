import React, { useEffect, useState } from "react";
import { reactionService } from "services/reaction.service";
import { connect } from "react-redux";
import { CommentForm, ListReplys } from "components/comment";
import {
  getComments,
  moreComment,
  createComment,
  deleteComment,
} from "services/redux/comment/actions";
import { View, VStack, HStack, Image, Flex, Text } from "native-base";
import { IUser, IComment } from "src/interfaces/index";
import { colors } from "utils/theme";
import {
  TouchableOpacity,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
const { width } = Dimensions.get("window");
interface IProps {
  item: IComment;
  canReply?: boolean;
  commentMapping: any;
  currentUser: IUser;
  getComments: Function;
  moreComment: Function;
  deleteComment: Function;
  createComment: Function;
}
export const CommentItem = ({
  item,
  canReply,
  currentUser,
  commentMapping,
  getComments,
  moreComment,
  deleteComment,
  createComment,
}: IProps): React.ReactElement => {
  const [isOpenReply, setOpenReply] = useState(false);
  const [itemPerPage, setItemPerPage] = useState(10);
  const [commentPage, setCommentPage] = useState(0);
  const [isLiked, setLiked] = useState(item.isLiked);
  const [isReply, setReply] = useState(false);
  const [totalLike, setTotalLike] = useState(item.totalLike || 0);
  const replys = commentMapping.hasOwnProperty(item._id)
    ? commentMapping[item._id].items
    : [];
  const totalReplys = commentMapping.hasOwnProperty(item._id)
    ? commentMapping[item._id].total
    : 0;
  // const dispatch = useDispatch();
  const viewWidth = Math.floor(width - 2 * 2);
  const handleCreateComment = async (values) => {
    createComment(values);
    setReply(false);
    setOpenReply(false);
    onOpenComment();
  };
  const onOpenComment = async () => {
    getComments({
      objectId: item._id,
      objectType: "comment",
      limit: itemPerPage,
      offset: commentPage,
    });
    setOpenReply(!isOpenReply);
  };
  const likeComment = async (comment) => {
    try {
      if (!isLiked) {
        await reactionService.create({
          objectId: comment._id,
          action: "like",
          objectType: "comment",
        });
        setLiked(!isLiked);
        setTotalLike(totalLike + 1);
      } else {
        await reactionService.delete({
          objectId: comment._id,
          action: "like",
          objectType: "comment",
        });
        setLiked(false);
        setTotalLike(totalLike - 1);
      }
    } catch (e) {}
  };
  const unLikeComment = async (comment) => {
    try {
      if (isLiked) {
        await reactionService.delete({
          objectId: comment._id,
          action: "like",
          objectType: "comment",
        });
        setLiked(false);
        setTotalLike(totalLike - 1);
      }
    } catch (e) {}
  };
  const loadMoreComment = async () => {
    setCommentPage(commentPage + 1);
    moreComment({
      limit: itemPerPage,
      objectType: "comment",
      offset: (commentPage + 1) * itemPerPage,
      objectId: item._id,
    });
  };
  const handleDeleteComment = async (item) => {
    deleteComment(item._id);
  };
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={400}
    >
      <View width={"100%"} marginTop="2" flex={1}>
        <HStack width={"100%"} space={"5px"}>
          <View
            w={(15 / 100) * viewWidth}
            flex={1}
            maxW={(15 / 100) * viewWidth}
          >
            <Image
              source={
                item?.creator?.avatar
                  ? { uri: item?.creator?.avatar }
                  : require("../../assets/avatar-default.png")
              }
              style={{
                width: 40.0,
                height: 40.0,
                borderRadius: 35.0,
                borderColor: "blue",
                borderWidth: 1.0,
              }}
              alt="avatar"
            />
          </View>
          <View width={(75 / 100) * viewWidth} flex={1}>
            <Flex
              justifyContent={"flex-start"}
              flexDirection="row"
              max-width={"100%"}
            >
              <VStack>
                <Text fontSize={"lg"} color={colors.primary}>
                  {item?.creator.name || item?.creator.username}
                </Text>
                <Text fontSize={"md"} marginLeft="2" max-width={"100%"}>
                  {item?.content}
                </Text>
                <HStack>
                  {canReply && (
                    <TouchableOpacity onPress={() => setReply(!isReply)}>
                      <Text color={colors.secondary}>Reply</Text>
                    </TouchableOpacity>
                  )}
                  {canReply && (
                    <TouchableOpacity
                      onPress={onOpenComment}
                      style={{ marginLeft: 2 }}
                    >
                      <Text color={colors.gray}>View reply</Text>
                    </TouchableOpacity>
                  )}
                </HStack>
              </VStack>
            </Flex>
            {isReply && (
              <HStack space={2} w="100%">
                <View w="15%">
                  <Image
                    source={
                      currentUser?.avatar
                        ? { uri: currentUser?.avatar }
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
                    creator={currentUser}
                    objectId={item._id}
                    objectType="comment"
                    isReply={true}
                    handleOnSubmit={handleCreateComment}
                  ></CommentForm>
                </View>
              </HStack>
            )}
            {isOpenReply && (
              <View>
                <ListReplys
                  requesting={false}
                  comments={replys}
                  total={totalReplys}
                  user={currentUser}
                  canReply={false}
                  feed={item}
                  onDelete={handleDeleteComment}
                  showComment={handleDeleteComment}
                />
              </View>
            )}
          </View>
          <VStack
            width={(10 / 100) * viewWidth}
            maxW={(10 / 100) * viewWidth}
            alignItems={"center"}
            flexDirection="column"
            flex={1}
          >
            <TouchableOpacity onPress={() => likeComment(item)}>
              <Ionicons
                name={isLiked ? "heart" : "heart-outline"}
                size={22}
                color={!isLiked ? colors.gray : colors.secondary}
                selectionColor={colors.secondary}
              />
            </TouchableOpacity>
            <Text fontSize="12" textAlign="center">
              {totalLike}
            </Text>
          </VStack>
        </HStack>
      </View>
    </KeyboardAvoidingView>
  );
};
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

export default React.memo(connect(mapStates, mapDispatch)(CommentItem));
