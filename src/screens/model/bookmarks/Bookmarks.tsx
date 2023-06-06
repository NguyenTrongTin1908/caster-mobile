import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Heading, View } from "native-base";
import { SafeAreaView } from "react-native";
import { useNavigation } from "@react-navigation/core";
import { logout } from "services/redux/auth/actions";
import TabView from "components/uis/TabView";
import { colors, Sizes } from "utils/theme";
import Photo from "components/tab/bookmarks/Photo";
import Video from "components/tab/bookmarks/Video";
import styles from "./style";
import HeaderMenu from "components/tab/HeaderMenu";
import { IPerformer } from "src/interfaces";
import BackButton from "components/uis/BackButton";

interface Props {
  isLoggedIn: boolean;
  current: IPerformer;
  handleLogout: Function;
}
const Bookmarks = ({ handleLogout, current }: Props): React.ReactElement => {
  const navigation = useNavigation() as any;
  const [showOptions, setshowOptions] = useState(false);

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <HeaderMenu />
        <Heading
          mb={4}
          fontSize={30}
          textAlign="center"
          color={colors.lightText}
          bold
        >
          Bookmarks
        </Heading>

        <View style={{ flex: 1 }}>
          <TabView
            scenes={[
              {
                key: "photoList",
                title: "Photos",
                sence: Photo,
                params: { performerId: current._id },
              },
              {
                key: "videoList",
                title: "Videos",
                sence: Video,
                params: { performerId: current._id },
              },
            ]}
          />
        </View>
        <HeaderMenu />
      </View>
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
export default connect(mapStateToProp, mapDispatch)(Bookmarks);
