import { orderService } from "services/order.service";
import OrderSearchFilter from "components/order/search-filter";
import OrderTableList from "components/order/table-list";
import { connect } from "react-redux";
import { IPerformer } from "src/interfaces";
import React, { useEffect, useState } from "react";
import BackButton from "components/uis/BackButton";
import { Alert, View, Heading, Box } from "native-base";
import { SafeAreaView } from "react-native";
import HeaderMenu from "components/tab/HeaderMenu";
import { colors } from "utils/theme";

interface IProps {
  user: IPerformer;
}

const ModelOrderPage = ({ user }: IProps) => {
  const [searching, setSearching] = useState(false);
  const [pagination, setPagination] = useState({
    total: 0,
    current: 0,
    pageSize: 10,
  }) as any;
  const [list, setList] = useState([]) as any;
  const [limit] = useState(10) as any;
  const [filter, setFilter] = useState({}) as any;
  const [sortBy] = useState("createAt") as any;
  const [sort] = useState("desc") as any;

  useEffect(() => {
    search(pagination);
  }, [filter]);

  const handleTableChange = async (paginationState) => {
    setPagination({ ...pagination, current: paginationState.current });
    search({ ...pagination, current: paginationState.current });
  };

  const handleFilter = async (values) => {
    await setFilter({ ...filter, ...values });
  };

  const search = async (pagination: any) => {
    try {
      const { pageSize, current } = pagination;

      setSearching(true);
      const resp = await orderService.performerSearch({
        ...filter,
        limit: pageSize,
        offset: current * pageSize,
        sort,
        sortBy,
      });
      setSearching(false);
      await setList(resp.data.data);
      setPagination({ ...pagination, total: resp.data.total, pageSize: limit });
    } catch (e) {
      Alert("An error occurred, please try again!");
      setSearching(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Box flex={1} mx="auto" w="100%">
        <HeaderMenu />
        <Heading
          mb={4}
          fontSize={30}
          textAlign="center"
          color={colors.lightText}
          bold
        >
          My Orders
        </Heading>
        <View marginY={10}>
          <OrderSearchFilter onSubmit={handleFilter} />
        </View>

        <View marginY={10}>
          <OrderTableList
            user={user}
            dataSource={list}
            rowKey="_id"
            loading={searching}
            onChange={handleTableChange.bind(this)}
          />
        </View>
      </Box>
      <BackButton />
    </SafeAreaView>
  );
};

const mapStates = (state: any) => ({
  ui: state.ui,
  user: state.user.current,
});
export default connect(mapStates)(ModelOrderPage);
