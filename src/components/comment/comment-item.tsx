import React, { useState } from "react";
import { reactionService } from "services/reaction.service";
import { connect } from "react-redux";
import ListReplys from "./list-reply";
import CommentForm from "./comment-form";
import {
  createComment,
  deleteComment,
  getComments,
} from "services/redux/comment/actions";
import { View, VStack, HStack, Image, Flex, Text } from "native-base";
import { IPerformer, IComment } from "src/interfaces/index";
import { colors } from "utils/theme";
import { TouchableOpacity, Dimensions, Alert } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import AntDesign from "react-native-vector-icons/AntDesign";
import styles from "./style";
const { width } = Dimensions.get("window");
import ReplyForm from "./reply-form";

interface IProps {
  item: IComment;
  canReply?: boolean;
  currentUser: IPerformer;
  deleteComment: Function;
  createComment: Function;
  getComments: Function;
  onDelete: Function;
  handleReply: Function;
  commentMapping: any;
}
const CommentItem = React.memo(
  ({
    item,
    canReply,
    currentUser,
    createComment: createReply,
    getComments: getReplys,
    commentMapping,
    onDelete,
    handleReply,
  }: IProps): React.ReactElement => {
    const [isOpenReply, setOpenReply] = useState(false);
    const [isLiked, setLiked] = useState(item.isLiked);
    const [isReply, setReply] = useState(false);
    const [isDelete, setDelete] = useState(false);
    const [totalLike, setTotalLike] = useState(item.totalLike || 0);
    const viewWidth = Math.floor(width - 2 * 2);
    const replys = commentMapping.hasOwnProperty(item._id)
      ? commentMapping[item._id].items
      : [];

    const onOpenReply = async (canOpen = true) => {
      getReplys({
        objectId: item._id,
        objectType: "comment",
        limit: 0,
        offset: 0,
      });
      canOpen && setOpenReply(!isOpenReply);
    };

    const handleLike = async (comment) => {
      try {
        if (!isLiked) {
          await reactionService.create({
            objectId: comment._id,
            action: "like",
            objectType: "comment",
          });
          setLiked(!isLiked);
          setTotalLike(totalLike + 1);
        }
      } catch (e) {}
    };

    const handledisLike = async (comment) => {
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
    const handleDelete = async () => {
      Alert.alert(
        "Delete Item",
        "Are you sure you want to delete this item ?",
        [
          {
            text: "Cancel",
            onPress: () => {},
            style: "cancel",
          },
          {
            text: "OK",
            onPress: () => {
              onDelete(item);
              setDelete(true);
            },
          },
        ]
      );
    };

    return (
      <>
        {!isDelete && (
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
                      {item?.creator?.name || item?.creator?.username || ""}
                    </Text>
                    <Text fontSize={"md"} marginLeft="2" max-width={"100%"}>
                      {item?.content}
                    </Text>
                    <HStack>
                      {canReply && (
                        <TouchableOpacity
                          onPress={() => {
                            setReply(!isReply);
                            handleReply(item);
                          }}
                          style={styles.optionCommentItem}
                        >
                          <Text color={colors.secondary}>Reply</Text>
                        </TouchableOpacity>
                      )}
                      {canReply && (
                        <TouchableOpacity
                          onPress={() => onOpenReply()}
                          style={styles.optionCommentItem}
                        >
                          <Text color={"blue.300"}>
                            {!isOpenReply ? "View Reply" : "Hide Reply"}
                          </Text>
                        </TouchableOpacity>
                      )}
                      {item?.creator?._id === currentUser._id && (
                        <TouchableOpacity
                          onPress={() => handleDelete()}
                          style={[
                            styles.optionCommentItem,
                            { flexDirection: "row" },
                          ]}
                        >
                          <AntDesign
                            name={"delete"}
                            size={20}
                            color={colors.gray}
                          />
                          <Text color={colors.darkGray}>Delete</Text>
                        </TouchableOpacity>
                      )}
                    </HStack>
                  </VStack>
                </Flex>
                {isOpenReply && (
                  <View>
                    <ListReplys
                      user={currentUser}
                      canReply={false}
                      item={item}
                      replys={replys}
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
                <TouchableOpacity onPress={() => handleLike(item)}>
                  <AntDesign name={"like2"} size={20} color={colors.gray} />
                </TouchableOpacity>
                {totalLike ? (
                  <Text fontSize="12" textAlign="center">
                    {totalLike}
                  </Text>
                ) : (
                  <Ionicons name={"heart"} size={20} color={colors.gray} />
                )}

                <TouchableOpacity onPress={() => handledisLike(item)}>
                  <AntDesign name={"dislike2"} size={20} color={colors.gray} />
                </TouchableOpacity>
              </VStack>
            </HStack>
          </View>
        )}
      </>
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
  deleteComment,
  createComment,
};
export default connect(mapStates, mapDispatch)(CommentItem);
