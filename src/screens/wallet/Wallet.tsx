import React, { useEffect, useState, useContext } from "react";
import { SafeAreaView, TouchableOpacity } from "react-native";
import {
  Box,
  Button,
  FlatList,
  Heading,
  HStack,
  Radio,
  Spacer,
  Text,
  View,
} from "native-base";
import { useNavigation } from "@react-navigation/core";
import PerformerCard from "components/message/PerformerCard";
import { performerService } from "services/perfomer.service";
import { IPerformer } from "interfaces/performer";
import LoadingSpinner from "components/uis/LoadingSpinner";
import BackButton from "components/uis/BackButton";
import { colors } from "utils/theme";
import styles from "./style";
import { IBody, ICountry } from "interfaces/utils";
import { utilsService } from "services/utils.service";
import HeaderMenu from "components/tab/HeaderMenu";
import BadgeText from "components/uis/BadgeText";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { connect } from "react-redux";
import { background } from "native-base/lib/typescript/theme/styled-system";

interface IProps {
  countries: ICountry[];
  bodyInfo: IBody;
  user: IPerformer;
}
const Wallet = ({ user }: IProps): React.ReactElement => {
  const [performers, setPerformers] = useState([] as Array<IPerformer>);
  const navigation = useNavigation() as any;

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Box flex={1} mx="auto" w="100%">
        <Heading
          mb={4}
          fontSize={36}
          textAlign="center"
          color={colors.lightText}
          bold
        >
          Wallet
        </Heading>
        <View flexDirection="row" justifyContent={"space-around"} marginY={16}>
          <View alignItems={"center"} flexDirection="column" textAlign="center">
            <FontAwesome name="heart" size={80} color={colors.primary} />
            <Text color={colors.lightText} marginY={2} fontSize={20}>
              {(user?.rubyBalance || 0).toFixed(2)}
            </Text>
          </View>

          <Button
            maxH={20}
            alignSelf="center"
            colorScheme="secondary"
            onPress={() => navigation.navigate("TokenPackage")}
          >
            Add More
          </Button>
        </View>

        <View flexDirection="row" justifyContent={"space-around"} marginY={16}>
          <View alignItems={"center"} flexDirection="column" textAlign="center">
            <FontAwesome name="diamond" size={80} color={colors.diamondIcon} />
            <Text color={colors.lightText} marginY={2} fontSize={20}>
              {(user?.balance || 0).toFixed(2)}
            </Text>
          </View>

          <Button maxH={20} alignSelf="center" colorScheme="secondary">
            Request a Payout
          </Button>
        </View>

        <HeaderMenu />
      </Box>
    </SafeAreaView>
  );
};
const mapStateToProp = (state: any) => ({
  user: state.user.current,
});

export default connect(mapStateToProp)(Wallet);
