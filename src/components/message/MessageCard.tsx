import React from "react";
import { HStack, Text, Image, View, Center } from "native-base";
import { colors } from "utils/theme";
import { IMessage } from "interfaces/conversation";
import { IUser } from "interfaces/user";
import { connect } from "react-redux";
import { IPerformer } from "src/interfaces";

interface IProps {
  message: any;
  isMe?: boolean;
  current?: IPerformer;
  // isMine: boolean;
  startsSequence: boolean;
  endsSequence: boolean;
  showTimestamp: boolean;
  isOwner: boolean;

  // canDelete?: boolean;
  // onDelete?: Function;
  // recipient: IPerformer;
}

let senderInfor: IMessage = {
  _id: "",
  conversationId: "",
  senderId: "",
  text: "",
  type: "",
  senderInfo: {} as IPerformer,
};

const MessageCard = ({
  message,
  isMe = true,
  current,
}: IProps): React.ReactElement => {
  if (!isMe && !senderInfor?.senderInfo?.username) senderInfor = message;
  const name = isMe
    ? (current?.name && current.name !== " ") || current?.username
    : (message.recipientInfo?.name && message.recipientInfo?.name !== " ") ||
      message.recipientInfo?.username;

  if (isMe) {
    return (
      <HStack space={2} my={2} flexDirection={"column"} alignItems="flex-end">
        <View maxW={"60%"} backgroundColor="red">
          <Text color={colors.lightText} mx={2}>
            {name || "User"}
          </Text>
          <Image
            source={
              message?.recipientInfo?.avatar ||
              (!isMe && message?.recipientInfo?.avatar)
                ? {
                    uri: current?.avatar || senderInfor.senderInfo?.avatar,
                  }
                : require("assets/avatar-default.png")
            }
            alt={"avatar"}
            size={30}
            borderRadius={15}
            resizeMode="cover"
            position={"absolute"}
            left={-35}
          />
          <View
            style={{
              position: "relative",
              left: 0,
              borderRadius: 50,
              backgroundColor: colors.messageText,
              alignItems: "center",
              paddingHorizontal: 10,
            }}
          >
            <Text fontSize={17} color={colors.lightText}>
              {message.text}
            </Text>
          </View>
        </View>
      </HStack>
    );
  }

  return (
    <HStack
      space={2}
      my={2}
      flexDirection={"column"}
      alignItems="flex-start"
      justifyContent={"flex-start"}
    >
      {message.isSystem && (
        <Center>
          <Text fontSize="sm">{message.text}</Text>
        </Center>
      )}

      {!message.isSystem && (
        <>
          <View style={{ flexDirection: "row-reverse" }}>
            <Text color={colors.lightText} mx={2}>
              {name || "User"}
            </Text>
            <Image
              source={
                message?.recipientInfo?.avatar ||
                (!isMe && message?.recipientInfo?.avatar)
                  ? {
                      uri:
                        message?.recipientInfo?.avatar ||
                        senderInfor.senderInfo?.avatar,
                    }
                  : require("assets/icon.png")
              }
              alt={"avatar"}
              size={30}
              borderRadius={15}
              resizeMode="cover"
            />
          </View>
          <View
            style={{
              position: "relative",
              top: -10,
              left: 37,
              borderRadius: 50,
              backgroundColor: colors.messageText,
              alignItems: "center",

              paddingHorizontal: 10,
            }}
          >
            <Text textAlign={"center"} fontSize={17} color={colors.lightText}>
              {message.text}
            </Text>
          </View>
        </>
      )}
    </HStack>
  );
};

const mapStateToProp = (state: any): any => ({
  ...state.user,
});
export default connect(mapStateToProp)(MessageCard);
