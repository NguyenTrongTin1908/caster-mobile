import {
  Alert,
  Checkbox,
  Circle,
  HStack,
  Image,
  Input,
  KeyboardAvoidingView,
  ScrollView,
  Text,
  useToast,
  View,
  VStack,
} from "native-base";
import React, { useEffect, useRef, useState } from "react";
import {
  Dimensions,
  Platform,
  Animated,
  ViewProps,
  TouchableOpacity,
} from "react-native";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import { messageService } from "services/message.service";
import { colors, Fonts } from "utils/theme";
import Button from "../uis/Button";
import { giftService, tokenTransctionService } from "services/index";
import { SearchBar } from "react-native-elements/dist/searchbar/SearchBar";
import styles from "../comment/style";

interface Iprops {
  setModal: Function;
  modal: boolean;
  conversationId: string;
  performerId: string;
  favorGift: any;
  saveFavorite: Function;
}

export default function SendTip({
  setModal,
  modal,
  conversationId,
  performerId,
  favorGift,
  saveFavorite,
}: Iprops) {
  const { width, height } = Dimensions.get("window");
  const [favoriteGift, setFavoriteGift] = useState({});
  const [searching, setSearching] = useState(false);
  const [list, setList] = useState([] as any);
  const [token, setToken] = useState(0);
  const [giftFavorite, setGiftFavorite] = useState([] as any);
  const [isConfirm, setIsConfirm] = useState(true);
  const [isSave, setIsSave] = useState(false);
  const [giftID, setGiftID] = useState("");
  const [selectedId, setSelectedId] = useState(0);
  const [filter, setFilter] = useState({
    sortBy: "tokens",
    sort: "asc",
  } as any);

  const valueHiddenModal = height + 1200;
  const value = useRef(new Animated.Value(valueHiddenModal)).current;
  const toast = useToast();

  const fadeIn = () => {
    Animated.timing(value, {
      toValue: valueHiddenModal,
      duration: 500,
      useNativeDriver: false,
    }).start();
  };

  const fadeOut = () => {
    Animated.timing(value, {
      toValue: 0,
      duration: 500,
      useNativeDriver: false,
    }).start();
  };

  useEffect(() => {
    if (modal) {
      fadeOut();
    } else {
      fadeIn();
    }
  }, [modal]);
  useEffect(() => {
    search();
  }, []);

  const search = async () => {
    try {
      const resp = await giftService.search({ ...filter });
      setList(resp.data.data);
      console.log(favorGift);

      if (favorGift) {
        setToken(favorGift.tokens);
        setGiftID(favorGift._id);
        setIsSave(false);
        setSelectedId(favorGift._id);
      }
    } catch (e: any) {
      const error = await e;
      toast.show({
        description:
          error.message || "Something went wrong, please try again later",
      });
    }
  };

  const handleSendGift = async () => {
    if (isConfirm) {
      try {
        await tokenTransctionService.sendGift(performerId, {
          giftId: giftID,
          conversationId,
          streamType: "",
          sessionId: "",
        });
        toast.show({ description: "Send gift success" });
        console.log("gift Favorite : ", giftFavorite);
        saveFavorite(giftFavorite);
      } catch (e: any) {
        const error = await e;
        toast.show({ description: "Send gift success" });

        error?.message[0] === "giftId should not be empty"
          ? toast.show({ description: "Please select a gift" })
          : toast.show({ description: error.message, color: "error" });
      }
    } else {
      toast.show({
        description: "Please confirm before send gift !! ",
        color: "red",
      });
    }
  };

  return (
    <>
      {modal && (
        <Animated.View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width,
            height: height,
            zIndex: 100,
          }}
          onTouchStart={() => setModal(false)}
        />
      )}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "position"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 100 : -150}
        style={{
          position: "absolute",
          left: 0,
          width,
          bottom: 0,
          zIndex: modal ? 101 : -9,
        }}
      >
        <Animated.View
          style={{
            transform: [{ translateY: value }],
            borderTopLeftRadius: 15,
            borderTopRightRadius: 15,
            backgroundColor: "#f5f5f5",
            width,
            paddingBottom: 20,
          }}
        >
          <View style={{ zIndex: 9999 }}>
            <View flex={1} justifyContent="center" paddingY={5}>
              <ScrollView flex={1} horizontal={true}>
                {list.map((item, index) => (
                  <TouchableOpacity
                    onPress={() => {
                      setToken(item.tokens);
                      setGiftID(item._id);
                      setFavoriteGift(giftFavorite.push(item));
                      setIsSave(false);
                      setSelectedId(item._id);
                    }}
                    key={index}
                    style={{ paddingHorizontal: 10 }}
                  >
                    <Image
                      source={
                        item?.image.url
                          ? { uri: item?.image.url }
                          : require("../../assets/heart-purple.png")
                      }
                      alt={"avatar"}
                      size={10}
                      borderRadius={80}
                      resizeMode="cover"
                      style={selectedId === item._id ? styles.activeGift : null}
                    />

                    <Text
                      color={colors.secondary}
                      fontWeight="bold"
                      alignSelf={"center"}
                    >
                      {item.tokens}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            <View flex={1}>
              <View
                flexDirection={"row"}
                justifyContent="center"
                paddingBottom={5}
              >
                <Image
                  source={require("../../assets/ruby.png")}
                  alt={"avatar"}
                  size={10}
                  resizeMode="contain"
                  alignSelf={"center"}
                />
                <Text
                  color={colors.primary}
                  fontSize={20}
                  fontWeight="bold"
                  alignSelf={"center"}
                >
                  {token}
                </Text>
                <View paddingX={3}>
                  <Checkbox
                    aria-label="confirm"
                    isChecked={isConfirm}
                    value="cbconfirm"
                    onChange={() => setIsConfirm(!isConfirm)}
                  ></Checkbox>

                  <Text style={Fonts.blackColor16Bold}>Confirm</Text>
                </View>
              </View>

              <Button
                colorScheme="secondary"
                label="Send"
                w={100}
                h={50}
                px={5}
                alignItems="center"
                alignSelf="center"
                onPress={handleSendGift}
              />
            </View>
          </View>
        </Animated.View>
      </KeyboardAvoidingView>
    </>
  );
}
