import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native";
import {
  Button,
  Heading,
  Image,
  ScrollView,
  Switch,
  Text,
  View,
} from "native-base";
import { useNavigation } from "@react-navigation/core";
import { IPerformer } from "interfaces/performer";
import BackButton from "components/uis/BackButton";
import { colors } from "utils/theme";
import styles from "./style";
import { IBody, ICountry } from "interfaces/utils";
import HeaderMenu from "components/tab/HeaderMenu";
import { connect } from "react-redux";
import Ionicons from "react-native-vector-icons/Ionicons";
import { shortenLargeNumber } from "lib/number";
import { earningService } from "services/earning.service";
import OrderSearchFilter from "components/order/search-filter";
import LoadingSpinner from "components/uis/LoadingSpinner";
import { DataTable, Card } from "react-native-paper";
import { ROLE_PERMISSIONS } from "../../constants";
import { TouchableOpacity } from "react-native-gesture-handler";

interface IProps {
  countries: ICountry[];
  bodyInfo: IBody;
  user: IPerformer;
}
const Wallet = ({ user }: IProps): React.ReactElement => {
  const [loading, setLoading] = useState(false);
  const [isDiamond, setIsDiamond] = useState(false);
  const [totalCashValue, setTotalCashValue] = useState(0);
  const [earning, setEarning] = useState([]);
  const [pagination, setPagination] = useState({
    total: 0,
    current: 0,
    pageSize: 10,
  });
  const [sortBy] = useState("createdAt");
  const [sort] = useState("desc");
  const navigation = useNavigation() as any;
  const [filter, setFilter] = useState({}) as any;
  const sortedItems = earning.slice();

  const getPerformerStats = async () => {
    try {
      setLoading(true);
      const resp = await earningService.performerStarts({
        isToken: true,
      });
      setLoading(false);
      resp.data && setTotalCashValue(resp.data.cashValue);
    } catch (error) {
      setLoading(false);
    }
  };

  const getData = async (pagination: any) => {
    try {
      const { pageSize, current } = pagination;
      setLoading(true);
      const earning = await earningService.performerSearch({
        ...filter,
        limit: pageSize,
        offset: current * pageSize,
        sort,
        sortBy,
      });
      setEarning(earning.data.data);
      setPagination({ ...pagination, total: earning.data.total });
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const handleFilter = async (values) => {
    await setFilter({ ...filter, ...values });
  };

  const handleTabsChange = async (paginationState) => {
    setPagination({ ...pagination, current: paginationState.current });
    getData({ ...pagination, current: paginationState.current });
  };

  useEffect(() => {
    getPerformerStats();
    getData(pagination);
  }, [filter]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Heading
        mb={4}
        fontSize={36}
        textAlign="center"
        color={colors.lightText}
        bold
      >
        My Wallet
      </Heading>
      <ScrollView flex={1} mx="auto" w="100%">
        <View style={styles.boxWallet}>
          <View
            minW={200}
            alignItems={"center"}
            flexDirection="column"
            textAlign="center"
          >
            <Image
              source={require("assets/gem.png")}
              alt={"avatar"}
              size={100}
              resizeMode="contain"
            />
            <Text color={colors.lightText} marginY={2} fontSize={20}>
              {user.rubyBalance > 0 ? shortenLargeNumber(user.rubyBalance) : 0}
            </Text>
            {/* <TouchableOpacity onPress={() => navigation.navigate("Blank")}>
              <Text color={colors.btnSecondaryColor} marginY={2} fontSize={20}>
                Purchase History
              </Text>
            </TouchableOpacity> */}
          </View>
          <Button
            maxH={20}
            alignSelf="center"
            colorScheme="secondary"
            onPress={() => navigation.navigate("TokenPackage")}
          >
            Add More
          </Button>
        </View>
        <View style={styles.boxWallet}>
          <View
            minW={200}
            alignItems={"center"}
            flexDirection="column"
            textAlign="center"
          >
            <View flexDirection="row">
              {isDiamond ? (
                <Image
                  source={require("assets/diamond.png")}
                  alt={"avatar"}
                  size={25}
                  resizeMode="contain"
                />
              ) : (
                <Text fontSize={18} color={colors.lightText}>
                  USD
                </Text>
              )}
              <Switch
                isChecked={!isDiamond}
                onToggle={() => setIsDiamond(!isDiamond)}
                aria-label="active"
                colorScheme="primary"
              />
            </View>
            {!isDiamond ? (
              <Ionicons
                name={"logo-usd"}
                size={93}
                color={colors.diamondIcon}
              />
            ) : (
              <Image
                source={require("assets/diamond.png")}
                alt={"avatar"}
                size={100}
                resizeMode="contain"
              />
            )}
            {isDiamond ? (
              <Text color={colors.lightText} marginY={2} fontSize={20}>
                {user.balance > 0 ? shortenLargeNumber(user.balance) : 0}
              </Text>
            ) : (
              <Text color={colors.lightText} marginY={2} fontSize={20}>
                {totalCashValue > 0 ? totalCashValue.toFixed(2) : 0}
              </Text>
            )}
          </View>
          {user.balance < 10000 && (
            <Button
              maxH={20}
              alignSelf="center"
              colorScheme="secondary"
              onPress={() => navigation.navigate("Blank")}
            >
              Cash Out
            </Button>
          )}
          {!user.roles.includes(ROLE_PERMISSIONS.ROLE_FAN_VERIFIED) &&
            user.balance >= 10000 && (
              <Button
                maxH={20}
                alignSelf="center"
                colorScheme="secondary"
                onPress={() => navigation.navigate("Blank")}
              >
                Cash Out
              </Button>
            )}
          {user.roles.includes(ROLE_PERMISSIONS.ROLE_FAN_VERIFIED) &&
            user.balance >= 10000 && (
              <Button
                maxH={20}
                alignSelf="center"
                colorScheme="secondary"
                onPress={() => navigation.navigate("Blank")}
              >
                Cash Out
              </Button>
            )}
        </View>
        <View marginY={5}>
          <OrderSearchFilter onSubmit={handleFilter} />
        </View>
        <Card>
          <DataTable>
            <DataTable.Header>
              <DataTable.Title>Date</DataTable.Title>
              <DataTable.Title>From</DataTable.Title>
              <DataTable.Title>Type</DataTable.Title>
              <DataTable.Title>Amount</DataTable.Title>
            </DataTable.Header>

            {sortedItems
              .slice(
                pagination.current * pagination.pageSize + 1,
                Math.min(
                  (pagination.current + 1) * pagination.pageSize,
                  pagination.total
                )
              )
              .map((item: any) => (
                <DataTable.Row key={item._id}>
                  <DataTable.Cell>{item.createdAt}</DataTable.Cell>
                  <DataTable.Cell>{item.userInfo.name}</DataTable.Cell>
                  <DataTable.Cell>{item.type}</DataTable.Cell>
                  <DataTable.Cell>{item.grossPrice}</DataTable.Cell>
                </DataTable.Row>
              ))}
            <DataTable.Pagination
              page={pagination.current}
              numberOfPages={Math.ceil(pagination.total / pagination.pageSize)}
              onPageChange={handleTabsChange}
              label={`${
                pagination.current * pagination.pageSize + 1
              }-${Math.min(
                (pagination.current + 1) * pagination.pageSize,
                pagination.total
              )} of ${pagination.total}`}
              numberOfItemsPerPageList={[pagination.pageSize]}
              numberOfItemsPerPage={pagination.pageSize}
              showFastPaginationControls
              selectPageDropdownLabel={"Rows per page"}
            />
          </DataTable>
        </Card>
        {loading && <LoadingSpinner />}
      </ScrollView>
      <HeaderMenu />
      <BackButton />
    </SafeAreaView>
  );
};
const mapStateToProp = (state: any) => ({
  user: state.user.current,
});

export default connect(mapStateToProp)(Wallet);
