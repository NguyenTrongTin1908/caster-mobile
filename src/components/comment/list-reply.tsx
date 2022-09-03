import CommentItem from "./comment-item";
import { IComment, IUser } from "interfaces/index";
import { View } from "native-base";
import { FlatList } from "react-native";
import React, { useEffect, useState } from "react";
import {
  moreComment,
  createComment,
  deleteComment,
} from "services/redux/comment/actions";
import { connect } from "react-redux";
import LoadingSpinner from "../uis/LoadingSpinner";
interface IProps {
  user: IUser;
  canReply?: boolean;
  item: any;
  createComment: Function;
  commentMapping: any;
  replys:any
}
const ListReplys = React.memo(
  ({
    item,
    canReply,
    commentMapping,
    createComment,
    replys
   }: IProps): React.ReactElement => {
    const renderItem = ({ item }) => {
      return <CommentItem canReply={canReply} key={item._id} item={item} />;
    };
    console.log('Vooooo Reply')
    const [itemPerPage, setItemPerPage] = useState(6);
    const [commentPage, setCommentPage] = useState(0);

    const handleGetmore = async () => {
      setCommentPage(commentPage + 1);
       moreComment({
        objectId: item._id,
        objectType: "comment",
        limit: itemPerPage,
        offset: (commentPage + 1) * itemPerPage,
      });
    };

    return (
      <View marginLeft="10">
       { commentMapping[item._id] && !commentMapping[item._id].requesting && <FlatList
          data={replys}
          showsVerticalScrollIndicator={false}
          pagingEnabled={true}
          renderItem={renderItem}
          keyExtractor={(item) => item._id}
          style={{ width: "100%" }}
          onEndReachedThreshold={0.1}
          onEndReached={()=>handleGetmore()}
        />
       }
      {(commentMapping[item._id] && commentMapping[item._id].requesting ) && <LoadingSpinner />}
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
  moreComment,
  deleteComment,
  createComment,
};
export default connect (mapStates, mapDispatch)(ListReplys);
