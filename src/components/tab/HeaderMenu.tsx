import React from "react";
import { Animated, TouchableOpacity, View } from "react-native";
import styles from "./style";
import { useNavigation } from "@react-navigation/core";

import DrawerHamburger from "components/uis/DrawerHamburger";
import { colors } from "utils/theme";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

const HeaderMenu = (): React.ReactElement => {
  return (
    <Animated.View style={styles.bar}>
      {/* <TouchableOpacity onPress={() => navigation.goBack()}>
        <View style={styles.left}>
          <MaterialIcons name="arrow-back" color={colors.lightText} size={24} />
        </View>
      </TouchableOpacity> */}
      <DrawerHamburger />
    </Animated.View>
  );
};
export default HeaderMenu;
