import React, { useEffect, useState } from "react";
import { Image, View } from "native-base";
import { Box, Checkbox, FlatList, HStack, Text } from "native-base";
import PerformerCard from "components/message/PerformerCard";
import { followService } from "services/follow.service";
import BadgeText from "components/uis/BadgeText";
import LoadingSpinner from "components/uis/LoadingSpinner";
import { connect } from "react-redux";
import styles from "./style";
import { IFeed, IPerformer, IUser } from "src/interfaces";
import { colors, Fonts, Sizes } from "utils/theme";
import ButtonFollow from "components/uis/ButtonFollow";
import { TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/core";

interface IProps {
  route: {
    key: string;
    title: string;
    params: { performer: IPerformer };
  };
  current: IUser;
}

const Follower = ({ current, route }: IProps): React.ReactElement => {
  const { performer } = route.params;
  const [performers, setPerformers] = useState([] as Array<any>);
  const [performerLoading, setPerformerLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [moreable, setMoreable] = useState(true);
  const [isChecked, setIsChecked] = useState(false);
  const navigation = useNavigation() as any;

  useEffect(() => {
    handleFilterByFollower();
  }, [isChecked]);

  const loadFollower = async (more = false, q = "", refresh = false) => {
    if ((more && !moreable) || isChecked) return;
    try {
      setPerformerLoading(true);
      const newPage = more ? page + 1 : page;
      setPage(refresh ? 0 : newPage);
      const { data } = await followService.searchFollower({
        offset: refresh ? 0 : newPage * 6,
        limit: 6,
        targetId: performer._id,
      });
      if (!refresh && data.length < 6) {
        setMoreable(false);
      }
      if (refresh && !moreable) {
        setMoreable(true);
      }
      setPerformers(refresh ? data.data : performers.concat(data.data));
      setPerformerLoading(false);
    } catch (error) {
      setPerformerLoading(true);
    }
  };

  const handleFilterByFollower = async (
    more = false,
    q = "",
    refresh = false
  ) => {
    if (more && !moreable) return;
    try {
      setPerformerLoading(true);
      const newPage = 0;
      setPage(refresh ? 0 : newPage);
      const { data } = await followService.searchFollower({
        offset: refresh ? 0 : newPage * 6,
        limit: 6,
        targetId: performer._id,
      });

      if (!refresh && data.length < 6) {
        setMoreable(false);
      }
      if (refresh && !moreable) {
        setMoreable(true);
      }
      if (isChecked) {
        const listFollowFilter = performers.filter(
          (el) => el.sourceInfo.isFollowed === false
        );
        setPerformers(listFollowFilter);
        setPerformerLoading(false);
      } else {
        setPerformers(data.data);
        setPerformerLoading(false);
      }
    } catch (error) {
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
  const handleRedirect = (perfomer) => {
    navigation.navigate("ModelProfile", {
      screen: "ModelProfile",
      performer: perfomer,
    });
  };

  const renderItem = ({ item, index }: { item: any; index: number }) => {
    return (
      <TouchableOpacity onPress={() => handleRedirect(item.sourceInfo)}>
        <View key={item.sourceInfo._id}>
          <Image
            key={item._id}
            style={styles.postImageStyle}
            alt="avatar"
            source={
              item.sourceInfo.avatar
                ? { uri: item.sourceInfo.avatar }
                : require("../../../assets/avatar-default.png")
            }
          />
        </View>
      </TouchableOpacity>
    );
  };

  useEffect(() => {
    loadFollower();
  }, []);

  return (
    <Box flex={1} mx="auto" w="100%">
      <HStack my={2} height={150}>
        <View w="50%" flexDirection={"row"}>
          <View style={styles.leftContainer}>
            <Image
              source={
                performer?.avatar
                  ? { uri: performer?.avatar }
                  : require("../../../assets/avatar-default.png")
              }
              alt={"avatar"}
              size={100}
              borderRadius={80}
              resizeMode="cover"
            />
            <Text style={styles.text}>
              {performer.name || performer.username || "N/A"}
            </Text>
          </View>
          <View style={styles.leftContainer}>
            <ButtonFollow
              isHideOnClick
              targetId={performer._id}
              sourceId={current._id}
              isFollow={performer.isFollowed}
              getPerformerList={() => {}}
            />
          </View>
        </View>
        <View w="50%" style={styles.rightContainer}>
          <Text style={styles.text}>Fans</Text>
          <Text style={styles.text}>{performer.stats.totalFollower}</Text>
        </View>
      </HStack>
      <View style={styles.checkBoxFollow}>
        <Checkbox
          isInvalid
          value="invalid"
          onChange={() => setIsChecked(!isChecked)}
        >
          <Text color={colors.lightText} fontSize={"lg"}>
            Show only model not following
          </Text>
        </Checkbox>
      </View>
      <FlatList
        data={performers}
        numColumns={3}
        renderItem={renderItem}
        keyExtractor={(item, index) => item._id + "_" + index}
        onEndReachedThreshold={0.5}
        onEndReached={() => loadFollower(true, performer._id, false)}
        onRefresh={() => loadFollower(false, performer._id, true)}
        ListEmptyComponent={renderEmpty()}
        refreshing={performerLoading}
      />
      {performerLoading && <LoadingSpinner />}
    </Box>
  );
};
const mapStateToProp = (state: any): any => ({
  ...state.user,
});
export default connect(mapStateToProp)(Follower);
