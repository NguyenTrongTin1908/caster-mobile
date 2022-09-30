import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { Box, Checkbox, FlatList, Text } from "native-base";
import PerformerCard from "components/message/PerformerCard";
import { followService } from "services/follow.service";
import { IPerformer } from "interfaces/performer";
import BadgeText from "components/uis/BadgeText";
import LoadingSpinner from "components/uis/LoadingSpinner";
import { connect } from "react-redux";
import { IFeed } from "interfaces/Feed";
import styles from "./style";
import { IUser } from "src/interfaces";
import { colors, Fonts, Sizes } from "utils/theme";

interface IProps {
  route: {
    key: string;
    title: string;
    params: { performerId: string };
  };
  current: IUser;
  // OnFilterByFollower : Function

}

const Follower = (props: IProps): React.ReactElement => {
  const { performerId: qString } = props.route.params;
  const [performers, setPerformers] = useState([] as Array<any>);
  const [performerLoading, setPerformerLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [moreable, setMoreable] = useState(true);
  const [isChecked, setIsChecked] = useState(false);

  useEffect(() => {
    loadPerformers();
  }, []);

  useEffect(() => {
    handleFilterByFollower()

  }, [isChecked]);

  const loadPerformers = async (more = false, q = "", refresh = false) => {
    if (more && !moreable || isChecked) return;
    setPerformerLoading(true);
    const newPage = more ? page + 1 : page;
    setPage(refresh ? 0 : newPage);
    const { data } = await followService.searchFollower({
      offset: refresh ? 0 : newPage * 6,
      limit: 6,
      targetId: props.route.params.performerId
        ? props.route.params.performerId
        : props.current._id,
    });
    if (!refresh && data.length < 6) {
      setMoreable(false);
    }
    if (refresh && !moreable) {
      setMoreable(true);
    }
    setPerformers(refresh ? data.data : performers.concat(data.data));
    setPerformerLoading(false);
  };

  const handleFilterByFollower = async (more = false, q = "", refresh = false ) => {
    if (more && !moreable) return;
    setPerformerLoading(true);
    const newPage = 0;
    setPage(refresh ? 0 : newPage);
    const { data } = await followService.searchFollower({
      offset: refresh ? 0 : newPage * 6,
      limit: 6,
      targetId: props.route.params.performerId
        ? props.route.params.performerId
        : props.current._id,
    });

    if (!refresh && data.length < 6) {
      setMoreable(false);
    }
    if (refresh && !moreable) {
      setMoreable(true);
    }
    if (isChecked) {
      const listFollowFilter = performers.filter((el) => el.sourceInfo.isFollowed === false);
      setPerformers(listFollowFilter );
      setPerformerLoading(false);

    }
    else {
      setPerformers(data.data );
      setPerformerLoading(false);
    }

  };
  const renderEmpty = () => (
    <View>
      {!performerLoading && !performers.length && (
        <BadgeText content={"There is no performer available!"} />
      )}
    </View>
  );

  return (
    <Box flex={1} mx="auto" w="100%">
      <View style={styles.checkBoxFollow}>
      <Checkbox  isInvalid value="invalid" onChange={()=>setIsChecked(!isChecked)}>
       <Text color={colors.lightText} fontSize={"lg"}>Show only model not following</Text>
      </Checkbox>

      </View>

      <View style={{marginVertical:Sizes.fixPadding * 5}}>

      <FlatList
        data={performers}
        renderItem={({ item }) =>
          item.sourceInfo?._id && item.sourceInfo._id !== props.current._id ? (
            <PerformerCard performer={item.sourceInfo} />
          ) : null
        }
        keyExtractor={(item, index) => item._id + "_" + index}
        onEndReachedThreshold={0.5}
        onEndReached={() => loadPerformers(true, qString, false)}
        ListEmptyComponent={renderEmpty()}
      />
      </View>

      {performerLoading && <LoadingSpinner />}
    </Box>
  );
};
const mapStateToProp = (state: any): any => ({
  ...state.user,
});
export default connect(mapStateToProp)(Follower);
