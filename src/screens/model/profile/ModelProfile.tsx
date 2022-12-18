import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Image, View } from "native-base";
import { SafeAreaView, Text, TouchableOpacity, Animated } from "react-native";
import { useNavigation } from "@react-navigation/core";
import { logout } from "services/redux/auth/actions";
import TabView from "components/uis/TabView";
import { colors, Sizes } from "utils/theme";
import Photo from "components/tab/profile/Photo";
import Video from "components/tab/profile/Video";
import styles from "./style";
import ButtonFollow from "components/uis/ButtonFollow";
import { IPerformer } from "src/interfaces";
import BackButton from "components/uis/BackButton";
import AntDesign from "react-native-vector-icons/AntDesign";
import HeaderMenu from "components/tab/HeaderMenu";

interface Props {
  isLoggedIn: boolean;
  current: IPerformer;
  handleLogout: Function;
  route: any;
}
const ModelProfile = ({
  handleLogout,
  route,
  current,
}: Props): React.ReactElement => {
  const navigation = useNavigation() as any;
  const [showOptions, setshowOptions] = useState(false);
  const { performer } = route.params;

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);

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
            performer?.cover
              ? { uri: performer?.cover }
              : require("../../../assets/bg.jpg")
          }
          style={styles.converPhoto}
          alt="cover"
        />
        <View style={{ position: "absolute", top: 120, right: 30 }}>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("ChatRoom", {
                performer: performer,
                toSource: "performer",
                toId: performer?._id || "",
              })
            }
          >
            <AntDesign
              name="message1"
              size={30}
              color={colors.lightText}
            ></AntDesign>
          </TouchableOpacity>
        </View>
        <View style={styles.avContainer}>
          <View style={styles.avBlueRound}>
            <Image
              source={
                performer?.avatar
                  ? { uri: performer?.avatar }
                  : require("../../../assets/avatar-default.png")
              }
              alt={"avatar"}
              size={100}
              borderRadius={80}
              resizeMode="cover"
            />
            {performer?.isOnline ? (
              <View style={styles.activeNowTick}></View>
            ) : null}
          </View>
        </View>
        <Text style={styles.textName}>
          {performer && performer?.name != " "
            ? `${performer?.name}`
            : `${performer?.username}`}
        </Text>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            marginTop: 2,
          }}
        >
          <ButtonFollow
            isHideOnClick={false}
            targetId={performer._id}
            sourceId={current._id}
            isFollow={performer.isFollowed}
            getPerformerList={() => {}}
          />
        </View>

        <View style={{ flex: 1 }}>
          <TabView
            scenes={[
              {
                key: "videoList",
                title: "Videos",
                sence: Video,
                params: { performerId: performer._id },
              },
              {
                key: "photoList",
                title: "Photos",
                sence: Photo,
                params: { performerId: performer._id },
              },
            ]}
          />
        </View>
        <HeaderMenu />
        <BackButton />
      </View>
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
export default connect(mapStateToProp, mapDispatch)(ModelProfile);
