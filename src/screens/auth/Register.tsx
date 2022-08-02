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
  useToast,
  Divider,
  Image,
  Spinner
} from 'native-base';
import { Controller, useForm } from 'react-hook-form';
import LinearGradient from 'react-native-linear-gradient';
import KeyboardDismiss from 'components/uis/KeyboardDismiss';
import React, { useContext, useEffect, useState } from 'react';
import { authService } from 'services/auth.service';
import BackButton from 'components/uis/BackButton';
import Button from 'components/uis/Button';
import ErrorMessage from 'components/uis/ErrorMessage';
import { useNavigation } from '@react-navigation/core';
import { colors, Fonts, padding, Sizes } from 'utils/theme';

const Register = (): React.ReactElement => {
  const navigation = useNavigation() as any;
  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
      title: '',
      headerLeft: () => <BackButton />,
      headerRight: () => null
    });
  }, [useContext]);

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm();
  const [submitting, setSubmitting] = useState(false);
  const toast = useToast();

  const onSubmit = async ({ email, password, username, conPassword }: any): Promise<void> => {
    if (password !== conPassword) {
      return toast.show({
        title: 'Error',
        status: 'error',
        description: 'Confirm password is wrong'
      });
    }

    setSubmitting(true);
    await authService
      .userRegister({
        email,
        password,
        username
      })
      .then(res => {
        setSubmitting(false);
        toast.show({
          title: 'Sign up successfully',
          status: 'success',
          description: res.data?.data?.message || 'Thanks for signing up with us.'
        });
        return navigation.navigate('IntroNav/Login');
      })
      .catch(async e => {
        // const error = await Promise.resolve(e);
        setSubmitting(false);
        Alert.alert('An error occurred, please try again!');
      });
  };

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
                {/* <Divider my={0.5} bgColor={colors.inpBorderColor} /> */}
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
                        placeholder="Username"
                        placeholderTextColor={colors.lightText}
                        style={{ ...styles.textFieldContentStyle }}
                      />
                    )}
                    name="username"
                    rules={{ required: 'Username is required.' }}
                    defaultValue=""
                  />
                  {errors.username && <ErrorMessage message={errors.username?.message || 'Name is required.'} />}
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
                        letterSpacing={0.2}
                        textAlign="left"
                        placeholder="Email"
                        placeholderTextColor={colors.lightText}
                        style={{ ...styles.textFieldContentStyle }}
                      />
                    )}
                    name="email"
                    rules={{ required: 'Email is required.' }}
                    defaultValue=""
                  />
                  {errors.email && <ErrorMessage message={errors.email?.message || 'Email is required.'} />}
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
                        letterSpacing={0.2}
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
                        type="password"
                        placeholder="Confirm password"
                        placeholderTextColor={colors.lightText}
                        style={{ ...styles.textFieldContentStyle }}
                      />
                    )}
                    name="conPassword"
                    rules={{
                      required: 'Confirm password is required.',
                      minLength: {
                        value: 6,
                        message: 'Confirm password is minimum 6 characters.'
                      }
                    }}
                    defaultValue=""
                  />
                  {errors.conPassword && (
                    <ErrorMessage message={errors.conPassword?.message || 'Confirm password is required.'} />
                  )}
                </FormControl>

                <Flex alignSelf="center" width={'100%'}>
                  <TouchableOpacity
                    activeOpacity={0.9}
                    // disabled={authLogin.requesting}
                    onPress={handleSubmit(onSubmit)}>
                    <LinearGradient
                      start={{ x: 1, y: 0 }}
                      end={{ x: 0, y: 0 }}
                      colors={['rgba(244, 67, 54, 0.9)', 'rgba(244, 67, 54, 0.6)', 'rgba(244, 67, 54, 0.3)']}
                      style={styles.loginButtonStyle}>
                      <Text style={{ fontWeight: 'bold', color: colors.lightText }}>Register</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </Flex>
                <HStack style={{ ...styles.loginRedirect }}>
                  <Text fontSize={12} color={colors.primary}>
                    ARE YOU MEMBER?{' '}
                  </Text>
                  <Link onPress={(): void => navigation.navigate('IntroNav/Login')}>
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
  },
  loginRedirect: {
    alignSelf: 'center',
    marginTop: Sizes.fixPadding + 10.0
  }
});

export default Register;
