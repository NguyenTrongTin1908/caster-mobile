import React, { useEffect, useState, useContext } from "react";
import { View, SafeAreaView } from "react-native";
import {
  Box,
  FlatList,
  Heading,
  HStack,
  Radio,
  Spacer,
  Text,
} from "native-base";
import { useNavigation } from "@react-navigation/core";
import PerformerCard from "components/message/PerformerCard";
import { performerService } from "services/perfomer.service";
import { IPerformer } from "interfaces/performer";
import LoadingSpinner from "components/uis/LoadingSpinner";
import BackButton from "components/uis/BackButton";
import { colors } from "utils/theme";
import styles from "./style";
import { IBody, ICountry } from "interfaces/utils";
import { utilsService } from "services/utils.service";
import AdvancedFilter from "./profile/component/AdvancedFilter";
import HeaderMenu from "components/tab/HeaderMenu";
import BadgeText from "components/uis/BadgeText";

interface IProps {
  countries: ICountry[];
  bodyInfo: IBody;
}
const Model = ({}: IProps): React.ReactElement => {
  const [performers, setPerformers] = useState([] as Array<IPerformer>);
  const [performerLoading, setPerformerLoading] = useState(true);
  const [countries, setCountries] = useState([] as Array<ICountry>);
  const [bodyInfo, setBodyInfo] = useState([] as any);
  const [filter, setFilter] = useState({} as any);
  const [page, setPage] = useState(0);
  const [moreable, setMoreable] = useState(true);
  const [radioValue, setRadioValue] = useState("mostFollowed");
  const navigation = useNavigation() as any;
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
  }, []);
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
    loadPerformers();
  }, [filter]);
  useEffect(() => {
    loadPerformers();
  }, [radioValue]);
  const loadPerformers = async (more = false, refresh = false) => {
    if (more && !moreable) return;
    setPerformerLoading(true);
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
    setPerformerLoading(false);
  };

  const handleSubmit = async (value) => {
    setPage(0);
    setPerformers([]);
    await setFilter({ ...filter, ...value });
  };
  const handleSubmitRadio = async (val: any) => {
    setPerformers([]);
    setPage(0);
    setRadioValue(val);
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
    <SafeAreaView style={{ flex: 1 }}>
      <Box flex={1} mx="auto" w="100%">
        <Heading
          mb={4}
          fontSize={36}
          textAlign="center"
          color={colors.lightText}
          bold
        >
          Top Caster
        </Heading>
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
        <FlatList
          data={performers}
          renderItem={({ item }) => (
            <PerformerCard performer={item} navigationScreen="ModelProfile" />
          )}
          keyExtractor={(item, index) => item._id + "_" + index}
          style={styles.listModel}
          onEndReachedThreshold={0.5}
          onEndReached={() => loadPerformers(true, false)}
          ListEmptyComponent={renderEmpty()}
          onRefresh={() => loadPerformers()}
          refreshing={performerLoading}
        />
        <HeaderMenu />
      </Box>
    </SafeAreaView>
  );
};

export default Model;
