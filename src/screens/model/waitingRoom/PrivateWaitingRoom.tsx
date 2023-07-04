import { Button, Checkbox, Switch, Heading, View, Text } from "native-base";
import { TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useNavigation } from "@react-navigation/core";
import { colors, Sizes, Fonts } from "utils/theme";
import styles from "./style";
import HeaderMenu from "components/tab/HeaderMenu";
import { useToast } from "native-base";
import { updateUser, updatePerformer } from "services/redux/user/actions";
import { streamService } from "services/stream.service";
import { PrivateRequest } from "components/stream/private-request";
import { IPerformer, ISettings } from "src/interfaces";
import { SafeAreaView } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import AntDesign from "react-native-vector-icons/AntDesign";
import BackButton from "components/uis/BackButton";
import { performerService } from "services/index";
import { ROLE_PERMISSIONS } from "../../../constants";

interface IProps {
  error: any;
  currentUser: IPerformer;
  privateRequests: any[];
  updateUser: Function;
  updatePerformer: Function;
  system: any;
}

const PrivateChatWaitingRoom = ({
  error,
  currentUser,
  updatePerformer: handleUpdatePerformer,
  updateUser: handleUpdateUser,
  privateRequests,
  system,
}: IProps) => {
  const toast = useToast();
  const [isAvailable, setIsAvailable] = useState(0);
  const [privateChatPrice, setPrivateChatPrice] = useState(0);
  const [isAccept, setIsAccept] = useState(false);
  const [isReset, setIsReset] = useState(true);
  const [hasRole, setRole] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null) as any;
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation() as any;

  useEffect(() => {
    const checkRole = async () => {
      setLoading(true);
      const resp = await performerService.checkRole({
        roles: [ROLE_PERMISSIONS.ROLE_HOST_PRIVATE],
      });
      setRole(resp?.data);
      setLoading(false);
    };
    if (currentUser) {
      checkRole();
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
      return navigation.navigate("PrivateChat", {
        selectedRequest: selectedRequest,
      });
    }
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
        fontSize={28}
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
            {currentUser.privateChatPrice}
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
        {!hasRole ? (
          <View style={styles.textPermissions}>
            {!loading && (
              <Text color={colors.lightText} style={{ fontSize: 18 }}>
                Come back to this page when you have over{" "}
                {system.data.totalFollowerForPrivateChat} followers
              </Text>
            )}
          </View>
        ) : (
          <>
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
                      onSelect={() => {
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
                    <Button
                      disabled={!isReset}
                      onPress={() => setIsReset(false)}
                    >
                      On My Way
                    </Button>
                    <Text style={styles.textCenter}>
                      Extend timer 2 minutes
                    </Text>
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
                        backgroundColor: !isAccept
                          ? colors.gray
                          : colors.secondary,
                      },
                    ]}
                    onPress={() => handleRedirect()}
                    disabled={!isAccept}
                  >
                    <Text style={styles.btnText}>
                      Start Private Live Chat Now
                    </Text>
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
          </>
        )}
      </View>
      <HeaderMenu />
      <BackButton />
    </SafeAreaView>
  );
};

const mapStates = (state: any) => ({
  ui: { ...state.ui },
  currentUser: { ...state.user.current },
  privateRequests: state.streaming.privateRequests,
  system: { ...state.system },
});
const mapDispatch = { updateUser, updatePerformer };

export default connect(mapStates, mapDispatch)(PrivateChatWaitingRoom);
