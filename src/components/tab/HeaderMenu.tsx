import React from "react";
import { Flex, Divider, Box, HStack, View, Text } from "native-base";
import {
  Dimensions,
  StatusBar,
  TouchableOpacity,
  Animated,
  FlatList,
  Alert,
  Modal,
  Pressable,
} from "react-native";
import { useNavigation } from "@react-navigation/core";
import { colors, Sizes } from "utils/theme";
import { omit } from "lodash";
import { connect } from "react-redux";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import styles from "./style";
import { logout } from "services/redux/auth/actions";
import { Menu } from "react-native-material-menu";
import { useState, useRef } from "react";
import * as Animatable from "react-native-animatable";
import Feather from "react-native-vector-icons/Feather";
import { reportService } from "services/report.service";
import { IFeed, IPerformer } from "src/interfaces";
const initialLayout = { width: Dimensions.get("window").width };
import ReportModal from "components/modal/report";
import KeyboardDismiss from "components/uis/KeyboardDismiss";
// import MainDrawer from "navigations/MainDrawer";
import DrawerHamburger from "components/uis/DrawerHamburger";

const HeaderMenu = (): React.ReactElement => {
  const navigation = useNavigation() as any;
  const [showOptions, setshowOptions] = useState(false);

  return (
    <Animated.View style={styles.bar}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <View style={styles.left}>
          <MaterialIcons name="arrow-back" color={colors.lightText} size={24} />
        </View>
      </TouchableOpacity>
      {/* <TouchableOpacity>
        <View style={styles.right}>
          <MaterialIcons
            name="more-vert"
            size={30}
            color={colors.lightText}
            onPress={() => setshowOptions(true)}
          />
        </View>
      </TouchableOpacity> */}
      <DrawerHamburger />


    </Animated.View>
  );
};
export default HeaderMenu;
