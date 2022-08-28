import CommentItem from "./comment-item";
import { IComment, IUser } from "interfaces/index";
import { View } from "native-base";
import { FlatList } from "react-native";
import React from "react";

interface IProps {
  comments: IComment[];
  total?: number;
  requesting: boolean;
  onDelete?: Function;
  user: IUser;
  canReply?: boolean;
  isOpen?: boolean;
  showComment: Function;
  feed: any;
}
export const ListReplys = ({
  comments,
  user,
  canReply,
  onDelete,
}: IProps): React.ReactElement => {
  const renderItem = ({ item }) => {
    return <CommentItem canReply={canReply} key={item._id} item={item} />;
  };
  return (
    <View marginLeft="10">
      <FlatList
        data={comments}
        showsVerticalScrollIndicator={false}
        pagingEnabled={true}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        style={{ width: "100%" }}
      />
    </View>
  );
};
export default React.memo(ListReplys);
