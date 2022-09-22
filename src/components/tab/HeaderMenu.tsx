import React from "react";
import { Animated } from "react-native";
import styles from "./style";

import DrawerHamburger from "components/uis/DrawerHamburger";

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
