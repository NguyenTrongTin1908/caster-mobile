/* eslint-disable react/destructuring-assignment */
import { Image, ScrollView, Text, View } from "native-base";
import { IOrder, IPerformer } from "src/interfaces";
import React, { useState } from "react";
import { colors } from "utils/theme";
import styles from "./style";
import { TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/core";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { DataTable, Card } from "react-native-paper";

interface IProps {
  dataSource: IOrder[];
  rowKey: string;
  loading: boolean;
  onChange: any;
  user: IPerformer;
}

const OrderTableList = ({
  dataSource = [],
  onChange,
}: IProps): React.ReactElement => {
  const navigation = useNavigation() as any;
  const [pagination, setPagination] = useState({
    total: 0,
    current: 1,
    pageSize: 10,
  });
  const [sortBy, setSortBy] = useState("createdAt");
  const [sort, setSort] = useState("desc");
  const [numberOfItemsPerPageList] = React.useState([5]);
  const [page, setPage] = React.useState<number>(0);
  const [itemsPerPage, onItemsPerPageChange] = React.useState(
    numberOfItemsPerPageList[0]
  );
  const sortedItems = dataSource.slice();
  const from = page * itemsPerPage;
  const to = Math.min((page + 1) * itemsPerPage, dataSource.length);

  return (
    <ScrollView>
      <Card>
        <DataTable>
          <DataTable.Header>
            <DataTable.Title>ID</DataTable.Title>
            <DataTable.Title>Date</DataTable.Title>
            <DataTable.Title>Rubies</DataTable.Title>
            <DataTable.Title>Item</DataTable.Title>
            <DataTable.Title>Action</DataTable.Title>
          </DataTable.Header>
          {sortedItems.slice(from, to).map((item: any) => (
            <DataTable.Row key={item._id}>
              <DataTable.Cell>{item.orderNumber}</DataTable.Cell>
              <DataTable.Cell>{item.createdAt}</DataTable.Cell>
              <DataTable.Cell>
                <View style={{ ...styles.btn, justifyContent: "space-around" }}>
                  <Image
                    alt="coin"
                    source={require("../../assets/ruby.png")}
                    width={20}
                    height={20}
                  />
                  <Text style={{ color: colors.darkText }}>
                    {(item.totalPrice || 0).toFixed(2)}
                  </Text>
                  <FontAwesome name="heart" size={20} color={colors.primary} />
                </View>
              </DataTable.Cell>
              <DataTable.Cell>{item.productInfo}</DataTable.Cell>
              <DataTable.Cell>
                <TouchableOpacity
                  style={{ backgroundColor: colors.gray }}
                  onPress={() =>
                    navigation.navigate("OrderDetailPage", {
                      id: item._id,
                    })
                  }
                >
                  <Text style={styles.btnText}>Details</Text>
                </TouchableOpacity>
              </DataTable.Cell>
            </DataTable.Row>
          ))}
          <DataTable.Pagination
            page={pagination.current}
            numberOfPages={Math.ceil(pagination.total / pagination.pageSize)}
            onPageChange={onChange}
            label={`${pagination.current * pagination.pageSize + 1}-${Math.min(
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
    </ScrollView>
  );
};

export default OrderTableList;
