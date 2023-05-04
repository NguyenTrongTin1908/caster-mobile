import React, { useEffect, useState } from "react";
import { View, SafeAreaView, Alert, TouchableOpacity } from "react-native";
import { Image, Box, FlatList, HStack, Radio, Spacer, Text } from "native-base";
import { useNavigation, useIsFocused } from "@react-navigation/core";
import BackButton from "components/uis/BackButton";
import { colors } from "utils/theme";
import styles from "../style";
import { IBody, ICountry } from "interfaces/utils";
import BadgeText from "components/uis/BadgeText";
import { IFeed } from "src/interfaces";
import { feedService } from "../../../services";

interface IProps {
  countries: ICountry[];
  bodyInfo: IBody;
}
const Video = ({}: IProps): React.ReactElement => {
  const [feeds, setFeeds] = useState([] as Array<IFeed>);
  const [feedLoading, setFeedLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [moreable, setMoreable] = useState(true);
  const [radioValue, setRadioValue] = useState("currentMonthViews");
  const navigation = useNavigation() as any;
  const isFocussed = useIsFocused();

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
      headerTitleAlign: "center",
      title: "Top Caster",
      headerLeft: () => <BackButton />,
      headerRight: null,
    });
    loadFeeds();
  }, [isFocussed]);

  useEffect(() => {
    if (radioValue) {
      loadFeeds();
    }
  }, [radioValue]);

  const loadFeeds = async (more = false, refresh = false) => {
    if (more && !moreable) return;
    try {
      setFeedLoading(true);
      const newPage = more ? page + 1 : page;
      setPage(refresh ? 0 : newPage);
      const { data } = await feedService.userSearch({
        offset: refresh ? 0 : newPage * 10,
        limit: 10,
        type: "video",
        sortBy: radioValue,
      });
      if (!refresh && data.data.length < 10) {
        setMoreable(false);
      }
      if (refresh && !moreable) {
        setMoreable(true);
      }
      setFeeds(refresh ? data.data : feeds.concat(data.data));
      setFeedLoading(false);
    } catch (error) {
      setFeedLoading(false);
      Alert.alert("Something went wrong");
    }
  };

  const handleSubmitRadio = async (val: any) => {
    setFeeds([]);
    setPage(0);
    setRadioValue(val);
  };
  const renderEmpty = () => (
    <View>
      {!feedLoading && !feeds.length && (
        <BadgeText content={"There is no performer available!"} />
      )}
    </View>
  );

  const handleRedirect = (Id) => {
    navigation.navigate("FeedDetail", {
      performerId: Id,
      type: "video",
    });
  };

  const renderItem = ({ item, index }: { item: IFeed; index: number }) => {
    return (
      <TouchableOpacity onPress={() => handleRedirect(item?._id)}>
        {item?.type === "video" ? (
          <View key={item._id}>
            <Image
              alt={"thumbnail-video"}
              key={item._id}
              style={styles.postImageStyle}
              source={
                item.files[0]
                  ? { uri: item.files[0].thumbnails[0] }
                  : require("../../../assets/bg.jpg")
              }
            />
          </View>
        ) : null}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Box flex={1} mx="auto" w="100%">
        <View
          style={{
            alignItems: "center",
            marginTop: 10,
          }}
        >
          <HStack>
            <Radio.Group
              name="RadioGroupModel"
              value={radioValue}
              onChange={(val) => {
                handleSubmitRadio(val);
              }}
              defaultValue="currentMonthViews"
              style={styles.radioModel}
            >
              <Spacer direction="vertical">
                <Radio value="currentMonthViews">
                  <Text color={colors.lightText}>This Month</Text>
                </Radio>
                <Radio value="lastMonthViews">
                  <Text color={colors.lightText}>Last Month</Text>
                </Radio>
                <Radio value="views">
                  <Text color={colors.lightText}>All Time</Text>
                </Radio>
              </Spacer>
            </Radio.Group>
          </HStack>
        </View>
        <FlatList
          data={feeds}
          renderItem={renderItem}
          numColumns={3}
          keyExtractor={(item, index) => item._id + "_" + index}
          onEndReachedThreshold={0.1}
          onEndReached={() => loadFeeds(true, false)}
          onRefresh={() => loadFeeds(false, true)}
          ListEmptyComponent={renderEmpty()}
          refreshing={feedLoading}
        />
      </Box>
    </SafeAreaView>
  );
};

export default Video;
