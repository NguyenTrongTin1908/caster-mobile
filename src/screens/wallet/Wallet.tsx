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
import { Table, Row, Cell, TableWrapper } from "react-native-table-component";
import { formatDate } from "lib/date";
import OrderSearchFilter from "components/order/search-filter";
import LoadingSpinner from "components/uis/LoadingSpinner";

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
    current: 1,
    pageSize: 10,
  });
  const [sortBy, setSortBy] = useState("createdAt");
  const [sort, setSort] = useState("desc");
  const [dataSource, setDataSource] = useState([]) as any;
  const tableHead = ["Date", "From", "Type", "Amount"];
  const dataTable = ["createdAt", "userInfo", "type", "grossPrice"];
  const navigation = useNavigation() as any;
  const [filter, setFilter] = useState({}) as any;

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

  const getData = async () => {
    try {
      const { current, pageSize } = pagination;
      setLoading(true);
      const earning = await earningService.performerSearch({
        ...filter,
        limit: pageSize,
        offset: (current - 1) * pageSize,
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

  const rederId = (data, index) => {
    const nameIndex = dataTable.findIndex((item) => item === "userInfo");
    if (nameIndex === index) {
      return (
        <View>
          <Text style={styles.textRow}>{data.name || "N/A"}</Text>
        </View>
      );
    }
    const dateIndex = dataTable.findIndex((item) => item === "createdAt");
    if (dateIndex === index) {
      return (
        <View>
          <Text style={styles.textRow}>{formatDate(data)}</Text>
        </View>
      );
    }
    const typeIndex = dataTable.findIndex((item) => item === "type");
    if (typeIndex === index) {
      return (
        <View>
          <Text style={styles.textRow}>{data}</Text>
        </View>
      );
    }
    const grossIndex = dataTable.findIndex((item) => item === "grossPrice");
    if (grossIndex === index) {
      return (
        <View>
          <Text style={styles.textRow}>{data}</Text>
        </View>
      );
    }
  };

  useEffect(() => {
    const array = [] as any;
    if (earning && earning.length > 0) {
      for (const item of earning) {
        const arrayData = dataTable.map((key: any) => {
          return item[key];
        });
        array.push(arrayData);
      }
    }
    setDataSource(array);
  }, [earning]);

  const handleFilter = async (values) => {
    await setFilter({ ...filter, ...values });
  };

  useEffect(() => {
    getPerformerStats();
    getData();
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
          <Button maxH={20} alignSelf="center" colorScheme="secondary">
            Cash Out
          </Button>
        </View>
        <View marginY={5}>
          <OrderSearchFilter onSubmit={handleFilter} />
        </View>
        <Table borderStyle={{ borderWidth: 2, borderColor: "#c8e1ff" }}>
          <Row
            data={tableHead}
            style={styles.head}
            textStyle={[styles.textNoti]}
          />
          {dataSource.map((rowData, index) => (
            <TableWrapper key={index} style={styles.row}>
              {rowData.map((cellData, cellIndex) => (
                <Cell key={cellIndex} data={rederId(cellData, cellIndex)} />
              ))}
            </TableWrapper>
          ))}
        </Table>
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
