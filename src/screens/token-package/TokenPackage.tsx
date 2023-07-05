import React, { useContext, useState, useEffect } from "react";
import {
  ScrollView,
  Text,
  VStack,
  Box,
  Heading,
  Alert,
  Modal,
  Image,
  View,
  Button,
} from "native-base";
import { useNavigation } from "@react-navigation/core";
import { colors } from "utils/theme";
import TokenPackageCard from "./component/TokenPackageCard";
import { tokenPackageService } from "services/token-package.service";
import { paymentService } from "services/payment.service";
import BackButton from "components/uis/BackButton";
import ContentLoader from "react-native-easy-content-loader";
import { ITokenPackage } from "interfaces/token-package";
import { SafeAreaView, TouchableOpacity } from "react-native";
import HeaderMenu from "components/tab/HeaderMenu";
import { connect } from "react-redux";
import { IPerformer, ISettings } from "src/interfaces";
import { TextInput } from "react-native-gesture-handler";

interface IProps {
  user: IPerformer;
  system: any;
}

const TokenPackage = ({ user, system }: IProps): React.ReactElement => {
  const navigation = useNavigation() as any;
  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [useContext]);
  const [packages, setPackages] = useState([] as Array<ITokenPackage>);
  const [packageLoading, setPackageLoading] = useState(false);
  const [searching, setSearching] = useState(false);
  const [submiting, setSubmiting] = useState(false);
  const [list, setList] = useState([] as any);
  const [couponCode, setCouponCode] = useState("");
  const [isApliedCode, setisApliedCode] = useState(false);
  const [openPurchaseModal, setOpenPurchaseModal] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null) as any;
  const [paymentGateway, setPaymentGateway] = useState("stripe");
  const [coupon, setCoupon] = useState(null) as any;

  const loadPackages = async () => {
    setPackageLoading(true);
    const { data } = await tokenPackageService.search({
      sortBy: "ordering",
      sort: "asc",
      limit: "200",
    });

    setPackages(data);
    setPackageLoading(false);
  };

  useEffect(() => {
    loadPackages();
  }, []);

  const onChangepaymentGateway = (paymentGateway: string) => {
    setPaymentGateway(paymentGateway);
  };

  const search = async () => {
    try {
      setSearching(true);
      const resp = await tokenPackageService.search({
        limit: "200",
      });

      setSearching(false);
      setList(resp.data.data);
    } catch (e) {
      Alert("An error occurred, please try again!");
      setSearching(false);
    }
  };

  const purchaseTokenPackage = async () => {
    if (!user.stripeCardIds || !user.stripeCardIds.length) {
      Alert("Please add a payment card to complete your purchase");
      // Router.push("/user/cards");
      return;
    }
    try {
      setSubmiting(true);
      await paymentService.purchaseTokenPackage(selectedPackage._id, {
        paymentGateway,
        stripeCardId: user.stripeCardIds[0],
        couponCode: isApliedCode ? couponCode : null,
      });
      setOpenPurchaseModal(false);
    } catch (e) {
      const error = await e;
      Alert("Error occured, please try again later");
      setOpenPurchaseModal(false);
      setSubmiting(false);
    }
  };

  const applyCoupon = async () => {
    if (!couponCode) return;
    try {
      const resp = await paymentService.applyCoupon(couponCode);
      setisApliedCode(true);
      setCoupon(resp.data);
      Alert("Coupon is applied");
    } catch (error) {
      const e = await error;
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Box flex={1} mx="auto" w="100%">
        <Heading
          mb={4}
          fontSize={40}
          textAlign="center"
          letterSpacing={-1}
          color={colors.lightText}
          bold
        >
          Buy tokens
        </Heading>
        <ScrollView>
          <Box safeAreaX={4} safeAreaY={8} flex={1}>
            {packageLoading && <ContentLoader active avatar pRows={4} />}
            {!packageLoading &&
              packages?.length > 0 &&
              packages.map((item) => (
                <TokenPackageCard
                  key={item._id}
                  item={item}
                  onOpenModal={() => {
                    setOpenPurchaseModal(true),
                      setSelectedPackage(item),
                      setCouponCode(""),
                      setCoupon(null),
                      setisApliedCode(false);
                  }}
                />
              ))}
          </Box>
        </ScrollView>
        <HeaderMenu />
        <Modal
          isOpen={openPurchaseModal}
          onClose={() => {
            setOpenPurchaseModal(false);
          }}
        >
          <Modal.Content>
            <Modal.Header>
              <Text
                bold
                textAlign={"center"}
                fontSize={16}
                color={colors.primary}
              >
                Purchase Token Package
              </Text>
              <Text
                bold
                textAlign={"center"}
                fontSize={16}
                color={colors.primary}
              >
                {selectedPackage?.name}
              </Text>
            </Modal.Header>
            <Modal.CloseButton />
            <Modal.Body>
              <TouchableOpacity disabled={true}>
                <VStack flex={1} space={1} alignItems={"center"}>
                  <View alignItems={"center"}>
                    <Image
                      alt="avatar"
                      source={
                        user?.avatar
                          ? { uri: user?.avatar }
                          : require("../../assets/avatar-default.png")
                      }
                      width={60}
                      height={60}
                      borderRadius={50}
                    ></Image>
                    <Text>{user?.name || user?.username || "N/A"}</Text>
                  </View>
                  <View marginTop={5}>
                    <View>
                      {system.data.stripeEnable && (
                        <TouchableOpacity
                          onPress={() => onChangepaymentGateway("stripe")}
                        >
                          <Image
                            alt="stripe"
                            source={require("../../assets/stripe-card.png")}
                            width={200}
                            height={60}
                          ></Image>
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                  <View flexDirection={"row"} justifyContent={"flex-start"}>
                    <TextInput
                      placeholder="Enter coupon code here"
                      onChange={(e) => setCouponCode(e.target.toString())}
                    ></TextInput>
                    {!isApliedCode ? (
                      <Button
                        disabled={!couponCode}
                        onPress={applyCoupon.bind(this)}
                      >
                        Apply!
                      </Button>
                    ) : (
                      <Button
                        onPress={() => {
                          setisApliedCode(false),
                            setCouponCode(""),
                            setCoupon(null);
                        }}
                      >
                        Use Later!
                      </Button>
                    )}
                  </View>
                </VStack>
                <View marginTop={5}>
                  {paymentGateway === "stripe" &&
                  !user?.stripeCardIds?.length ? (
                    <Button>Please add a payment card</Button>
                  ) : (
                    <Button
                      disabled={submiting}
                      onPress={() => purchaseTokenPackage()}
                    >
                      Confirm purchase $
                      {coupon
                        ? (
                            selectedPackage?.price -
                            coupon.value * selectedPackage?.price
                          ).toFixed(2)
                        : selectedPackage?.price.toFixed(2)}{" "}
                      /
                      <img
                        alt="token"
                        src="/static/coin-ico.png"
                        height="15px"
                        style={{ margin: "0 3px" }}
                      />
                      {selectedPackage?.tokens}
                    </Button>
                  )}
                </View>
              </TouchableOpacity>
            </Modal.Body>
          </Modal.Content>
        </Modal>
      </Box>
      <BackButton />
    </SafeAreaView>
  );
};
const mapStates = (state: any) => ({
  user: { ...state.user.current },
  system: { ...state.system },
});

export default connect(mapStates)(TokenPackage);
