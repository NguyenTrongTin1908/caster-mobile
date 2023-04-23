import React, { useEffect, useState } from "react";
import { View, Image, TouchableOpacity } from "react-native";
import { IFeed } from "interfaces/feed";
import BadgeText from "components/uis/BadgeText";
import LoadingSpinner from "components/uis/LoadingSpinner";
import { feedService } from "services/feed.service";
import { Sizes } from "../../../constants/styles";
import styles from "./style";
import { ScrollView } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/core";
import { FlatList, Text } from "native-base";
interface IProps {
  route: {
    key: string;
    title: string;
    params: { performerId: string };
  };
}
const Video = ({ route }: IProps) => {
  const [feeds, setfeeds] = useState([] as Array<any>);
  const [feedLoading, setfeedLoading] = useState(true);
  const [page, setPage] = useState(0);
  const navigation = useNavigation() as any;
  const [moreable, setMoreable] = useState(true);
  useEffect(() => {
    loadBookmarkPosts();
  }, []);
  const loadBookmarkPosts = async (more = false, refresh = false) => {
    if (more && !moreable) return;
    try {
      setfeedLoading(true);
      const newPage = more ? page + 1 : page;
      setPage(refresh ? 0 : newPage);
      const { data } = await feedService.getBookmark({
        offset: refresh ? 0 : newPage * 100,
        limit: 100,
      });
      setfeedLoading(false);

      if (!refresh && data.length < 100) {
        setMoreable(false);
      }
      if (refresh && !moreable) {
        setMoreable(true);
      }

      let videoData = data.data.filter(
        (item) => item?.objectInfo?.type !== "photo"
      );

      setfeeds(refresh ? videoData : feeds.concat(videoData));
    } catch (err) {
      const error = await Promise.resolve(err);
      return null;
    }
  };
  const renderEmpty = () => (
    <View>
      {!feedLoading && !feeds.length && (
        <BadgeText content={"There is no feed available!"} />
      )}
    </View>
  );
  const renderItem = ({ item, index }: { item: IFeed; index: number }) => {
    return (
      <TouchableOpacity
        onPress={() => handleRedirect(item?.objectInfo.fromSourceId)}
      >
        {item?.objectInfo?.type === "video" ? (
          <View key={item._id}>
            <Image
              key={item._id}
              style={styles.postImageStyle}
              source={
                item.objectInfo?.files[0].thumbnails[0]
                  ? { uri: item.objectInfo?.files[0].thumbnails[0] }
                  : require("../../../assets/bg.jpg")
              }
            />
          </View>
        ) : null}
      </TouchableOpacity>
    );
  };

  const handleRedirect = (Id) => {
    navigation.navigate("FeedDetail", {
      performerId: Id,
      type: "video",
    });
  };

  return (
    <ScrollView>
      <View
        style={{
          marginHorizontal: Sizes.fixPadding - 15.0,
          flexDirection: "column",
          flexWrap: "wrap",
          marginVertical: 5,
        }}
      >
        <FlatList
          data={feeds}
          renderItem={renderItem}
          numColumns={3}
          keyExtractor={(item, index) => item._id + "_" + index}
          onEndReachedThreshold={0.1}
          onEndReached={() => loadBookmarkPosts(true, false)}
          onRefresh={() => loadBookmarkPosts(false, true)}
          ListEmptyComponent={renderEmpty()}
          refreshing={feedLoading}
        />
      </View>
      {feedLoading && <LoadingSpinner />}
    </ScrollView>
  );
};
export default Video;
