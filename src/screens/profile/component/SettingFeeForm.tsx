import React, { useState } from "react";
import {
  Box,
  FormControl,
  Text,
  Divider,
  View,
  HStack,
  ScrollView,
} from "native-base";
import { Controller, useForm } from "react-hook-form";
import { colors } from "utils/theme";
import Button from "components/uis/Button";
import styles from "./style";
import { Alert, TextInput } from "react-native";
import { IPerformer } from "src/interfaces";
import { connect } from "react-redux";
import { updatePerformer } from "services/redux/user/actions";
import { useNavigation } from "@react-navigation/core";
import Ionicons from "react-native-vector-icons/Ionicons";
interface IProps {
  // control: any;
  formErrors: any;
  submitting: boolean;
  current: IPerformer;
  updatePerformer: Function;
  updateCurrentUserAvatar: Function;
  updateCurrentUserCover: Function;
}
const SettingFeeForm = ({
  formErrors,
  submitting,
  current,
  updatePerformer: handleUpdatePerformer,
}: IProps): React.ReactElement => {
  const defaultValues = {
    ...current,
  };
  useState("");
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues });
  const navigation = useNavigation() as any;
  const onSubmit = async (data: any): Promise<void> => {
    submit(data);
  };
  const submit = async (data) => {
    data.privateChatPrice = Number(data.privateChatPrice);
    try {
      handleUpdatePerformer({
        ...current,
        ...data,
      });
      Alert.alert("Posted successfully!");
      navigation.navigate("Profile");
    } catch {
      Alert.alert("Something went wrong, please try again later");
    }
  };
  return (
    <View style={styles.container}>
      <ScrollView w={"100%"}>
        <HStack space={5} style={styles.settingFeeStack}>
          <View flex={2}>
            <Divider borderColor={colors.divider} />
            <FormControl>
              <Controller
                control={control}
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    value={value.toString()}
                    placeholder=""
                    keyboardType="numeric"
                    variant="unstyled"
                    onChangeText={(val) => onChange(val)}
                    borderColor={colors.lightText}
                    borderWidth={1}
                    autoCapitalize="none"
                    color={colors.lightText}
                    fontSize={15}
                    // letterSpacing={0.2}
                    textAlign="center"
                  />
                )}
                name="privateChatPrice"
                rules={{
                  required: "Please input private chat price",
                }}
              />
            </FormControl>
            <Divider borderColor={colors.divider} />
          </View>
          <View flex={2}>
            <Ionicons name="heart" color={colors.ruby} size={20}></Ionicons>
            <Text color={colors.lightText} fontSize={10}>
              {" "}
              / per minute
            </Text>
          </View>
          <View flex={3}>
            <Text color={colors.lightText} fontSize={18}>
              Private Chat fee
            </Text>
          </View>
        </HStack>
        <HStack space={5} style={styles.settingFeeStack}>
          <View flex={2}>
            <Divider borderColor={colors.divider} />
            <FormControl>
              <Controller
                control={control}
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    value={value}
                    placeholder=""
                    keyboardType="numeric"
                    variant="unstyled"
                    onChangeText={(val) => onChange(val)}
                    borderColor={colors.lightText}
                    borderWidth={1}
                    autoCapitalize="none"
                    color={colors.lightText}
                    fontSize={15}
                    flex={1}
                    // letterSpacing={0.2}
                    textAlign="center"
                  />
                )}
                name="mailPrice"
              />
            </FormControl>
            <Divider borderColor={colors.divider} />
          </View>
          <View flex={2}>
            <Ionicons name="heart" color={colors.ruby} size={20}></Ionicons>
            <Text color={colors.lightText} fontSize={10}>
              {" "}
              / per 50 characters
            </Text>
          </View>
          <View flex={3}>
            <Text color={colors.lightText} fontSize={18}>
              Mail Me Fee
            </Text>
          </View>
        </HStack>
      </ScrollView>
      <Box alignSelf="center" my={5}>
        <Button
          colorScheme="primary"
          onPress={handleSubmit(onSubmit)}
          disabled={submitting}
          label="Save Changes"
        />
      </Box>
    </View>
  );
};
const mapStates = (state: any) => ({
  ...state.user,
  isLoggedIn: state.auth.loggedIn,
});
const mapDispatch = {
  updatePerformer,
};
export default connect(mapStates, mapDispatch)(SettingFeeForm);
