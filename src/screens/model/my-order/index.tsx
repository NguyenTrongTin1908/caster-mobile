import { orderService } from "services/order.service";
import OrderSearchFilter from "components/order/search-filter";
import OrderTableList from "components/order/table-list";
import { connect } from "react-redux";
import { IPerformer, IUser } from "src/interfaces";
import { values, filter, sortBy } from "lodash";
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
  const [pagination, setPagination] = useState({}) as any;
  const [list, setList] = useState([]) as any;
  const [limit, setLimit] = useState(10) as any;
  const [filter, setFilter] = useState({}) as any;
  const [sortBy, setSortBy] = useState("createAt") as any;
  const [sort, setSort] = useState("desc") as any;

  useEffect(() => {
    search();
  }, []);
  useEffect(() => {
    search();
  }, [filter]);

  const handleTableChange = async (paginationState, filters, sorter) => {
    const pager = { ...paginationState };
    pager.current = pagination.current;

    setPagination(pager);
    setSortBy(
      sorter.field || "createdAt",
      sorter.order ? (sorter.order === "descend" ? "desc" : "asc") : "desc"
    );
    search(pager.current);
  };

  const handleFilter = async (values) => {
    await setFilter({ ...filter, ...values });
  };

  const search = async (page = 1) => {
    try {
      setSearching(true);
      const resp = await orderService.performerSearch({
        ...filter,
        limit,
        offset: (page - 1) * limit,
        sort,
        sortBy,
      });

      setSearching(false);
      const Data = [
        {
          orderNumber: "1",
          productInfo: "abc",
          totalPrice: 2,
          deliveryStatus: "ss",
          createdAt: Date.now(),
          _id: "1",
        },
        {
          orderNumber: "2",
          productInfo: "fff",
          totalPrice: 52,
          deliveryStatus: "ss",
          createdAt: Date.now(),
          _id: "2",
        },
      ];

      await setList(Data);
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
            pagination={pagination}
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
