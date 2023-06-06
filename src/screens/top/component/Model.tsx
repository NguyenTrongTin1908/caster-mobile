import React, { useEffect, useState, useContext } from "react";
import { View, SafeAreaView, TouchableOpacity } from "react-native";
import {
  Box,
  HStack,
  Radio,
  Spacer,
  Text,
  Image,
  ScrollView,
  Button,
} from "native-base";
import { useNavigation } from "@react-navigation/core";
import { performerService } from "services/perfomer.service";
import { IPerformer } from "interfaces/performer";
import BackButton from "components/uis/BackButton";
import { colors } from "utils/theme";
import styles from "../style";
import { IBody, ICountry } from "interfaces/utils";
import { utilsService } from "services/utils.service";
import AdvancedFilter from "../../model/profile/component/AdvancedFilter";
import Carousel from "react-native-snap-carousel";
import { Dimensions } from "react-native";
import ButtonFollow from "components/uis/ButtonFollow";
import { connect } from "react-redux";
const { width } = Dimensions.get("window");

interface IProps {
  countries: ICountry[];
  bodyInfo: IBody;
  user: IPerformer;
}

const Model = ({ user }: IProps): React.ReactElement => {
  const [performers, setPerformers] = useState([] as Array<IPerformer>);
  const [top10Performers, setTop10Performers] = useState(
    [] as Array<IPerformer>
  );
  const [top25Performers, setTop25Performers] = useState(
    [] as Array<IPerformer>
  );
  const [top100Performers, setTop100Performers] = useState(
    [] as Array<IPerformer>
  );
  const [loading, setLoading] = useState(true);
  const [countries, setCountries] = useState([] as Array<ICountry>);
  const [bodyInfo, setBodyInfo] = useState([] as any);
  const [filter, setFilter] = useState({} as any);
  const [page, setPage] = useState(0);
  const [moreable, setMoreable] = useState(true);
  const [radioValue, setRadioValue] = useState("mostFollowed");
  const navigation = useNavigation() as any;
  const [activeIndex, setActiveIndex] = useState(0);
  const [total, setTotal] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [ranking, setRanking] = useState("mostFansPosition");

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
      headerTitleAlign: "center",
      title: "Top Caster",
      headerLeft: () => <BackButton />,
      headerRight: null,
    });
  }, [useContext]);

  useEffect(() => {
    async function loadData() {
      const [countries, bodyInfo] = await Promise.all([
        utilsService.countriesList(),
        utilsService.bodyInfo(),
      ]);
      setCountries(countries?.data);
      setBodyInfo(bodyInfo?.data);
    }

    loadData();
    setPerformers([]);
    setTop10Performers([]);
    setTop25Performers([]);
    setTop100Performers([]);
    loadTopPerformers();
    switch (radioValue) {
      case "mostFollowed":
        return setRanking("mostFansPosition");
      case "earningCurrentMonth":
        return setRanking("mostSupportedPosition");
      case "mostView":
        return setRanking("feedViewsPosition");
      default:
        return null;
    }
  }, [radioValue]);

  useEffect(() => {
    if (Object.keys(filter).length) {
      setPerformers([]);
      setTop10Performers([]);
      setTop25Performers([]);
      setTop100Performers([]);
      loadTopPerformers();
    }
  }, [filter]);

  const loadMorePerformers = async (more = false, refresh = false) => {
    if (more && !moreable) return;
    const newPage = more ? page + 1 : page;
    setPage(refresh ? 0 : newPage);
    const { data } = await performerService.search({
      offset: refresh ? 0 : newPage * 10,
      limit: 10,
      sortBy: radioValue,
      ...filter,
    });
    if (!refresh && data.length < 10) {
      setMoreable(false);
    }
    if (refresh && !moreable) {
      setMoreable(true);
    }
    setPerformers(refresh ? data : performers.concat(data));
    setHasMore(true);
  };
  const loadTopPerformers = async () => {
    setLoading(true);
    const dataTop10 = await performerService.search({
      offset: 0,
      limit: 10,
      sortBy: radioValue,
      ...filter,
    });
    setTop10Performers(dataTop10.data);
    const dataTop25 = await performerService.search({
      offset: 10,
      limit: 15,
      sortBy: radioValue,
      ...filter,
    });
    setTop25Performers(dataTop25.data);
    const dataTop100 = await performerService.search({
      offset: 25,
      limit: 75,
      sortBy: radioValue,
      ...filter,
    });
    setTop100Performers(dataTop100.data);
    setLoading(false);
  };

  const handleSubmit = async (value) => {
    setFilter({ ...filter, ...value });
  };
  const handleSubmitRadio = async (val: any) => {
    setRadioValue(val);
  };

  const _renderItem = ({ item, index, smallSize = false }) => {
    return (
      <TouchableOpacity>
        <View style={styles.rangeNumber}>
          <Text color={colors.lightText}>
            {item?.ranking ? item?.ranking[ranking] : ""}
          </Text>
        </View>
        <View style={styles.carouselItem} key={item._id}>
          <Image
            alt={"thumbnail-video"}
            key={item._id}
            style={styles.carouselImage}
            source={
              item?.avatar
                ? { uri: item.avatar }
                : require("../../../assets/avatar-default.png")
            }
          />
        </View>
        <View style={styles.itemTopName}>
          <Text
            numberOfLines={1}
            style={smallSize ? styles.textTopNameSmall : styles.textTopName}
          >
            {item.name}
          </Text>
          <Text
            style={smallSize ? styles.textTopNameSmall : styles.textTopName}
          >
            {" "}
            {item.stats.totalFollower || 0} Fans
          </Text>
        </View>
        <View style={styles.btnFollow}>
          <ButtonFollow
            isHideOnClick
            targetId={item._id}
            sourceId={user._id}
            isFollow={item.isFollowed}
            getPerformerList={() => {}}
          />
        </View>
      </TouchableOpacity>
    );
  };

  const _renderMoreItem = ({ item, index }) => {
    return (
      <TouchableOpacity>
        <View style={styles.rangeNumber}>
          <Text color={colors.lightText}>
            {item?.ranking ? item?.ranking[ranking] : ""}
          </Text>
        </View>
        <View style={styles.itemTopName}>
          <Text style={styles.textTopName}>{item.name}</Text>
          <Text style={styles.textTopName}>
            {" "}
            {item.stats.totalFollower || 0} Fans
          </Text>
        </View>
        <View style={styles.btnFollow}>
          <ButtonFollow
            isHideOnClick
            targetId={item._id}
            sourceId={user._id}
            isFollow={item.isFollowed}
            getPerformerList={() => {}}
          />
        </View>
      </TouchableOpacity>
    );
  };
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Box flex={1} mx="auto" w="100%">
        <ScrollView my={2}>
          <View>
            <HStack>
              <Radio.Group
                name="RadioGroupModel"
                value={radioValue}
                onChange={(val) => {
                  handleSubmitRadio(val);
                }}
                defaultValue="mostFollowed"
                style={styles.radioModel}
              >
                <Spacer direction="vertical">
                  <Radio value="mostFollowed">
                    <Text color={colors.lightText}>Most Followed</Text>
                  </Radio>
                  <Radio value="earningCurrentMonth">
                    <Text color={colors.lightText}>
                      Most Supported this month
                    </Text>
                  </Radio>
                  <Radio value="mostView">
                    <Text color={colors.lightText}>Most total views</Text>
                  </Radio>
                </Spacer>
              </Radio.Group>
              <View>
                <AdvancedFilter
                  onSubmit={handleSubmit}
                  countries={countries}
                  bodyInfo={bodyInfo}
                ></AdvancedFilter>
              </View>
            </HStack>
          </View>
          {!loading && top10Performers.length > 0 && (
            <>
              <View style={styles.range}>
                <Text color={colors.lightText}>1-10</Text>
              </View>
              <Carousel
                layout={"default"}
                data={top10Performers}
                sliderWidth={width}
                itemWidth={200}
                renderItem={(data) => _renderItem(data)}
                onSnapToItem={(index) => setActiveIndex(index)}
              />
            </>
          )}
          {!loading && top25Performers.length > 0 && (
            <>
              <View style={styles.range}>
                <Text color={colors.lightText}>11-25</Text>
              </View>
              <Carousel
                layout={"default"}
                data={top25Performers}
                sliderWidth={width}
                itemWidth={150}
                renderItem={(data) => _renderItem(data)}
                onSnapToItem={(index) => setActiveIndex(index)}
              />
            </>
          )}
          {!loading && top100Performers.length > 0 && (
            <>
              <View style={styles.range}>
                <Text color={colors.lightText}>26-100</Text>
              </View>
              <Carousel
                layout={"default"}
                data={top100Performers}
                sliderWidth={width}
                itemWidth={120}
                renderItem={(data) => _renderItem({ ...data, smallSize: true })}
                onSnapToItem={(index) => setActiveIndex(index)}
              />
            </>
          )}
          {hasMore && (
            <>
              <View style={styles.range}>
                <Text color={colors.lightText}>100+</Text>
              </View>
              <Carousel
                layout={"default"}
                data={performers}
                sliderWidth={width}
                itemWidth={100}
                renderItem={_renderMoreItem}
                onSnapToItem={(index) => setActiveIndex(index)}
              />
            </>
          )}
          {total && total > 100 ? (
            <View style={styles.btnLoadMore}>
              <Button
                onPress={() => {
                  loadMorePerformers(true, false);
                }}
              >
                Load More
              </Button>
            </View>
          ) : (
            <></>
          )}
        </ScrollView>
      </Box>
    </SafeAreaView>
  );
};

const mapStateToProp = (state: any) => ({
  user: state.user.current,
});

export default connect(mapStateToProp)(Model);
