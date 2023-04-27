import React, { useEffect, useState } from "react";
import { View, Image, Text } from "native-base";
import { Box, FlatList, Button, HStack } from "native-base";
import PerformerCard from "components/message/PerformerCard";
import { followService } from "services/follow.service";
import { performerService } from "services/perfomer.service";
import BadgeText from "components/uis/BadgeText";
import LoadingSpinner from "components/uis/LoadingSpinner";
import { IFeed } from "interfaces/feed";
import { connect } from "react-redux";
import styles from "./style";
import { IPerformer } from "../../../interfaces";
import ButtonFollow from "components/uis/ButtonFollow";
import { SafeAreaView, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/core";
interface IProps {
  route: {
    key: string;
    title: string;
    params: { performer: IPerformer };
  };
  current: IPerformer;
}
const Following = ({ current, route }: IProps): React.ReactElement => {
  const { performer } = route.params;
  const [performers, setPerformers] = useState([] as Array<any>);
  const [performerLoading, setPerformerLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [moreable, setMoreable] = useState(true);
  const navigation = useNavigation() as any;

  const loadFollowing = async (more = false, q = "", refresh = false) => {
    if (more && !moreable) return;
    try {
      setPerformerLoading(true);
      const newPage = more ? page + 1 : page;
      setPage(refresh ? 0 : newPage);
      const { data } = await followService.searchFollowing({
        offset: refresh ? 0 : newPage * 10,
        limit: 10,
        sourceId: performer._id,
      });
      if (!refresh && data.length < 10) {
        setMoreable(false);
      }
      if (refresh && !moreable) {
        setMoreable(true);
      }
      removeObjectById(data.data, current._id)
      setPerformers(refresh ? data.data : performers.concat(data.data));
      setPerformerLoading(false);
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

  const removeObjectById = (arr, id)=> {
    const objWithIdIndex = arr.findIndex((obj) => obj.targetInfo._id === id);
    if (objWithIdIndex > -1) {
      arr.splice(objWithIdIndex, 1);
    }
    return arr;
  }

  const handleRedirect = (perfomer) => {
    navigation.navigate("ModelProfile", {
      screen: "ModelProfile",
      performer: perfomer,
    });
  };

  const renderItem = ({ item, index }: { item: any; index: number }) => {
    return (
      <TouchableOpacity onPress={() => handleRedirect(item.targetInfo)}>
        <View key={item.targetInfo._id}>
          <Image
            key={item._id}
            style={styles.postImageStyle}
            alt="avatar"
            source={
              item.targetInfo.avatar
                ? { uri: item.targetInfo.avatar }
                : require("../../../assets/avatar-default.png")
            }
          />
        </View>
      </TouchableOpacity>
    );
  };
  useEffect(() => {
    loadFollowing();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Box flex={1} mx="auto" w="100%">
        <HStack height={150}>
          <View w="50%" style={styles.leftContainer}>
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
            <ButtonFollow
              isHideOnClick
              targetId={performer._id}
              sourceId={current._id}
              isFollow={performer.isFollowed}
              getPerformerList={() => {}}
            />
          </View>
          <View w="50%" style={styles.rightContainer}>
            <Text style={styles.text}>Following</Text>
            <Text style={styles.text}>{performer.stats.totalFollowing}</Text>
          </View>
        </HStack>
        <FlatList
          data={performers}
          numColumns={3}
          renderItem={renderItem}
          keyExtractor={(item, index) => item._id + "_" + index}
          onEndReachedThreshold={0.5}
          onEndReached={() => loadFollowing(true, performer._id, false)}
          onRefresh={() => loadFollowing(false, performer._id, true)}
          ListEmptyComponent={renderEmpty()}
          refreshing={performerLoading}
        />
      </Box>
    </SafeAreaView>
  );
};
const mapStateToProp = (state: any): any => ({
  ...state.user,
});
export default connect(mapStateToProp)(Following);
