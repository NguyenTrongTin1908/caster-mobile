import React, { useContext, useEffect, useState } from "react";
import { Box, Heading } from "native-base";
import { useNavigation } from "@react-navigation/core";
import { colors } from "utils/theme";
import SearchInput from "components/uis/SearchInput";
import Follower from "./component/Follower";
import Following from "./component/Following";
import TabView from "components/uis/TabView";
import HeaderMenu from "components/tab/HeaderMenu";
import BackButton from "components/uis/BackButton";

const ListFollow = (): React.ReactElement => {
  const navigation = useNavigation() as any;
  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [useContext]);
  const [q, setQ] = useState("");
  const onSearch = (text: string): void => {
    setQ(text);
  };
  return (
    <Box safeAreaX={4} safeAreaTop={8} flex={1}>
      <Heading
        mb={4}
        fontSize={34}
        textAlign="center"
        color={colors.lightText}
        bold
      >
        List Follow
      </Heading>

      <TabView
        scenes={[
          {
            key: "followingList",
            title: "Follower",
            sence: Follower,
            params: { q },
          },
          {
            key: "followerList",
            title: "Following",
            sence: Following,
            params: { q },
          },
        ]}
      />
      <HeaderMenu />
      <BackButton />

    </Box>
  );
};
export default ListFollow;
