import {
  Alert,
  Input,
  Select,
  Button,
  Tag,
  Heading,
  View,
  Text,
  Box,
} from "native-base";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import React, { useEffect, useState } from "react";

import { IOrder } from "src/interfaces";
import { orderService } from "services/order.service";
import { connect } from "react-redux";
import { SafeAreaView } from "react-native";
import HeaderMenu from "components/tab/HeaderMenu";
import { colors } from "utils/theme";
import styles from "./style";

// import { getResponseError } from "lib/utils";

// const { Item } = Descriptions;
interface IProps {
  route: {
    params: {
      id: any;
    };
  };
}

interface IStates {
  submiting: boolean;
  order: IOrder;
  shippingCode: string;
  deliveryStatus: string;
}

const OrderDetailPage = ({ route }: IProps): React.ReactElement => {
  const authenticate = true;

  const onlyPerformer = true;

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
      // await this.setState({ submiting: true });
      setSubmitting(true);
      await orderService.update(route.params.id, {
        deliveryStatus,
        shippingCode,
      });
      Alert("Changes saved.");
      // Router.back();
    } catch (e) {
      // Alert(getResponseError(e));
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
        {/* {order && ( */}
        <View marginTop={20}>
          {/* <Descriptions>
            <Item key="name" label="Product">
              {order?.productInfo?.name || "N/A"}
            </Item>
            <Item key="description" label="Description">
              {order?.productInfo?.name || "N/A"}
            </Item>
            <Item key="productType" label="Product type">
              <Tag color="orange">{order?.productInfo?.type || "N/A"}</Tag>
            </Item>
            <Item key="unitPrice" label="Unit price">
              <img src="/static/coin-ico.png" width="20px" alt="coin" />
              {order?.unitPrice}
            </Item>
            <Item key="quantiy" label="Quantity">
              {order?.quantity || "0"}
            </Item>
            <Item key="originalPrice" label="Total Price">
              <img src="/static/coin-ico.png" width="20px" alt="coin" />
              {order?.totalPrice}
            </Item>
          </Descriptions> */}

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

          {/* <View>
              <Image source={re } width="20px" alt="coin" />
            <Text >

              {order?.unitPrice}
              </Text>

            </View>
            <View>
            <Text >

            Quantity: {order?.quantity || "0"}
              </Text>

            </View>
            <View>
              <img src="/static/coin-ico.png" width="20px" alt="coin" />
            <Text >

            Total Price: {order?.totalPrice || "N/A"}
              </Text>

              <Text >
                Delivery Address: {order?.deliveryAddress || "N/A"}
              </Text>
            </View>
          </View> */}
          {/* {order?.productInfo?.type === "physical" ? ( */}
          {/* <View style={{ marginBottom: 10 }}>
              <Text color={colors.lightText}>
                Delivery Address: {order?.deliveryAddress || "N/A"}
              </Text>
            </View> */}
          {/* <View style={{ marginBottom: 10 }}>
              <Text>Shipping Code:</Text>
              <Input
                placeholder="Enter shipping code here"
                defaultValue={order?.shippingCode || "N/A"}
                onChange={(e) => setShippingCode(e.target.toString())}
              />
            </View> */}
          {/* <View style={{ marginBottom: 10 }}>
              <Text>Delivery Status: </Text> */}
          {/* <Select
                onValueChange={(e) => {
                  setDeliveryStatus(e);
                }}
                defaultValue={order?.deliveryStatus || "N/A"}
                disabled={submiting || order.deliveryStatus === "refunded"}
                style={{ minWidth: 120 }}
              >
                <Select.Item
                  label="processing"
                  key="processing"
                  value="processing"
                >
                  Processing
                </Select.Item>

                <Select.Item key="shipping" label="shipping" value="shipping">
                  Shipping
                </Select.Item>
                <Select.Item
                  key="delivered"
                  label="delivered"
                  value="delivered"
                >
                  Delivered
                </Select.Item>
                <Select.Item key="refunded" label="refunded" value="refunded">
                  Refunded
                </Select.Item>
              </Select> */}
          {/* <View style={{ marginBottom: 10 }}>
              <Button onPress={onUpdate} disabled={submitting}>
                Update
              </Button> */}
        </View>
        {/* ) : (
            <View style={{ marginBottom: "10px" }}>
              Delivery Status: <Tag color="green">Delivered</Tag>
            </View>
          )} */}
        {/* </View> */}
      </Box>
    </SafeAreaView>
  );
};

const mapStates = (state: any) => ({
  ui: state.ui,
});

export default connect(mapStates)(OrderDetailPage);
