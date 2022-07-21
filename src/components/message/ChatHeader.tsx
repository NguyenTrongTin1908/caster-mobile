import React from "react";
import { TouchableOpacity, TouchableWithoutFeedback } from "react-native";
import { Box, HStack, VStack, Text, Heading, Image } from "native-base";
import { colors } from "utils/theme";
import { IPerformer } from "interfaces/performer";
import { useNavigation } from "@react-navigation/native";
import OnlineDot from "components/uis/OnlineDot";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { getBirthday, formatZodiac } from "lib/date";

interface IProps {
  performer: IPerformer;
  isPrivate?: boolean;
}

const ChatHeader = ({
  performer,
  isPrivate = false,
}: IProps): React.ReactElement => {
  const navigation = useNavigation() as any;
  return (
    <HStack w="100%">
      <Box alignSelf="center">
        <TouchableWithoutFeedback
          style={{ padding: 10 }}
          onPress={() => navigation.goBack()}
        >
          <MaterialIcons
            name="keyboard-arrow-left"
            size={32}
            color={"rgba(0, 0, 0, 0.2)"}
          />
        </TouchableWithoutFeedback>
      </Box>
      <TouchableOpacity
        onPress={() =>
          navigation.navigate("PerformerDetail", {
            username: performer.username,
          })
        }
      >
        <HStack space={2}>
          <Box position="relative">
            <Image
              source={
                performer.avatar
                  ? { uri: performer.avatar }
                  : require("assets/icon.png")
              }
              alt={"avatar"}
              size={45}
              borderRadius={30}
              resizeMode="cover"
            />
            {performer.isOnline && <OnlineDot right={0} top={2} />}
          </Box>
          <VStack alignSelf="center" space={1}>
            <Heading
              fontSize={17}
              w="100%"
              fontWeight={500}
              color={colors.darkText}
            >
              {isPrivate ? performer.username : `${performer.name || performer.username}’s chat`}
            </Heading>

            <Text fontSize={14} color={colors.secondaryText}>
              {performer.dateOfBirth && getBirthday(performer.dateOfBirth)}
              {performer.dateOfBirth &&
                `, ${formatZodiac(performer.dateOfBirth)}`}
            </Text>
          </VStack>
        </HStack>
      </TouchableOpacity>
    </HStack>
  );
};

export default ChatHeader;
