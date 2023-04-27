import React, { useContext, useEffect, useState } from "react";
import { Box, Heading } from "native-base";
import { useNavigation } from "@react-navigation/core";
import { colors } from "utils/theme";
import Follower from "./component/Follower";
import Following from "./component/Following";
import TabView from "components/uis/TabView";
import HeaderMenu from "components/tab/HeaderMenu";
import BackButton from "components/uis/BackButton";
import { performerService } from "../../services";

interface IProps {
  route: any;
}

const ListFollow = ({ route }: IProps): React.ReactElement => {
  const navigation = useNavigation() as any;
  const [performer, setPerformer] = useState();
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    navigation.setOptions({ headerShown: false });
    getPerformerInfo();
  }, [useContext]);
  const [q, setQ] = useState("");
  const { tab, performerId } = route.params;

  const getPerformerInfo = async () => {
    try {
      setLoading(true);
      const { data } = await performerService.findOne(performerId);
      setPerformer(data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const onSearch = (text: string): void => {
    setQ(text);
  };
  return (
    <Box safeAreaTop={8} flex={1}>
      {performer && (
        <TabView
          defaultIndex={tab === "Following" ? 0 : 1}
          scenes={[
            {
              key: "followingList",
              title: "Following",
              sence: Following,
              params: { performer },
            },
            {
              key: "followerList",
              title: "Fans",
              sence: Follower,
              params: { performer },
            },
          ]}
        />
      )}
      <HeaderMenu />
      <BackButton />
    </Box>
  );
};
export default ListFollow;
