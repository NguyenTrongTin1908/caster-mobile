import React, { useState } from "react";
import { useNavigation } from "@react-navigation/core";
import { colors, Sizes } from "utils/theme";
import { Animated, Easing, View } from "react-native";
import styles from "./style";
import { IFeed } from "interfaces/feed";
import { connect } from "react-redux";
import { reactionService } from "services/reaction.service";
import { IPerformer } from "src/interfaces";
import { Button } from "native-base";
interface IProps {
  item: IFeed;
  currentTab: string;
  currentUser: IPerformer;
}
const LeftStats = ({
  item,
  currentTab,
  currentUser,
}: IProps): React.ReactElement => {
  const [requesting, setRequesting] = useState(false);
  const [isBookMarked, setBookmark] = useState(item.isBookMarked);
  const navigation = useNavigation() as any;
  const spinValue = new Animated.Value(0);
  const handleRedirect = (navigationScreen) => {
    navigation.navigate(navigationScreen, {
      performer: item?.performer?._id,
    });
  };
  Animated.loop(
    Animated.timing(spinValue, {
      toValue: 1,
      duration: 4000,
      easing: Easing.linear,
      useNativeDriver: true,
    })
  ).start();

  return (
    <View style={styles.uiContainer}>
      <View style={styles.leftContainer}>
        {item?.performer?.privateChat ? (
          <View
            style={{
              marginBottom: Sizes.fixPadding,
              alignItems: "center",
            }}
          >
            <Button
              width={60}
              height={10}
              size={18}
              backgroundColor={colors.secondary}
              onPress={() => handleRedirect("PrivateUserWaitingRoom")}
            >
              Private Now
            </Button>
          </View>
        ) : (
          <></>
        )}
        {item?.performer?.live ? (
          <View
            style={{
              marginBottom: Sizes.fixPadding,
              alignItems: "center",
            }}
          >
            <Button
              width={60}
              height={10}
              size={18}
              backgroundColor={colors.secondary}
              onPress={() => handleRedirect("ViewPublicStream")}
            >
              Live Now
            </Button>
          </View>
        ) : (
          <></>
        )}
      </View>
    </View>
  );
};

const mapStates = (state: any) => {
  return {
    currentUser: state.user.current,
  };
};

export default connect(mapStates)(LeftStats);
