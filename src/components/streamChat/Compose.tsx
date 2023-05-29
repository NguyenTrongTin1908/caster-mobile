import { Input, HStack,  ScrollView } from "native-base";
import React, {  useState } from "react";
import {
  TouchableOpacity,
} from "react-native";
import { View } from "native-base";
import { colors } from "utils/theme";
import Ionicons from "react-native-vector-icons/Ionicons";
import { connect } from "react-redux";
import { sendStreamMessage } from "services/redux/stream-chat/actions";
import { useForm } from "react-hook-form";
import EmojiSelector from "react-native-emoji-selector";
import styles from "./style";

// import { Input, message } from 'antd';
// import {
//   SendOutlined,
//   SmileOutlined
// } from '@ant-design/icons';
// import Emotions from './emotions';
// import './Compose.less';
interface IProps {
  loggedIn: boolean;
  sendStreamMessage: Function;
  sentFileSuccess?: Function;
  sendMessageStatus: any;
  conversation: any;
}
const Compose = ({
  loggedIn,
  sendStreamMessage,
  sentFileSuccess,
  sendMessageStatus,
  conversation,
}: IProps) => {
  let uploadRef: any;
  let _input: any;
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  const onSubmit = async ({ content }: any): Promise<void> => {
    submit(content);
    reset();
  };
  const submit = async (content) => {
    try {
      // const data = {} as ICreateComment;
      // data.content = content;
      // data.objectId = objectId;
      // data.objectType = objectType || "video";
      // handleOnSubmit(data);
    } catch {}
  };

  const [text, setText] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);

  const onChange = (val) => {
    // this.setState({ text: evt.target.value });
    setText(val);
  };
  const onSelectEmoji = (emojiObject) => {
    updateMessage(text + emojiObject.emoji);
  };
  const onPressEmoji = (currentText) => {
    setShowEmoji(!showEmoji);
    console.log(currentText);
    // setText(text + currentText);
  };
  const updateMessage = (text: string) => {
    setText(text);
  };
  const send = () => {
    if (!text) {
      return;
    }
    console.log("SendOutlined ", text);
    sendStreamMessage({
      conversationId: conversation._id,
      data: {
        text,
      },
      type: conversation.type,
    });
  };

  return (
    // <KeyboardDismiss>
    <View style={{ position: "absolute" }}>
      {/* <KeyboardAvoidingView> */}
      <View style={styles.messageComponent}>
        <HStack width="100%">
          <View width="88%">
            <Input
              selectionColor={colors.gray}
              value={text}
              placeholder={"Add a comment here"}
              placeholderTextColor={colors.gray}
              secureTextEntry={true}
              multiline
              numberOfLines={6}
              onChangeText={(val) => onChange(val)}
              style={{
                backgroundColor: colors.lightGray,
                // borderRadius: 50,
                width: "100%",
                height: 40,
                alignItems: "center",
              }}
              // InputRightElement={
              //   <TouchableOpacity onPress={() => onPressEmoji(text)}>
              //     <View
              //       bgColor={colors.lightGray}
              //       height={"100%"}
              //       alignItems="center"
              //       zIndex={1000000}
              //     >
              //       <Box
              //         bgColor={colors.primary}
              //         mr={2}
              //         h={34}
              //         w={34}
              //         borderRadius={17}
              //         alignItems="center"
              //         justifyContent="center"
              //       >
              //         <MaterialIcons
              //           name="insert-emoticon"
              //           size={25}
              //           color={colors.lightText}
              //         />
              //       </Box>
              //     </View>
              //   </TouchableOpacity>
              // }
              // onPressEmoji={onPressEmoji}
            />
          </View>
          <View width="10%" style={styles.sendComment}>
            <TouchableOpacity onPress={send}>
              <Ionicons
                name="send-sharp"
                size={22}
                color={"crimson"}
                style={styles.sendComment}
              />
            </TouchableOpacity>
          </View>
        </HStack>
      </View>
      {/* </KeyboardAvoidingView> */}

      {showEmoji && (
        <ScrollView style={styles.emotion}>
          <EmojiSelector
            showSearchBar={false}
            onEmojiSelected={onSelectEmoji}
          />
        </ScrollView>
      )}
    </View>
    // </KeyboardDismiss>
  );
};
const mapStates = (state: any) => ({
  user: state.user.current,
  sendMessageStatus: state.streamMessage.sendMessage,
  loggedIn: state.auth.loggedIn,
});
const mapDispatch = { sendStreamMessage };
export default connect(mapStates, mapDispatch)(Compose);
