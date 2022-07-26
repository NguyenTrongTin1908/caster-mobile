import { Alert, ImageBackground, StyleSheet, TouchableOpacity } from 'react-native';
import {
  Flex,
  Box,
  FormControl,
  Heading,
  Input,
  KeyboardAvoidingView,
  Text,
  VStack,
  useToast,
  Divider,
  Spinner,
  HStack,
  Image
} from 'native-base';
import { Controller, useForm } from 'react-hook-form';
import LinearGradient from 'react-native-linear-gradient';
import { Fonts, padding, Sizes } from 'utils/theme';


import KeyboardDismiss from 'components/uis/KeyboardDismiss';
import React, { useContext, useEffect, useState } from 'react';
import { authService } from 'services/auth.service';
import BackButton from 'components/uis/BackButton';
import { colors } from 'utils/theme';
import Button from 'components/uis/Button';
import ErrorMessage from 'components/uis/ErrorMessage';
import { useNavigation } from '@react-navigation/core';
import { IForgotPassword } from 'src/interfaces';

const defaultValues = { email: '' };

const ForgotPassword = (): React.ReactElement => {
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
  } = useForm({ defaultValues });
  const [submitting, setSubmitting] = useState(false);
  const toast = useToast();

  const onSubmit = async ({ email }: IForgotPassword): Promise<void> => {
    setSubmitting(true);
    await authService
      .forgotPassword({ email, type: 'user' })
      .then(() => {
        setSubmitting(false);
        toast.show({
          title: 'Send request success',
          status: 'success',
          description: 'New password have been sent to your email!'
        });
        return navigation.navigate('IntroNav/Login');
      })
      .catch(async (e) => {
        // const error = await Promise.resolve(e);
        setSubmitting(false);
        Alert.alert('An error occurred, please try again!');
      });
  };

  return (
    <KeyboardDismiss>
      <VStack
        flex={1}
        w="100%"
        mx="auto"
        justifyContent="space-between">
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
                    Forgot Password
                  </Heading>
                  <Image
                    source={require('assets/heart-purple.png')}
                    alt="heart-purple"
                    size="58px"
                    resizeMode="contain"
                  />
                </HStack>
                <Text my={5} fontSize={14} color={colors.lightText} letterSpacing={0.2}>
                  A confirmation link will be sent to your email
                </Text>

                {/* <FormControl>
              <Controller
                control={control}
                render={({ field: { onChange, value } }) => (
                  <Select
                    py={4}
                    variant="underlined"
                    borderColor={colors.inpBorderColor}
                    onValueChange={(val) => onChange(val)}
                    color={colors.darkText}
                    selectedValue={value}
                    _selectedItem={{ bg: colors.primary }}>
                    <Select.Item label="User" value="user" />
                    <Select.Item label="Model" value="model" />
                    <Select.Item label="Studio" value="studio" />
                  </Select>
                )}
                name="type"
                rules={{ required: 'Email is required.' }}
                defaultValue=""
              />
              {errors.email && (
                <ErrorMessage
                  message={errors.email?.message || 'Email is required.'}
                />
              )}
            </FormControl> */}

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
                  {errors.email && (
                    <ErrorMessage
                      message={errors.email?.message || 'Email is required.'}
                    />
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
                      <Text style={{ fontWeight: 'bold', color: colors.lightText }}>Send link</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </Flex>
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
    alignSelf: "center",
    marginTop: Sizes.fixPadding + 10.0
  },
});

export default ForgotPassword;
