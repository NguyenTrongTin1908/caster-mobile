import { Checkbox, Switch, Alert, Heading } from "native-base";
import { Text, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { performerService } from "services/perfomer.service";
import { useNavigation } from "@react-navigation/core";
import { colors, Fonts } from "utils/theme";
import styles from "./style";
import HeaderMenu from "components/tab/HeaderMenu";
import { IPerformer } from "src/interfaces";
import { SafeAreaView, View } from "react-native";
import BackButton from "components/uis/BackButton";
import { ROLE_PERMISSIONS } from "../../../constants";

interface IProps {
  error: any;
  currentUser: IPerformer;
  system: any;
}

const GoLivePage = ({ error, currentUser, system }: IProps) => {
  const [isAccept, setIsAccept] = useState(false);
  const [isDelay, setDelay] = useState(false);
  const navigation = useNavigation() as any;
  const [loading, setLoading] = useState(false);
  const [hasRole, setRole] = useState(false);

  useEffect(() => {
    const checkRole = async () => {
      setLoading(true);
      const resp = await performerService.checkRole({
        roles: [ROLE_PERMISSIONS.ROLE_HOST_LIVE],
      });
      setRole(resp?.data);
      setLoading(false);
    };
    if (currentUser) {
      checkRole();
    }
  }, []);

  const handleRedirect = () => {
    if (isAccept) {
      performerService.updateMe(currentUser._id, { privateChat: false });
      navigation.navigate("PublicStream");
    } else {
      Alert("Please accept all terms & conditions before go live");
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
        Going Live
      </Heading>
      <View style={styles.switchBox}>
        <Text style={styles.switchText}>
          Delay all chat comments 15 secords for moderator screening
        </Text>
        <Switch
          onToggle={() => {
            setDelay(!isDelay);
          }}
          isChecked={!!isDelay}
          style={{ alignSelf: "center", marginTop: 20 }}
        ></Switch>
      </View>
      <View style={styles.moderatorBox}>
        <Text style={styles.moderatorText}>Moderators</Text>
        <Text style={styles.moderatorText}>Find Moderators</Text>
      </View>
      {hasRole ? (
        <View style={styles.footerGolive}>
          <TouchableOpacity
            activeOpacity={0.7}
            style={[styles.goliveButton, { opacity: isAccept ? 1 : 0.5 }]}
            onPress={() => handleRedirect()}
            disabled={!isAccept}
          >
            <Text style={styles.subText}>Go Live Now</Text>
          </TouchableOpacity>
          <View style={styles.termBox}>
            <Text style={styles.subText}>Term & Conditions of going live</Text>
            <Checkbox
              value="golive"
              isChecked={isAccept}
              onChange={() => setIsAccept(!isAccept)}
            >
              <Text style={styles.subText}>Accept</Text>
            </Checkbox>
          </View>
          <Text style={styles.subText}>Last Updated</Text>
          <Text style={styles.subText}>January 4th</Text>
        </View>
      ) : (
        <View style={styles.textPermissions}>
          {!loading && (
            <Text style={{ fontSize: 18, color: colors.lightText }}>
              Come back to this page when you have over{" "}
              {system.data.totalFollowerForLive} followers
            </Text>
          )}
        </View>
      )}
      <HeaderMenu />
      <BackButton />
    </SafeAreaView>
  );
};

const mapStates = (state: any) => ({
  ui: { ...state.ui },
  currentUser: { ...state.user.current },
  system: { ...state.system },
});

export default connect(mapStates)(GoLivePage);
