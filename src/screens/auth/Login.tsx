import {
  Alert,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import {
  Flex,
  Box,
  FormControl,
  HStack,
  Heading,
  Input,
  KeyboardAvoidingView,
  Link,
  Text,
  VStack,
  Image,
} from "native-base";
import { Controller, useForm } from "react-hook-form";
import { connect } from "react-redux";
import { login, loginSocial, resetLogin } from "services/redux/auth/actions";
import KeyboardDismiss from "components/uis/KeyboardDismiss";
import React, { useContext, useEffect } from "react";
import { colors, padding, Sizes } from "utils/theme";
import ErrorMessage from "components/uis/ErrorMessage";
import { useNavigation } from "@react-navigation/core";
import LinearGradient from "react-native-linear-gradient";
import {
  GoogleSignin,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import FontAwesome from "react-native-vector-icons/FontAwesome5Pro";
import { config } from "config";
import { authService } from "services/auth.service";
import { notificationService } from "services/notification.service";

interface Props {
  handleLogin: Function;
  handleResetLogin: Function;
  authLogin: {
    error: any;
    requesting: boolean;
    success: boolean;
  };
  fcmToken: any;
  loginSocial: Function;
}

const Login = ({
  handleLogin,
  handleResetLogin,
  authLogin,
  loginSocial,
  fcmToken,
}: Props): React.ReactElement => {
  const navigation = useNavigation() as any;
  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [useContext]);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async ({ username, password }: any): Promise<void> => {
    handleLogin({
      username,
      password,
      fcmToken: fcmToken.token,
    });
  };

  // handle login status from redux
  useEffect((): any => {
    const { success, error } = authLogin;
    if (!success && !error) return;
    if (error) {
      handleResetLogin();
      return Alert.alert(
        error?.data?.message || "An error occurred, please try again!"
      );
    }

    if (success) {
      fcmToken && notificationService.registerToken(fcmToken);

      return navigation.navigate("MainTabNav");
    }
  }, [authLogin.success, authLogin.error]);

  useEffect(() => {
    async function initGoogle() {
      GoogleSignin.configure({
        scopes: ["profile", "email"],
        webClientId: config.extra.googleClientId,
        forceCodeForRefreshToken: true, // [Android] related to `serverAuthCode`, read the docs link below *.
        offlineAccess: false,
      });
    }
    initGoogle();
  }, []);

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
              colors={["black", "rgba(0,0.10,0,0.77)", "rgba(0,0,0,0.1)"]}
              style={{ flex: 1, paddingHorizontal: Sizes.fixPadding * 2.0 }}
            >
              <Box px={padding.p5} py={20}>
                <HStack space={2} alignSelf="center" mb={20}>
                  <Heading
                    alignSelf="center"
                    fontSize={30}
                    color={colors.lightText}
                    bold
                    letterSpacing={-1}
                  >
                    Welcome Back
                  </Heading>
                  <Image
                    source={require("assets/heart-purple.png")}
                    alt="heart-purple"
                    size="58px"
                    resizeMode="contain"
                  />
                </HStack>
                <FormControl>
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
                        placeholder="Email / Username"
                        placeholderTextColor={colors.lightText}
                        style={{ ...styles.textFieldContentStyle }}
                      />
                    )}
                    name="username"
                    rules={{ required: "Email or username is required." }}
                    defaultValue=""
                  />
                  {errors.username && (
                    <ErrorMessage
                      message={
                        errors.username?.message ||
                        "Email or username is required."
                      }
                    />
                  )}
                </FormControl>
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
                        letterSpacing={3}
                        textAlign="left"
                        type="password"
                        placeholder="Password"
                        placeholderTextColor={colors.lightText}
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
                    }}
                    defaultValue=""
                  />
                  {errors.password && (
                    <ErrorMessage
                      message={
                        errors.password?.message || "Password is required."
                      }
                    />
                  )}
                </FormControl>

                <VStack space={3}>
                  <Flex alignSelf="center" width={"100%"}>
                    <TouchableOpacity
                      activeOpacity={0.9}
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
                        style={styles.loginButtonStyle}
                      >
                        <Text
                          style={{
                            fontWeight: "bold",
                            color: colors.lightText,
                          }}
                        >
                          Continue
                        </Text>
                      </LinearGradient>
                    </TouchableOpacity>
                    <TouchableOpacity
                      activeOpacity={0.9}
                      disabled={authLogin.requesting}
                      onPress={signInWithGoogle}
                    >
                      <LinearGradient
                        start={{ x: 1, y: 0 }}
                        end={{ x: 0, y: 0 }}
                        colors={[
                          "rgba(244, 67, 54, 0.9)",
                          "rgba(244, 67, 54, 0.6)",
                          "rgba(244, 67, 54, 0.3)",
                        ]}
                        style={styles.loginButtonStyle}
                      >
                        <Text
                          style={{
                            fontWeight: "bold",
                            color: colors.lightText,
                          }}
                        >
                          <FontAwesome name="google" size={20} /> Login with
                          Google
                        </Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  </Flex>
                  <Link
                    alignSelf="center"
                    onPress={(): void =>
                      navigation.navigate("IntroNav/ForgotPassword")
                    }
                  >
                    <Text fontWeight={300} fontSize={14} color={colors.primary}>
                      Forgot Password?
                    </Text>
                  </Link>
                  <Link
                    alignSelf="center"
                    onPress={(): void =>
                      navigation.navigate("IntroNav/Register")
                    }
                  >
                    <Text fontSize={12} color={colors.primary}>
                      CREATE AN ACCOUNT
                    </Text>
                  </Link>
                </VStack>
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
    // marginBottom: Sizes.fixPadding,
    fontWeight: "bold",
    color: colors.lightText,
  },
  loginButtonStyle: {
    borderRadius: Sizes.fixPadding * 2.5,
    alignItems: "center",
    justifyContent: "center",
    marginTop: Sizes.fixPadding + 10.0,
    height: 50.0,
    // marginBottom: Sizes.fixPadding * 2.0,
    backgroundColor: colors.btnPrimaryColor,
    width: "100%",
  },
});

const mapStateToProp = (state: any): any => ({
  ...state.auth,
});

const mapDispatch = {
  handleLogin: login,
  handleResetLogin: resetLogin,
  loginSocial: loginSocial,
};
export default connect(mapStateToProp, mapDispatch)(Login);
