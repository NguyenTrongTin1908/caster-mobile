import React, { useEffect, useState } from "react";
import { reactionService } from "services/reaction.service";
import { connect } from "react-redux";
import ListReplys from "./list-reply";
import CommentForm from "./comment-form";

import {
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
  currentUser: IUser;
  deleteComment: Function;
  createComment: Function;
}
const CommentItem = React.memo(
  ({
    item,
    canReply,
    currentUser,
    deleteComment,
    createComment,
  }: IProps): React.ReactElement => {
    const [isOpenReply, setOpenReply] = useState(false);
    const [isLiked, setLiked] = useState(item.isLiked);
    const [isReply, setReply] = useState(false);
    const [totalLike, setTotalLike] = useState(item.totalLike || 0);
    const viewWidth = Math.floor(width - 2 * 2);
    const handleCreateComment = async (values) => {
      createComment(values);
      setReply(false);
      setOpenReply(false);
      onOpenComment();
    };
    const onOpenComment = async () => {
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

    const handleDeleteComment = async () => {
      deleteComment(item._id);
    };
    return (
      // <TouchableOpacity onPress={()=>onOpenModal()}>
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
                        style={{ marginLeft: 3 }}
                      >
                        <Text color={colors.secondary}>View reply</Text>
                      </TouchableOpacity>
                    )}
                     {(item.creator._id === currentUser._id)  && <TouchableOpacity
                        onPress={handleDeleteComment}
                        style={{ marginLeft: 3 }}
                      >
                        <Text color={colors.darkGray}>Delete</Text>
                      </TouchableOpacity>
                      }
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
                    user={currentUser}
                    canReply={false}
                    item={item}
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
      // </TouchableOpacity>
    );
  }
);
const mapStates = (state: any) => {
  return {
    currentUser: state.user.current,
  };
};
const mapDispatch = {

  deleteComment,
  createComment,
};

export default connect(mapStates, mapDispatch)(CommentItem);
