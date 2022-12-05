import React, { useEffect, useState, useContext } from "react";
import { connect } from "react-redux";
import { useToast, Image, View } from "native-base";
import { SafeAreaView, Text, TouchableOpacity, Animated } from "react-native";
import { useForm } from "react-hook-form";
import { useNavigation } from "@react-navigation/core";
import { logout } from "services/redux/auth/actions";
import { authService } from "services/auth.service";
import { IPerformer } from "interfaces/performer";
import TabView from "components/uis/TabView";
import { colors, Fonts, Sizes } from "utils/theme";
import Photo from "components/tab/profile/Photo";
import Video from "components/tab/profile/Video";
import styles from "./style";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { Menu } from "react-native-material-menu";
import { color } from "native-base/lib/typescript/theme/styled-system";
import HeaderMenu from "components/tab/HeaderMenu";
import BackButton from "components/uis/BackButton";
interface Props {
  current: IPerformer;
  isLoggedIn: boolean;
  handleLogout: Function;

  route: {
    params: {
      performerID: string;
    };
  };
}

const Profile = ({
  current,
  handleLogout,
  route,
}: Props): React.ReactElement => {
  const navigation = useNavigation() as any;
  const [q, setQ] = useState("");
  const [showOptions, setshowOptions] = useState(false);
  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [useContext]);
  const defaultValues = {
    email: current?.email,
    username: current?.username,
    password: "",
    conPassword: "",
  };
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ defaultValues });
  const [submitting, setSubmitting] = useState(false);
  const toast = useToast();
  const onUpdatePassword = async ({
    password,
    prePassword,
  }: any): Promise<void> => {
    if (!password) {
      return toast.show({
        title: "Warning",
        status: "warning",
        description: "Please enter new password!",
        placement: "bottom",
      });
    }
    setSubmitting(true);
    //todo - source: performer for performer update
    await authService
      .updatePassword({ password, prePassword })
      .then(() => {
        toast.show({
          title: "Success",
          status: "success",
          description: "Update password successfully!",
          placement: "bottom",
        });
        reset(defaultValues);
        setSubmitting(false);
      })
      .catch(async (e) => {
        const error = await Promise.resolve(e);
        toast.show({
          title: "Error",
          status: "error",
          description: "An error occurred, please try again!",
          placement: "bottom",
        });
        setSubmitting(false);
      });
  };
  const handleItemMenu = (options) => {
    if (options === "Logout") {
      setshowOptions(false);
      handleLogout();
      navigation.navigate("IntroNav", { screen: "IntroNav/Login" });
    }
  };
  const menuItems = ({ option }) => {
    return (
      <TouchableOpacity
        onPress={() => {
          handleItemMenu(option);
        }}
      >
        <Text
          style={{
            marginRight: Sizes.fixPadding * 2,
            marginVertical: Sizes.fixPadding + 2.0,
            fontWeight: "bold",
          }}
        >
          {option}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <Image
          source={
            current?.cover ? { uri: current?.cover } : require("assets/bg.jpg")
          }
          style={styles.converPhoto}
          alt="cover"
        />
        <View style={styles.avContainer}>
          <View style={styles.avBlueRound}>
            <Image
              source={
                current?.avatar
                  ? { uri: current?.avatar }
                  : require("assets/avatar-default.png")
              }
              alt={"avatar"}
              size={100}
              borderRadius={80}
              resizeMode="cover"
            />
            <View style={styles.activeNowTick}></View>
          </View>
        </View>
        <Text style={styles.textName}>
          {current && current?.name != " "
            ? `${current?.name}`
            : `${current?.username}`}
        </Text>
        <View
          style={{ flexDirection: "row", alignSelf: "center", marginTop: 5 }}
        >
          <TouchableOpacity
            activeOpacity={0.7}
            style={styles.editButtonStyle}
            onPress={() => navigation.navigate("EditProfile")}
          >
            <Text style={styles.subText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>
        <View style={{ flex: 1 }}>
          {/* <View style={styles.listFeeds}> */}
          <TabView
            scenes={[
              {
                key: "photoList",
                title: "Photo",
                sence: Photo,
                params: { performerId: current._id },
              },
              {
                key: "videoList",
                title: "Video",
                sence: Video,
                params: { performerId: current._id },
              },
            ]}
          />
        </View>
      </View>
      <HeaderMenu />
      <BackButton />
    </SafeAreaView>
  );
};

const mapStateToProp = (state: any): any => ({
  ...state.user,
  isLoggedIn: state.auth.loggedIn,
});
const mapDispatch = {
  handleLogout: logout,
};
export default connect(mapStateToProp, mapDispatch)(Profile);
