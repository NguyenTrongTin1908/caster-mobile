import CommentItem from "./comment-item";
import { IComment, IUser } from "interfaces/index";
import { Actionsheet, View, useDisclose, HStack, Image } from "native-base";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from "react-native";
import React from "react";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { colors } from "utils/theme";
import { CommentForm } from "./comment-form";

import { connect, useDispatch } from "react-redux";
interface IProps {
  comments: IComment[];
  onDelete?: Function;
  user: IUser;
  canReply?: boolean;
  isOpen?: boolean;
  showComment: Function;
  feed: any;
  moreComment: Function;
  createComment: Function;
  currentUser: IUser;
}
export const ListComments = ({
  comments,
  user,
  canReply,
  onDelete,
  showComment,
  feed,
  moreComment,
  createComment,
  currentUser,
}: IProps): React.ReactElement => {
  const { onOpen, isOpen, onClose } = useDisclose();
  const handleOpenComment = () => {
    showComment();
    onOpen();
  };
  const renderItem = ({ item }) => {
    return <CommentItem canReply={canReply} key={item._id} item={item} />;
  };

  const handleCreateComment = async (data) => {
    createComment(data);
  };
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
          <FlatList
            keyExtractor={(item) => item._id}
            data={comments}
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
            decelerationRate={"fast"}
            pagingEnabled={true}
            style={{ width: "100%" }}
            onEndReached={() => moreComment()}
          />
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
                creator={user}
                objectId={feed._id}
                objectType="feed"
                handleOnSubmit={handleCreateComment}
              ></CommentForm>
            </View>
          </HStack>
        </Actionsheet.Content>
      </Actionsheet>
    </View>
  );
};
const mapStates = (state: any) => {
  return {
    currentUser: state.user.current,
  };
};
export default React.memo(connect(mapStates)(ListComments));
