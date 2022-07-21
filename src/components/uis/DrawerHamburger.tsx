import React from "react";
import { connect } from "react-redux";
import { TouchableOpacity } from "react-native";
import Feather from "react-native-vector-icons/Feather";
import { showDrawer as showDrawerHandler } from "services/redux/app-nav/actions";
import storeHolder from "lib/storeHolder";

export const DrawerHamburger = (): JSX.Element => {
  const handleShow = () => {
    const store = storeHolder.getStore();
    store?.dispatch(showDrawerHandler(true));
  };

  return (
    <TouchableOpacity onPress={handleShow} style={{ paddingLeft: 7 }}>
      <Feather name="menu" size={26} color="black" />
    </TouchableOpacity>
  );
};

const mapStateToProp = (state: any) => ({
  loggedIn: state.auth.loggedIn,
  showDrawer: state.appNav.showDrawer,
  hasTouchedDrawer: state.appNav.hasTouchedDrawer,
});
export default connect(mapStateToProp)(DrawerHamburger);
