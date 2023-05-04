import React, { useEffect, useContext } from "react";
import { SafeAreaView } from "react-native";
import { Box, Heading } from "native-base";
import { useNavigation } from "@react-navigation/core";
import BackButton from "components/uis/BackButton";
import { colors } from "utils/theme";
import { IBody, ICountry } from "interfaces/utils";
import HeaderMenu from "components/tab/HeaderMenu";
import TabView from "components/uis/TabView";
import Photo from "./component/Photo";
import Video from "./component/Video";
import Model from "./component/Model";

interface IProps {
  countries: ICountry[];
  bodyInfo: IBody;
}
const Top = ({}: IProps): React.ReactElement => {
  const navigation = useNavigation() as any;
  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
      headerTitleAlign: "center",
      title: "Top Caster",
      headerLeft: () => <BackButton />,
      headerRight: null,
    });
  }, [useContext]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Box flex={1} mx="auto" w="100%">
        <Heading fontSize={36} textAlign="center" color={colors.lightText} bold>
          Top Caster
        </Heading>
        <TabView
          swipeEnabled={false}
          scenes={[
            {
              key: "topModel",
              title: "Model",
              sence: Model,
            },
            {
              key: "topPhoto",
              title: "Photo",
              sence: Photo,
            },
            {
              key: "topVideo",
              title: "Video",
              sence: Video,
            },
          ]}
        />
        <HeaderMenu />
      </Box>
    </SafeAreaView>
  );
};

export default Top;
