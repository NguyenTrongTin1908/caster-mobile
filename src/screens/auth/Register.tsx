import {
  Alert,
  ImageBackground,
  Pressable,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import {
  Flex,
  Box,
  FormControl,
  HStack,
  Input,
  KeyboardAvoidingView,
  Link,
  Text,
  VStack,
  useToast,
  Image,
  Radio,
  Stack,
  Checkbox,
  View,
  Icon,
} from "native-base";
import { Controller, useForm } from "react-hook-form";
import LinearGradient from "react-native-linear-gradient";
import KeyboardDismiss from "components/uis/KeyboardDismiss";
import { loginSocial } from "services/redux/auth/actions";
import React, { useContext, useEffect, useState } from "react";
import { authService } from "services/auth.service";
import BackButton from "components/uis/BackButton";
import ErrorMessage from "components/uis/ErrorMessage";
import { useNavigation } from "@react-navigation/core";
import { colors, padding, Sizes } from "utils/theme";
import { connect } from "react-redux";

import {
  GoogleSignin,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

interface Props {
  fcmToken: any;
  system: any;
  loginSocial: Function;
  authLogin: {
    error: any;
    requesting: boolean;
    success: boolean;
  };
}

const Register = ({
  fcmToken,
  system,
  loginSocial,
  authLogin,
}: Props): React.ReactElement => {
  const navigation = useNavigation() as any;
  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
      title: "",
      headerLeft: () => <BackButton />,
      headerRight: () => null,
    });
  }, [useContext]);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [submitting, setSubmitting] = useState(false);
  const [isAccept, setIsAccept] = useState(false);
  const [isPasswordSecure, setIsPasswordSecure] = useState(true);

  const toast = useToast();

  const signInWithGoogle = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      if (userInfo.idToken) {
        const payload = { tokenId: userInfo.idToken, role: "performer" };
        const data = (await authService.loginGoogle(payload)).data;
        data.token && loginSocial({ token: data.token });
      }
    } catch (error: any) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation (e.g. sign in) is in progress already
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // play services not available or outdated
      } else {
        // some other error happened
      }
    }
  };

  const onSubmit = async ({
    password,
    email,
    gender,
    isAccept,
  }: any): Promise<void> => {
    if (!isAccept) {
      toast.show({
        title: "Sign up failed",
        description:
          "Please confirm that I am at least 18 years old and agree to the Caster Terms of Service",
      });
      return;
    }
    setSubmitting(true);
    await authService
      .userRegister({
        password,
        email,
        gender,
      })
      .then((res) => {
        setSubmitting(false);
        toast.show({
          title: "Sign up successfully",
          description:
            res.data?.data?.message || "Thanks for signing up with us.",
        });
        return navigation.navigate("IntroNav/Login");
      })
      .catch(async (e) => {
        setSubmitting(false);
        Alert.alert("An error occurred, please try again!");
      });
  };

  return (
    <KeyboardDismiss>
      <VStack flex={1} w="100%" mx="auto" justifyContent="space-between">
        <KeyboardAvoidingView>
          <ImageBackground
            style={{ width: "100%", height: "100%" }}
            source={require("assets/bg.jpg")}
            resizeMode="cover"
          >
            <LinearGradient
              start={{ x: 0, y: 1 }}
              end={{ x: 0, y: 0 }}
              colors={["white", "white", "white"]}
              style={{ flex: 1, paddingHorizontal: Sizes.fixPadding * 2.0 }}
            >
              <Box px={padding.p5} py={20}>
                <HStack space={2} alignSelf="center" mb={5}>
                  <Image
                    source={{ uri: system.data.logoUrl }}
                    alt="logo"
                    size={55}
                    width="100%"
                    resizeMode="contain"
                  />
                </HStack>
                <Flex
                  direction="row"
                  alignSelf="center"
                  justifyContent="center"
                  width={"100%"}
                >
                  <TouchableOpacity
                    activeOpacity={0.9}
                    disabled={authLogin.requesting}
                    onPress={(): void => navigation.navigate("IntroNav/Login")}
                  >
                    <View style={styles.ggLoginButtonStyle}>
                      <Image
                        source={{ uri: system.data.favicon }}
                        alt="logo"
                        size={22}
                      />
                      <Text
                        style={{
                          fontWeight: "bold",
                          color: colors.darkGray,
                        }}
                      >
                        Caster
                      </Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity activeOpacity={0.9} disabled>
                    <View style={styles.ggLoginButtonStyle}>
                      <FontAwesome name="apple" size={20} />
                      <Text
                        style={{
                          fontWeight: "bold",
                          color: colors.darkGray,
                        }}
                      >
                        IOS
                      </Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity
                    activeOpacity={0.9}
                    disabled={authLogin.requesting}
                    onPress={signInWithGoogle}
                  >
                    <View style={styles.ggLoginButtonStyle}>
                      <FontAwesome name="google" size={20} />
                      <Text
                        style={{
                          fontWeight: "bold",
                          color: colors.darkGray,
                        }}
                      >
                        Google
                      </Text>
                    </View>
                  </TouchableOpacity>
                </Flex>
                <View style={{ flexDirection: "row" }}>
                  <View style={styles.lineText} />
                  <Text
                    style={{
                      alignSelf: "center",
                      paddingHorizontal: 5,
                      fontSize: 22,
                    }}
                  >
                    OR Create Account
                  </Text>
                  <View style={styles.lineText} />
                </View>

                <FormControl marginTop={2}>
                  <Controller
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <Input
                        p={4}
                        borderColor={colors.inpBorderColor}
                        borderRadius={30}
                        onChangeText={(val) => onChange(val)}
                        value={value}
                        autoCapitalize="none"
                        fontSize={15}
                        letterSpacing={0.2}
                        textAlign="left"
                        placeholder="Email Address"
                        placeholderTextColor={colors.darkGray}
                        style={{ ...styles.textFieldContentStyle }}
                      />
                    )}
                    name="email"
                    rules={{
                      required: "Email is required.",
                      pattern: {
                        value: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g,
                        message: "Invalid email !",
                      },
                    }}
                    defaultValue=""
                  />
                  {errors.email && (
                    <ErrorMessage
                      message={
                        errors.email?.message?.toString() ||
                        "Email is required."
                      }
                    />
                  )}
                </FormControl>
                <FormControl marginTop={2}>
                  <Controller
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <Input
                        secureTextEntry={isPasswordSecure}
                        InputRightElement={
                          <Pressable
                            onPress={() =>
                              setIsPasswordSecure(!isPasswordSecure)
                            }
                          >
                            <Icon
                              as={
                                <MaterialIcons
                                  name={
                                    isPasswordSecure
                                      ? "visibility-off"
                                      : "visibility"
                                  }
                                />
                              }
                              size={5}
                              mr="2"
                              color="muted.400"
                            />
                          </Pressable>
                        }
                        p={4}
                        borderColor={colors.inpBorderColor}
                        borderRadius={30}
                        onChangeText={(val) => onChange(val)}
                        value={value}
                        autoCapitalize="none"
                        fontSize={15}
                        letterSpacing={0.2}
                        textAlign="left"
                        type="password"
                        placeholder="Password"
                        placeholderTextColor={colors.darkGray}
                        style={{ ...styles.textFieldContentStyle }}
                      />
                    )}
                    name="password"
                    rules={{
                      required: "Password is required.",
                      minLength: {
                        value: 6,
                        message: "Password is minimum 6 characters.",
                      },
                      pattern: {
                        value:
                          /^(?=.{6,})(?=.*[a-z])(?=.*[0-9])(?=.*[A-Z])(?=.*[^\w\d]).*$/g,
                        message:
                          " Password must have at least 1 number, 1 uppercase letter, 1 lowercase letter & 1 special character",
                      },
                    }}
                    defaultValue=""
                  />
                  {errors.password && (
                    <ErrorMessage
                      message={
                        errors.password?.message?.toString() ||
                        "Password is required."
                      }
                    />
                  )}
                </FormControl>

                <FormControl marginTop={2}>
                  <Controller
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <Radio.Group
                        name="gender"
                        value={value}
                        onChange={(val) => onChange(val)}
                        defaultValue="male"
                        style={styles.radioModel}
                      >
                        <Stack
                          direction={"row"}
                          justifyContent={"center"}
                          space={2}
                          w="100%"
                          margin={"2"}
                        >
                          <Radio value="male">
                            <Text color={colors.darkGray}>Male</Text>
                          </Radio>
                          <Radio value="female">
                            <Text color={colors.darkGray}>Female</Text>
                          </Radio>
                        </Stack>
                      </Radio.Group>
                    )}
                    name="gender"
                    rules={{
                      required: "Password is required.",
                    }}
                    defaultValue="male"
                  />
                </FormControl>
                <Flex alignSelf="center" width={"100%"}>
                  <FormControl marginTop={2}>
                    <Controller
                      control={control}
                      render={({ field: { onChange, value } }) => (
                        <Checkbox
                          value="invalid"
                          isChecked={isAccept}
                          onChange={(val) => onChange(val)}
                        >
                          <Text>
                            I confirm that I am at least 18 years old and agree
                            to the{" "}
                            <Link href="https://caster.com/page/terms-of-use">
                              Caster Terms of Service
                            </Link>
                          </Text>
                        </Checkbox>
                      )}
                      name="isAccept"
                    />
                  </FormControl>

                  <TouchableOpacity
                    activeOpacity={0.6}
                    disabled={authLogin.requesting}
                    onPress={handleSubmit(onSubmit)}
                  >
                    <LinearGradient
                      start={{ x: 1, y: 0 }}
                      end={{ x: 0, y: 0 }}
                      colors={[
                        "rgba(244, 67, 54, 0.9)",
                        "rgba(244, 67, 54, 0.6)",
                        "rgba(244, 67, 54, 0.3)",
                      ]}
                      style={{
                        ...styles.loginButtonStyle,
                        opacity: authLogin.requesting ? 0.6 : 1,
                      }}
                    >
                      <Text
                        style={{ fontWeight: "bold", color: colors.lightText }}
                      >
                        Create Account
                      </Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </Flex>
                <HStack style={{ ...styles.loginRedirect }}>
                  <Text fontSize={12} color={colors.primary}>
                    ARE YOU MEMBER?{" "}
                  </Text>
                  <Link
                    onPress={(): void => navigation.navigate("IntroNav/Login")}
                  >
                    <Text fontSize={12} color={colors.secondary}>
                      LOGIN
                    </Text>
                  </Link>
                </HStack>
              </Box>
            </LinearGradient>
          </ImageBackground>
        </KeyboardAvoidingView>
      </VStack>
    </KeyboardDismiss>
  );
};

const styles = StyleSheet.create({
  textFieldContentStyle: {
    alignItems: "center",
    justifyContent: "center",
    height: 50.0,
    paddingHorizontal: Sizes.fixPadding * 2.0,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: Sizes.fixPadding * 2.5,
    fontWeight: "bold",
    color: colors.darkGray,
  },
  loginButtonStyle: {
    borderRadius: Sizes.fixPadding * 2.5,
    alignItems: "center",
    justifyContent: "center",
    marginTop: Sizes.fixPadding + 10.0,
    height: 50.0,
    marginBottom: Sizes.fixPadding * 2.0,
    backgroundColor: colors.btnPrimaryColor,
    width: "100%",
  },

  ggLoginButtonStyle: {
    alignItems: "center",
    justifyContent: "center",
    height: 80.0,
    width: 80.0,
    marginBottom: Sizes.fixPadding * 2.0,
    borderColor: colors.darkText,
    borderWidth: 1.0,
    margin: 1.0,
  },

  loginRedirect: {
    alignSelf: "center",
    marginTop: Sizes.fixPadding + 10.0,
  },
  radioModel: {
    fontWeight: "bold",
    // change the color property for better output
    color: colors.lightText,
    textAlign: "center",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 0,
  },

  lineText: {
    backgroundColor: "black",
    height: 2,
    flex: 1,
    alignSelf: "center",
  },
});

const mapStateToProp = (state: any): any => ({
  ...state.auth,
  system: { ...state.system },
});

const mapDispatch = {
  loginSocial: loginSocial,
};

export default connect(mapStateToProp)(Register);
