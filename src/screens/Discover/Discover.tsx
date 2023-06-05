import React, { useEffect, useContext } from "react";
import { SafeAreaView } from "react-native";
import { Box, Heading } from "native-base";
import { useNavigation } from "@react-navigation/core";
import BackButton from "components/uis/BackButton";
import { colors } from "utils/theme";
import HeaderMenu from "components/tab/HeaderMenu";
import TabView from "components/uis/TabView";
import Photo from "./component/Photo";
import Video from "./component/Video";

const Discover = (): React.ReactElement => {
  const navigation = useNavigation() as any;
  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
      headerTitleAlign: "center",
      title: "Discover",
      headerLeft: () => <BackButton />,
      headerRight: null,
    });
  }, [useContext]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Box flex={1} mx="auto" w="100%">
        <Heading fontSize={36} textAlign="center" color={colors.lightText} bold>
          Discover
        </Heading>
        <TabView
          swipeEnabled={false}
          scenes={[
            {
              key: "discoverVideo",
              title: "Video",
              sence: Video,
            },
            {
              key: "discoverPhoto",
              title: "Photo",
              sence: Photo,
            },
          ]}
        />
        <HeaderMenu />
      </Box>
    </SafeAreaView>
  );
};

export default Discover;
