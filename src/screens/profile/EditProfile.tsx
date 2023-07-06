import React, { useEffect, useState } from "react";
import { View, Heading, useToast, KeyboardAvoidingView } from "native-base";
import { colors } from "utils/theme";
import { useNavigation } from "@react-navigation/core";
import { Alert, Platform, SafeAreaView } from "react-native";
import { connect } from "react-redux";
import { IPerformer } from "src/interfaces";
import TabView from "components/uis/TabView";
import {
  updatePerformer,
  updateCurrentUserAvatar,
  updateCurrentUserCover,
} from "services/redux/user/actions";
import styles from "../model/profile/style";
import HeaderMenu from "components/tab/HeaderMenu";
import VerificationForm from "./component/VerificationForm";
import UpdateProfileForm from "./component/UpdateProfileForm";
import SettingFeeForm from "./component/SettingFeeForm";
import KeyboardDismiss from "components/uis/KeyboardDismiss";
import BackButton from "components/uis/BackButton";
import { ROLE_PERMISSIONS } from "../../constants";
import { earningService } from "../../services";

interface IProps {
  current: IPerformer;
  updatePerformer: Function;
  updateCurrentUserAvatar: Function;
  updateCurrentUserCover: Function;
}

const EditProfile = ({
  current,
  updatePerformer: handleUpdatePerformer,
}: IProps): React.ReactElement => {
  const scenes = [
    {
      key: "profileSettings",
      title: "Profile Settings",
      sence: UpdateProfileForm,
    },
    {
      key: "idDocuments",
      title: "ID Documents",
      sence: VerificationForm,
    },
    {
      key: "feeSettings",
      title: "Settings",
      sence: SettingFeeForm,
    },
  ];

  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [sceneAuthentication, setSceneAuthentication] = useState(scenes) as any;
  const navigation = useNavigation() as any;
  const onSubmit = async (data: any): Promise<void> => {
    submit(data);
  };

  function removeObjectWithKey(arr, key) {
    return arr.filter((obj) => obj.key !== key);
  }

  const submit = async (data) => {
    if (typeof data.dateOfBirth === "string") {
      const [day, month, year] = data.dateOfBirth.split("-");
      const datePick = new Date(+year, month - 1, +day);
      data.dateOfBirth = datePick.toISOString();
    }
    try {
      handleUpdatePerformer({
        ...current,
        ...data,
      });
      toast.show({
        title: "Updated successfully!",
      });
      navigation.navigate("Profile");
    } catch {
      Alert.alert("Something went wrong, please try again later");
    }
  };

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      let arrTemp = scenes;
      if (
        current?.roles &&
        !current?.roles.includes(ROLE_PERMISSIONS.ROLE_HOST_PRIVATE)
      ) {
        arrTemp = removeObjectWithKey(arrTemp, "feeSettings");
      }
      const resp = await earningService.performerSearch();
      if (resp?.data) {
        if (!resp.data.total) {
          arrTemp = removeObjectWithKey(arrTemp, "idDocuments");
        }
      }
      setSceneAuthentication(arrTemp);
      setLoading(false);
    }
    loadData();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        h={{
          base: "100%",
          lg: "auto",
        }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <KeyboardDismiss>
          <View style={styles.container}>
            <Heading
              mb={4}
              fontSize={34}
              textAlign="center"
              color={colors.lightText}
              bold
            >
              Edit Profile
            </Heading>
            {!loading && (
              <View style={{ flex: 1 }}>
                <TabView scenes={sceneAuthentication} />
              </View>
            )}
          </View>
        </KeyboardDismiss>
      </KeyboardAvoidingView>
      <HeaderMenu />
      <BackButton />
    </SafeAreaView>
  );
};

const mapStates = (state: any) => ({
  ...state.user,
  isLoggedIn: state.auth.loggedIn,
});
const mapDispatch = {
  updatePerformer,
  updateCurrentUserAvatar,
  updateCurrentUserCover,
};

export default connect(mapStates, mapDispatch)(EditProfile);
