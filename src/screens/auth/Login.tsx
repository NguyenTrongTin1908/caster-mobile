import { Alert, ImageBackground, StyleSheet, TouchableOpacity } from 'react-native';
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
  Divider,
  Spinner,
  ScrollView
} from 'native-base';
import { Controller, useForm } from 'react-hook-form';
import { connect } from 'react-redux';
import { login, resetLogin } from 'services/redux/auth/actions';
import KeyboardDismiss from 'components/uis/KeyboardDismiss';
import React, { useContext, useEffect } from 'react';
import { colors, Fonts, padding, Sizes } from 'utils/theme';
import Button from 'components/uis/Button';
import ErrorMessage from 'components/uis/ErrorMessage';
import { useNavigation } from '@react-navigation/core';
import LinearGradient from 'react-native-linear-gradient';
import { color } from 'native-base/lib/typescript/theme/styled-system';

interface Props {
  handleLogin: Function;
  handleResetLogin: Function;
  authLogin: {
    error: any;
    requesting: boolean;
    success: boolean;
  };
}

const Login = ({ handleLogin, handleResetLogin, authLogin }: Props): React.ReactElement => {
  const navigation = useNavigation() as any;
  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [useContext]);

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm();

  const onSubmit = async ({ username, password }: any): Promise<void> => {
    handleLogin({
      username,
      password
    });
  };

  // handle login status from redux
  useEffect((): any => {
    const { success, error } = authLogin;
    if (!success && !error) return;
    console.log(error);

    if (error) {
      handleResetLogin();
      return Alert.alert(error?.data?.message || 'An error occurred, please try again!');
    }

    if (success) {
      return navigation.navigate('MainTabNav');
    }
  }, [authLogin.success, authLogin.error]);

  return (
    <KeyboardDismiss>
      <VStack flex={1} w="100%" mx="auto" justifyContent="space-between">
        <KeyboardAvoidingView>
          <ImageBackground
            style={{ width: '100%', height: '100%' }}
            source={require('assets/bg.jpg')}
            resizeMode="cover">
            <LinearGradient
              start={{ x: 0, y: 1 }}
              end={{ x: 0, y: 0 }}
              colors={['black', 'rgba(0,0.10,0,0.77)', 'rgba(0,0,0,0.1)']}
              style={{ flex: 1, paddingHorizontal: Sizes.fixPadding * 2.0 }}>
              <Box px={padding.p5} py={20}>
                <HStack space={2} alignSelf="center" mb={20}>
                  <Heading alignSelf="center" fontSize={30} color={colors.lightText} bold letterSpacing={-1}>
                    Welcome Back
                  </Heading>
                  <Image
                    source={require('assets/heart-purple.png')}
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
                        onChangeText={val => onChange(val)}
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
                    rules={{ required: 'Email or username is required.' }}
                    defaultValue=""
                  />
                  {errors.username && (
                    <ErrorMessage message={errors.username?.message || 'Email or username is required.'} />
                  )}
                </FormControl>
                <FormControl>
                  <Controller
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <Input
                        p={4}
                        borderColor={colors.inpBorderColor}
                        onChangeText={val => onChange(val)}
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
                      required: 'Password is required.',
                      minLength: {
                        value: 6,
                        message: 'Password is minimum 6 characters.'
                      }
                    }}
                    defaultValue=""
                  />
                  {errors.password && <ErrorMessage message={errors.password?.message || 'Password is required.'} />}
                </FormControl>

                <VStack space={3}>
                  <Flex alignSelf="center" width={'100%'}>
                    <TouchableOpacity
                      activeOpacity={0.9}
                      disabled={authLogin.requesting}
                      onPress={handleSubmit(onSubmit)}>
                      <LinearGradient
                        start={{ x: 1, y: 0 }}
                        end={{ x: 0, y: 0 }}
                        colors={['rgba(244, 67, 54, 0.9)', 'rgba(244, 67, 54, 0.6)', 'rgba(244, 67, 54, 0.3)']}
                        style={styles.loginButtonStyle}>
                        <Text style={{ fontWeight: 'bold', color: colors.lightText }}>Continue</Text>
                      </LinearGradient>
                    </TouchableOpacity>
                    {/* <Button
                      // colorScheme="tertiary"
                      onPress={handleSubmit(onSubmit)}
                      disabled={authLogin.requesting}
                      isLoading={authLogin.requesting}
                      spinner={<Spinner size="sm" color={colors.primary} />}
                      isLoadingText="Submitting"
                      style={{ ...styles.loginButtonStyle }}>
                      <LinearGradient
                        start={{ x: 1, y: 0 }}
                        end={{ x: 0, y: 0 }}
                        colors={['rgba(244, 67, 54, 0.9)', 'rgba(244, 67, 54, 0.6)', 'rgba(244, 67, 54, 0.3)']}
                        style={styles.loginButtonStyle}>
                        <Text style={{ fontWeight: 'bold', color: colors.lightText }}>Login</Text>
                      </LinearGradient>
                    </Button> */}
                  </Flex>
                  <Link alignSelf="center" onPress={(): void => navigation.navigate('IntroNav/ForgotPassword')}>
                    <Text fontWeight={300} fontSize={14} color={colors.primary}>
                      Forgot Password?
                    </Text>
                  </Link>
                </VStack>
              </Box>
            </LinearGradient>
          </ImageBackground>
        </KeyboardAvoidingView>

        <Link alignSelf="center" onPress={(): void => navigation.navigate('IntroNav/Register')}>
          <Text fontSize={12} color={colors.primary}>
            CREATE AN ACCOUNT
          </Text>
        </Link>
      </VStack>
    </KeyboardDismiss>
  );
};

const styles = StyleSheet.create({
  textFieldContentStyle: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 50.0,
    paddingHorizontal: Sizes.fixPadding * 2.0,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: Sizes.fixPadding * 2.5,
    marginBottom: Sizes.fixPadding,
    fontWeight: 'bold',
    color: colors.lightText
  },
  loginButtonStyle: {
    borderRadius: Sizes.fixPadding * 2.5,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Sizes.fixPadding + 10.0,
    height: 50.0,
    marginBottom: Sizes.fixPadding * 2.0,
    backgroundColor: colors.btnPrimaryColor,
    width: '100%'
  }
});

const mapStateToProp = (state: any): any => ({
  ...state.auth
});

const mapDispatch = {
  handleLogin: login,
  handleResetLogin: resetLogin
};
export default connect(mapStateToProp, mapDispatch)(Login);
