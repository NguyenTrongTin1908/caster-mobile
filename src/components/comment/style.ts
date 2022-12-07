import { StyleSheet } from "react-native";
import { colors } from "utils/theme";
import { Colors, Fonts, Sizes } from "../../constants/styles";

const styles = StyleSheet.create({
  container: { flex: 1 },
  modalComment: {
    marginBottom: 50,
  },

  commentItem: {
    // marginHorizontal: Sizes.fixPadding + 5.0,
    // marginVertical: Sizes.fixPadding,
    flexDirection: "row",
    // justifyContent: 'space-between',
    // alignItems: 'center'
  },
  optionCommentItem: {
    paddingHorizontal: 5,
  },
  header: {
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    paddingTop: 10,
    textAlign: "center",
    fontSize: 24,
  },
  body: {
    justifyContent: "center",
    paddingHorizontal: 15,
    minHeight: 100,
  },
  footer: {
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    flexDirection: "row",
  },
  sendComment: {
    marginLeft: "auto",
    alignItems: "center",
    justifyContent: "center",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
  activeGift: {
    borderColor: colors.secondary,
    borderWidth: 2,
  },
  commentForm: {
    position: "absolute",
    bottom: 0,
  },
  commentList: {
    width: "100%",
    marginBottom: 100,
  },
  replyList: {
    width: "100%",
    marginBottom: 40,
  },
});

export default styles;
