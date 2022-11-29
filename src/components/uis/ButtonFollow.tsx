import React, { useEffect, useState } from "react";
import { Box, Text, View, Button } from "native-base";
import { colors } from "utils/theme";
import { followService } from "services/follow.service";
import { connect } from "react-redux";
import { TouchableOpacity } from "react-native";
import styles from "./style";
interface IProps {
  isFollow: boolean;
  targetId: string;
  sourceId: string;
  getPerformerList: Function;
  isHideOnClick: boolean;
}

const ButtonFollow = ({
  isFollow,
  targetId,
  sourceId,
  getPerformerList,

  isHideOnClick,
}: IProps): React.ReactElement => {
  const [status, setStatus] = useState(false);
  const [loading, setLoanding] = useState(false);

  useEffect(() => {
    if (isFollow || isFollow === undefined) {
      setStatus(true);
    }
  }, []);

  const handleFollow = async () => {
    try {
      if (status) {
        await setLoanding(true);
        await followService.delete(targetId);
        setStatus(false);
      } else {
        setLoanding(true);
        await followService.create({
          targetId,
          sourceId,
        });

        setStatus(true);

        getPerformerList();
      }
    } catch (e) {
      const err = await e;
    } finally {
      setLoanding(false);
    }
  };

  return (
    <View>
      {status && isHideOnClick ? null : (
        <Button
          width={60}
          height={10}
          size={18}
          colorScheme="secondary"
          onPress={handleFollow}
        >
          {status ? "Unfollow" : "Follow"}
        </Button>
      )}
    </View>
  );
};

export default ButtonFollow;
