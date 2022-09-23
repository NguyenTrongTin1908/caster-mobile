import React, { useContext, useEffect, useState } from "react";
import { Box, Heading } from "native-base";
import { useNavigation } from "@react-navigation/core";
import { colors } from "utils/theme";
import SearchInput from "components/uis/SearchInput";
import PublicLive from "./component/PublicLive";
import PrivateLive from "./component/PrivateLive";
import TabView from "components/uis/TabView";
import BackButton from "components/uis/BackButton";
import HeaderMenu from "components/tab/HeaderMenu";

const LiveNow = (): React.ReactElement => {
  const navigation = useNavigation() as any;
  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
      headerTitleAlign: "center",
      title: "Profile",
      headerLeft: () => <BackButton />,
      headerRight: null,
    });
  }, [useContext]);
  const [q, setQ] = useState("");
  const onSearch = (text: string): void => {
    setQ(text);
  };

  return (
    <Box safeAreaX={4} safeAreaTop={8} flex={1}>
      <Heading
        mb={4}
        fontSize={40}
        letterSpacing={-1}
        color={colors.lightText}
        bold
      >
        Live Now
      </Heading>
      <TabView
        scenes={[
          {
            key: "publicList",
            title: "Public Live",
            sence: PublicLive,
            params: { q },
          },
          {
            key: "privateList",
            title: "Private Live",
            sence: PrivateLive,
            params: { q },
          },
        ]}
      />
      <HeaderMenu />
    </Box>
  );
};

export default LiveNow;
