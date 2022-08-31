import CommentItem from "./comment-item";
import { IComment, IUser } from "interfaces/index";
import { View } from "native-base";
import { FlatList } from "react-native";
import React, { useEffect, useState } from "react";
import {
  getComments,
  moreComment,
  createComment,
  deleteComment,
} from "services/redux/comment/actions";
import { connect } from "react-redux";


interface IProps {
  user: IUser;
  canReply?: boolean;
  item: any;
  getComments: Function;
  createComment: Function;
  commentMapping: any
}
const ListReplys = React.memo(
  ({item,
    canReply,
    commentMapping,
    getComments,
    createComment, }: IProps): React.ReactElement => {
    const renderItem = ({ item }) => {
      return <CommentItem canReply={canReply} key={item._id} item={item} />;
    };
    const [itemPerPage, setItemPerPage] = useState(6);
    const [commentPage, setCommentPage] = useState(0);
    useEffect(() => {
      getComments({
        objectId: item._id,
        objectType: "comment",
        limit: itemPerPage,
        offset: commentPage,
      });
    },[])

    const handleGetmore = async () => {
      setCommentPage(commentPage + 1);
       moreComment({
        objectId: item._id,
        objectType: "comment",
        limit: itemPerPage,
        offset: (commentPage + 1) * itemPerPage,
      });
    };

    const replys = commentMapping.hasOwnProperty(item._id)
      ? commentMapping[item._id].items
      : [];

    return (
      <View marginLeft="10">
        <FlatList
          data={replys}
          showsVerticalScrollIndicator={false}
          pagingEnabled={true}
          renderItem={renderItem}
          keyExtractor={(item) => item._id}
          style={{ width: "100%" }}
          onEndReachedThreshold={0.1}
          onEndReached={()=>handleGetmore()}
        />
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
export default connect (mapStates, mapDispatch)(ListReplys);
