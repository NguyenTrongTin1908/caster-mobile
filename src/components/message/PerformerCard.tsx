import React from "react";
import { TouchableOpacity, View } from "react-native";
import { Box, HStack, VStack, Text, Heading, Image } from "native-base";
import { colors } from "utils/theme";
import { IPerformer } from "interfaces/performer";
import { useNavigation } from "@react-navigation/native";
import OnlineDot from "components/uis/OnlineDot";
import { formatDateFromnow, getBirthday, formatZodiac } from "lib/date";
interface IProps {
  performer: IPerformer;
  //use for private chat
  navigationScreen?: string;
  navigationParams?: {
    conversationId: string;
  };
}
const PerformerCard = ({
  performer,
  navigationScreen,
  navigationParams,
}: IProps): React.ReactElement => {
  const navigation = useNavigation() as any;
  return (
    <Box w="100%" my={2.5}>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate(navigationScreen, {
            performer: performer,
          });
        }}
      >
        <HStack space={3}>
          <Box position="relative">
            <Image
              source={
                performer &&
                (performer.avatar
                  ? { uri: performer.avatar }
                  : require("../../assets/bg.jpg"))
              }
              alt={"avatar"}
              size={60}
              borderRadius={30}
              resizeMode="cover"
            />
            <View></View>
            {performer?.isOnline ? <OnlineDot right={0} top={2} /> : null}
          </Box>
          <VStack alignSelf="center" space={1}>
            <Heading
              fontSize={17}
              w="100%"
              fontWeight={500}
              color={colors.lightText}
            >
              {performer &&
                (performer.name != " "
                  ? `${performer.name}`
                  : `${performer.username}`)}
            </Heading>
            <Text fontSize={14} color={colors.lightText}>
              {performer && (performer.country || "UN")}
              {performer && ` ,  ${performer?.gender || "female"}`}
            </Text>
          </VStack>
          <Text
            my={3}
            ml="auto"
            fontSize={14}
            letterSpacing={-0.15}
            color={colors.lightText}
          >
            {performer &&
              (performer.isOnline
                ? "Online"
                : performer.offlineAt
                ? formatDateFromnow(performer.offlineAt)
                : "Few days ago")}
          </Text>
        </HStack>
      </TouchableOpacity>
    </Box>
  );
};
export default PerformerCard;
