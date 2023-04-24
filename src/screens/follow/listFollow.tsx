import React, { useContext, useEffect, useState } from "react";
import { Box, Heading } from "native-base";
import { useNavigation } from "@react-navigation/core";
import { colors } from "utils/theme";
import Follower from "./component/Follower";
import Following from "./component/Following";
import TabView from "components/uis/TabView";
import HeaderMenu from "components/tab/HeaderMenu";
import BackButton from "components/uis/BackButton";

interface IProps {
  route: any;
}

const ListFollow = ({ route }: IProps): React.ReactElement => {
  const navigation = useNavigation() as any;
  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [useContext]);
  const [q, setQ] = useState("");
  const { tab } = route.params;

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
        defaultIndex={tab === "Following" ? 0 : 1}
        scenes={[
          {
            key: "followingList",
            title: "Following",
            sence: Following,
            params: { q },
          },
          {
            key: "followerList",
            title: "Fans",
            sence: Follower,
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
