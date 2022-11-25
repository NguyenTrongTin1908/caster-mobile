import {
  Button,
  Checkbox,
  Switch,
  Select,
  Row,
  Alert,
  Heading,
  View,
  Text,
} from "native-base";
import { TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { performerService } from "services/perfomer.service";
import { useNavigation } from "@react-navigation/core";
import { colors, Sizes, Fonts } from "utils/theme";
import styles from "./style";
import HeaderMenu from "components/tab/HeaderMenu";
import { useToast } from "native-base";
import { updateUser, updatePerformer } from "services/redux/user/actions";
import { streamService } from "services/stream.service";
import { PrivateRequest } from "components/stream/private-request";

import { IPerformer } from "src/interfaces";

import { SafeAreaView } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import AntDesign from "react-native-vector-icons/AntDesign";

const Option = Select;

interface IProps {
  error: any;
  currentUser: IPerformer;
  privateRequests: any[];
  updateUser: Function;
  updatePerformer: Function;
}

const PrivateChatWaitingRoom = ({
  error,
  currentUser,
  updatePerformer: handleUpdatePerformer,
  updateUser: handleUpdateUser,
  privateRequests,
}: IProps) => {
  let authenticate = true;

  let noredirect = true;
  const toast = useToast();

  const [isAvailable, setIsAvailable] = useState(0);
  const [privateChatPrice, setPrivateChatPrice] = useState(0);
  const [openInput, setOpenInput] = useState(false);
  const [isAccept, setIsAccept] = useState(false);
  const [isReset, setIsReset] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null) as any;

  const navigation = useNavigation() as any;

  useEffect(() => {
    if (currentUser) {
      setIsAvailable(currentUser.privateChat);
      setPrivateChatPrice(privateChatPrice);
    }
  }, []);

  const handleRedirect = () => {
    if (!selectedRequest) {
      toast.show({
        description: "Please select a user to join private chat",
      });
    }
    if (isAvailable) {
      return navigation.navigate("Blank");
    }
  };

  const handleDeline = () => {
    setIsReset(true);
  };

  const setPrice = () => {
    if (privateChatPrice <= 0) {
      return toast.show({
        description: "The price cannot be set lower than 0",
      });
    }
    handleUpdatePerformer({
      ...currentUser,
      ...{ privateChatPrice },
    });
    // Call the API to set the price
    return toast.show({ description: "Set the price successfully" });

    setOpenInput(false);
  };

  const togglePrivateChatStatus = async () => {
    const data = await streamService.togglePrivateChatStatus();
    if (data) {
      setIsAvailable(data.privateChat);
      handleUpdateUser({ ...currentUser, privateChat: data.privateChat });
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Heading
        mb={4}
        fontSize={30}
        textAlign="center"
        letterSpacing={-1}
        color={colors.lightText}
        bold
      >
        Create Private Room
      </Heading>
      <View style={styles.container}>
        <View style={styles.privatePriceChat}>
          <Text style={styles.privateChatText} color={colors.lightText}>
            {currentUser.privateChat}
          </Text>

          <Ionicons name="heart" color={colors.ruby} size={25}></Ionicons>
          <Text style={styles.privateChatText} color={colors.lightText}>
            {" "}
            / per minute
          </Text>

          <AntDesign
            onPress={() => navigation.navigate("EditProfile")}
            name="edit"
            color={colors.ruby}
            size={25}
          ></AntDesign>
        </View>
        <View style={styles.statusPrivateBox}>
          <TouchableOpacity
            activeOpacity={0.7}
            style={styles.statusPrivateButton}
            onPress={() => handleRedirect()}
            disabled={!isAccept}
          >
            <Text style={styles.subText}>
              {isAvailable
                ? "Available for Private Chat"
                : "Not Available for Private Chat"}
            </Text>
          </TouchableOpacity>
          <View style={styles.privatePriceChatSwitch}>
            <Text style={styles.subText}>
              {isAvailable ? "Available" : "Not Available"}
            </Text>

            <Switch
              isChecked={!!isAvailable}
              style={{ alignSelf: "center", marginTop: 20 }}
              onToggle={togglePrivateChatStatus}
            ></Switch>
          </View>
        </View>

        {privateRequests && privateRequests.length > 0 && (
          <>
            <View style={styles.notifySection}>
              <Text>Waiting for you to join</Text>
              {privateRequests.map((privateRequest) => (
                <PrivateRequest
                  privateRequest={privateRequest}
                  key={privateRequest.conversationId}
                  aria-label={privateRequest.conversationId}
                  onClick={() => {
                    setSelectedRequest(privateRequest);
                    setIsReset(true);
                  }}
                  selected={
                    selectedRequest &&
                    privateRequest.conversationId ===
                      selectedRequest.conversationId
                  }
                  istimeDeline={!isReset}
                  isChecked={
                    selectedRequest &&
                    privateRequest.conversationId ===
                      selectedRequest.conversationId
                  }
                />
              ))}
              <View>
                <Button disabled={!isReset} onPress={() => setIsReset(false)}>
                  On My Way
                </Button>
                <Text style={styles.textCenter}>Extend timer 2 minutes</Text>
              </View>
            </View>
            <View style={{ flex: 1 }}></View>

            <View style={styles.footerGolive}>
              <TouchableOpacity
                activeOpacity={0.7}
                style={[
                  styles.goliveButton,
                  {
                    opacity: isAccept ? 1 : 0.5,
                    backgroundColor: !isAccept ? colors.gray : colors.secondary,
                  },
                ]}
                onPress={() => handleRedirect()}
                disabled={!isAccept}
              >
                <Text style={styles.btnText}>Start Private Live Chat Now</Text>
              </TouchableOpacity>
              <View style={styles.termBox}>
                <Text style={styles.subText}>Term & Conditions</Text>
                <Checkbox
                  value="golive"
                  isChecked={isAccept}
                  onChange={() => setIsAccept(!isAccept)}
                >
                  <Text style={styles.subText}>Accept</Text>
                </Checkbox>
              </View>
            </View>
          </>
        )}
      </View>

      <HeaderMenu />
    </SafeAreaView>
  );
};

const mapStates = (state: any) => ({
  ui: { ...state.ui },
  currentUser: { ...state.user.current },
  privateRequests: state.streaming.privateRequests,
});
const mapDispatch = { updateUser, updatePerformer };

export default connect(mapStates, mapDispatch)(PrivateChatWaitingRoom);
