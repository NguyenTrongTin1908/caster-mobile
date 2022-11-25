import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { Box, FlatList, Button } from "native-base";
import PerformerCard from "components/message/PerformerCard";
import { followService } from "services/follow.service";
import BadgeText from "components/uis/BadgeText";
import LoadingSpinner from "components/uis/LoadingSpinner";
import { IFeed } from "interfaces/Feed";
import { connect } from "react-redux";
import styles from "./style";
interface IProps {
  route: {
    key: string;
    title: string;
    params: { performerId: string };
  };
  current: IFeed;
}
const Following = (props: IProps): React.ReactElement => {
  const { performerId: qString } = props.route.params;
  const [performers, setPerformers] = useState([] as Array<any>);
  const [performerLoading, setPerformerLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [moreable, setMoreable] = useState(true);
  const loadPerformers = async (more = false, q = "", refresh = false) => {
    if (more && !moreable) return;
    setPerformerLoading(true);
    const newPage = more ? page + 1 : page;
    setPage(refresh ? 0 : newPage);
    const { data } = await followService.searchFollowing({
      offset: refresh ? 0 : newPage * 10,
      limit: 10,
      sourceId: props.route.params.performerId
        ? props.route.params.performerId
        : "6245a9911ea6bb1b817e4874",
    });
    if (!refresh && data.length < 10) {
      setMoreable(false);
    }
    if (refresh && !moreable) {
      setMoreable(true);
    }
    setPerformers(refresh ? data.data : performers.concat(data.data));
    setPerformerLoading(false);
  };
  const renderEmpty = () => (
    <View>
      {!performerLoading && !performers.length && (
        <BadgeText content={"There is no performer available!"} />
      )}
    </View>
  );
  useEffect(() => {
    loadPerformers();
  }, []);

  return (
    <Box flex={1} mx="auto" w="100%">
      <FlatList
        data={performers}
        style={styles.listModel}
        renderItem={({ item }) =>
          item.targetInfo?._id && item.targetInfo._id !== props.current._id ? (
            <PerformerCard performer={item.targetInfo} />
          ) : null
        }
        keyExtractor={(item, index) => item._id + "_" + index}
        onEndReachedThreshold={0.5}
        onEndReached={() => loadPerformers(true, qString, false)}
        ListEmptyComponent={renderEmpty()}
      />
      {performerLoading && <LoadingSpinner />}
    </Box>
  );
};
const mapStateToProp = (state: any): any => ({
  ...state.user,
});
export default connect(mapStateToProp)(Following);
