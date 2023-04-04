import React, { useEffect, useState } from "react";
import {
  View,
  Heading,
  useToast,
  KeyboardAvoidingView,
} from "native-base";
import { useForm } from "react-hook-form";
import { colors, Sizes } from "utils/theme";
import { useNavigation } from "@react-navigation/core";
import {
  Alert,
  Platform,
  SafeAreaView,
} from "react-native";
import { connect } from "react-redux";
import { IPerformer, ICountry } from "src/interfaces";
import { utilsService } from "services/utils.service";
import TabView from "components/uis/TabView";
import {
  updatePerformer,
  updateCurrentUserAvatar,
  updateCurrentUserCover,
} from "services/redux/user/actions";
import styles from "../model/profile/style";
import moment from "moment";
import HeaderMenu from "components/tab/HeaderMenu";
import VerificationForm from "./component/VerificationForm";
import UpdateProfileForm from "./component/UpdateProfileForm";
import SettingFeeForm from "./component/SettingFeeForm";
import KeyboardDismiss from "components/uis/KeyboardDismiss";
import BackButton from "components/uis/BackButton";
interface IProps {
  current: IPerformer;
  updatePerformer: Function;
  updateCurrentUserAvatar: Function;
  updateCurrentUserCover: Function;
}

const EditProfile = ({
  current,
  updatePerformer: handleUpdatePerformer,
  updateCurrentUserAvatar: handleUpdateAvt,
  updateCurrentUserCover: handleUpdateCover,
}: IProps): React.ReactElement => {
  const toast = useToast();
  const [countries, setCountries] = useState([] as Array<ICountry>);
  const [bodyInfo, setBodyInfo] = useState([] as any);
  const defaultValues = {
    ...current,
    dateOfBirth: (current.dateOfBirth && moment(current.dateOfBirth)) || "",
  };
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues });
  const [submitting, setSubmitting] = useState(false);
  const navigation = useNavigation() as any;
  const onSubmit = async (data: any): Promise<void> => {
    submit(data);
  };

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
      const [countries, bodyInfo] = await Promise.all([
        utilsService.countriesList(),
        utilsService.bodyInfo(),
      ]);
      setCountries(countries?.data);
      setBodyInfo(bodyInfo?.data);
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
            <View style={{ flex: 1 }}>
              <TabView
                scenes={[
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
                ]}
              />
            </View>
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
