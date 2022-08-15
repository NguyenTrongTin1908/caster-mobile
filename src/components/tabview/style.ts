import { Platform, StyleSheet } from 'react-native';


const styles = StyleSheet.create({

  bar: {
    top: 20,
    left: 0,
    right: 0,
    height: 56,
    position: 'absolute',
    flexDirection: "row",
    justifyContent: 'space-between',
    backgroundColor: 'transparent',
  },
  left: {
    top: 0,
    left: 0,
    width: 50,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
  right: {
    top: -20,
    right: 0,
    height: 106,
    width: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    display: "none",
    position: "absolute",
    zIndex: 1000,
    flex: 1,
    flexDirection: "row",
    width: "100%",
    height: "100%",
    shadowOffset: { width: 0, height: 1 }, // shadow right only
    shadowOpacity: 0.4,
    shadowRadius: 6,
  },
  drawerContainer: {
    flex: 5,
    backgroundColor: "#fff",
  },
  shadowContainer: {
    flex: 2,
  },
  touchClose: {
    width: "100%",
    height: "100%",
  },
  menuButton: {
    width: "100%",
    height: 40,
    flex: 1,
    flexDirection: "row",
  },
  tabView: {
    position: 'absolute',
    top: 10.0,
    left: 0.0,
    right: 0.0,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },

})

export default styles