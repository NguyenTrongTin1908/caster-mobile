import React, { useState } from "react";
import { Platform, TouchableWithoutFeedback } from "react-native";
import {
  Image,
  Input,
  Box,
  View,
  VStack,
  KeyboardAvoidingView,
} from "native-base";
import { IUser } from "interfaces/user";
import { colors } from "utils/theme";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

interface IProps {
  authUser: IUser;
  conversationId: string;
  performerId?: string;
  Button: Function;
  sendMessageStream: Function;
  setModal: Function;
  PrivateBtnSendMessage?: Function;
  onPressEmoji?: Function;
  defaultInput?: string;
}

const ChatFooter = ({
  authUser,
  conversationId,
  Button,
  sendMessageStream,
  performerId,
  PrivateBtnSendMessage,
  setModal,
  onPressEmoji,
  defaultInput
}: IProps): React.ReactElement => {
  const [input, setInput] = useState<string>(defaultInput || '');

  return (
    <>
      <Button
        performerId={performerId}
        conversationId={conversationId}
        colorScheme="secondary"
        label="Send tip"
        onPress={() => setModal(true)}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={110}
      >
        <VStack>
          <View
            style={{
              flexDirection: "row",
              width: "100%",
              alignItems: "center",
              flexShrink: 0,
            }}
          >
            <Input
              h={50}
              borderRadius={25}
              borderColor={"rgba(0, 0, 0, 0.05)"}
              px={2}
              value={input}
              flex={1}
              style={{
                fontSize: 18,
                borderRadius: 0,
                color: colors.darkText,
                height: "100%",
              }}
              onChangeText={(value) => setInput(value)}
              bgColor={"rgba(0, 0, 0, 0.05)"}
              InputRightElement={
                <Box
                  bgColor={"rgba(0, 0, 0, 0.05)"}
                  h="100%"
                  justifyContent="center"
                >
                  <TouchableWithoutFeedback onPress={() => onPressEmoji && onPressEmoji(input)}>
                    <Box
                      bgColor={colors.primary}
                      mr={3}
                      h={34}
                      w={34}
                      borderRadius={17}
                      alignItems="center"
                      justifyContent="center"
                    >
                      <MaterialIcons
                        name="insert-emoticon"
                        size={25}
                        color={colors.lightText}
                      />
                    </Box>
                  </TouchableWithoutFeedback>
                </Box>
              }
            />
            {PrivateBtnSendMessage && (
              <PrivateBtnSendMessage
                onPress={() => {
                  sendMessageStream({ message: input, id: conversationId });
                  setInput("");
                }}
              />
            )}
          </View>
        </VStack>
      </KeyboardAvoidingView>
    </>
  );
};

export default ChatFooter;
