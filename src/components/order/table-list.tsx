/* eslint-disable react/destructuring-assignment */
import {
  Button,
  Image,
  ScrollView,
  Tag,
  Text,
  Tooltip,
  View,
} from "native-base";
import { IOrder, IPerformer, IUser } from "src/interfaces";
import { formatDate } from "lib/date";
// import Link from "next/link";
import {
  Table,
  Row,
  Cell,
  TableWrapper,
  Rows,
} from "react-native-table-component";
import React, { useEffect, useState } from "react";
import { colors } from "utils/theme";
import styles from "./style";
import { Alert, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/core";
import FontAwesome from "react-native-vector-icons/FontAwesome";

interface IProps {
  dataSource: IOrder[];
  pagination: {};
  rowKey: string;
  loading: boolean;
  onChange: Function;
  user: IPerformer;
}

const OrderTableList = ({
  dataSource = [],
  pagination,
  rowKey,
  loading,
  onChange,
  user,
}: IProps): React.ReactElement => {
  const dataTable = [
    "orderNumber",
    "createdAt",
    "totalPrice",
    "productInfo",
    "_id",
  ];
  const tableHead = ["ID", "Date", "Rubies", "Item", "Action"];
  const [orderData, setOrderData] = useState([]) as any;
  const navigation = useNavigation() as any;

  const _alertIndex = (id) => {
    Alert.alert(`TODO go to ${id} details`);
  };

  const rederId = (data, index) => {
    const orderNumberIndex = dataTable.findIndex(
      (item) => item === "orderNumber"
    );
    if (orderNumberIndex === index) {
      return (
        <TouchableOpacity
          onPress={() => navigation.navigate("OrderDetailPage")}
        >
          <View style={styles.btn}>
            <Text style={styles.btnText}>{data || "N/A"}</Text>
          </View>
        </TouchableOpacity>
      );
    }
    const dateIndex = dataTable.findIndex((item) => item === "createdAt");
    if (dateIndex === index) {
      return (
        <View style={styles.btn}>
          <Text fontSize={13}>{formatDate(data)}</Text>
        </View>
      );
    }

    const tokenIndex = dataTable.findIndex((item) => item === "totalPrice");
    if (tokenIndex === index) {
      return (
        <View style={{ ...styles.btn, justifyContent: "space-around" }}>
          {/* <Image
            alt="coin"
            source={require("../../assets/icon.png")}
            width={20}
            height={20}
          /> */}
          <Text style={{ color: colors.darkText }}>
            {(data || 0).toFixed(2)}
          </Text>
          <FontAwesome name="heart" size={20} color={colors.primary} />
        </View>
      );
    }

    const IdIndex = dataTable.findIndex((item) => item === "_id");
    if (IdIndex === index) {
      return (
        <View style={styles.btn}>
          <TouchableOpacity
            style={{ backgroundColor: colors.gray }}
            onPress={() =>
              navigation.navigate("OrderDetailPage", {
                id: data,
              })
            }
          >
            <Text style={styles.btnText}>Details</Text>
          </TouchableOpacity>
        </View>
      );
    }

    // const totalPriceIndex = dataTable.findIndex(
    //   (item) => item === "totalPrice"
    // );
    // if (totalPriceIndex === index) {
    //   if (data <= 2) {
    //     return (
    //       <Text
    //         style={{
    //           color: "red",
    //         }}
    //       >
    //         {data}
    //       </Text>
    //     );
    //   }
    // }

    return data;
  };

  useEffect(() => {
    const array = [] as any;
    if (dataSource && dataSource.length > 0) {
      for (const item of dataSource) {
        const arrayData = dataTable.map((key: string) => {
          return item[key];
        });
        array.push(arrayData);
      }
    }
    setOrderData(array);
  }, [dataSource]);

  return (
    <ScrollView>
      <Table borderStyle={{ borderWidth: 2, borderColor: "#c8e1ff" }}>
        <Row data={tableHead} style={styles.head} textStyle={styles.textNoti} />
        {/* <Rows data={orderData} textStyle={{ color: "#fff" }} /> */}
        {orderData.map((rowData, index) => (
          <TableWrapper key={index} style={styles.row}>
            {rowData.map((cellData, cellIndex) => (
              <Cell
                key={cellIndex}
                data={rederId(cellData, cellIndex)}
                textStyle={{ color: "#000" }}
              />
            ))}
          </TableWrapper>
        ))}
      </Table>
    </ScrollView>
  );
};

export default OrderTableList;
