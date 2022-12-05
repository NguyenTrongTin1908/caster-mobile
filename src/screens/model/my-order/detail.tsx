import {
  Alert,
  Heading,
  View,
  Text,
  Box,
} from "native-base";
import React, { useEffect, useState } from "react";
import { IOrder } from "src/interfaces";
import { orderService } from "services/order.service";
import { connect } from "react-redux";
import { SafeAreaView } from "react-native";
import HeaderMenu from "components/tab/HeaderMenu";
import { colors } from "utils/theme";
import styles from "./style";
import BackButton from "components/uis/BackButton";
interface IProps {
  route: {
    params: {
      id: any;
    };
  };
}

const OrderDetailPage = ({ route }: IProps): React.ReactElement => {

  const [submitting, setSubmitting] = useState(false);
  const [order, setOrder] = useState(null) as any;
  const [shippingCode, setShippingCode] = useState("");
  const [deliveryStatus, setDeliveryStatus] = useState("") as any;

  useEffect(() => {
    getData();
  }, []);

  const onUpdate = async () => {
    if (!shippingCode) {
      Alert("Missing shipping code");
      return;
    }
    try {
      setSubmitting(true);
      await orderService.update(route.params.id, {
        deliveryStatus,
        shippingCode,
      });
      Alert("Changes saved.");
    } catch (e) {
      setSubmitting(false);
    }
  };

  const getData = async () => {
    try {
      const order = await orderService.findById(route.params.id);

      setOrder(order.data);
      setShippingCode("");
      setDeliveryStatus("ss");
    } catch (e) {
      Alert("Can not find order!");
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
          Order Details
        </Heading>
        <View marginTop={20}>
          <View
            backgroundColor={colors.lightGray}
            w="100%"
            alignSelf={"center"}
            h="80%"
            alignContent={"center"}
          >
            <View style={styles.orderItem}>
              <Text style={styles.orderTitleText}>Product Info :</Text>
              <Text style={styles.orderText}>
                {order?.productInfo?.name || "N/A"}
              </Text>
            </View>
            <View style={styles.orderItem}>
              <Text style={styles.orderTitleText}>Type :</Text>
              <Text style={styles.orderText}>
                {order?.productInfo?.type || "N/A"}
              </Text>
            </View>
            <View style={styles.orderItem}>
              <Text style={styles.orderTitleText}>Unit Price :</Text>
              <Text style={styles.orderText}>{order?.unitPrice || "N/A"}</Text>
            </View>
            <View style={styles.orderItem}>
              <Text style={styles.orderTitleText}>Quantity :</Text>
              <Text style={styles.orderText}>{order?.quantity || "0"}</Text>
            </View>
            <View style={styles.orderItem}>
              <Text style={styles.orderTitleText}>Total Price :</Text>
              <Text style={styles.orderText}>{order?.totalPrice || "N/A"}</Text>
            </View>
            <View style={styles.orderItem}>
              <Text style={styles.orderTitleText}>Delivery Address :</Text>
              <Text style={styles.orderText}>
                {order?.deliveryAddress || "N/A"}
              </Text>
            </View>
          </View>
        </View>
      </Box>
      <BackButton />
    </SafeAreaView>
  );
};

const mapStates = (state: any) => ({
  ui: state.ui,
});

export default connect(mapStates)(OrderDetailPage);
