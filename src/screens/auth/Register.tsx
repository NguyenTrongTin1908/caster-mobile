import { Alert } from 'react-native';
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
  Spinner
} from 'native-base';
import { Controller, useForm } from 'react-hook-form';
import KeyboardDismiss from 'components/uis/KeyboardDismiss';
import React, { useContext, useEffect, useState } from 'react';
import { authService } from 'services/auth.service';
import BackButton from 'components/uis/BackButton';
import { colors } from 'utils/theme';
import Button from 'components/uis/Button';
import ErrorMessage from 'components/uis/ErrorMessage';
import { useNavigation } from '@react-navigation/core';

const Register = (): React.ReactElement => {
  const navigation = useNavigation() as any;
  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
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

  const onSubmit = async ({
    email,
    password,
    username,
    conPassword
  }: any): Promise<void> => {
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
        type: 'student', //should recheck site requirement
        username
      })
      .then((res) => {
        setSubmitting(false);
        toast.show({
          title: 'Sign up successfully',
          status: 'success',
          description:
            res.data?.data?.message || 'Thanks for signing up with us.'
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
        safeAreaX={6}
        safeAreaBottom={20}
        py={12}
        flex={1}
        w="100%"
        mx="auto"
        justifyContent="space-between">
        <KeyboardAvoidingView>
          <Box>
            <Heading
              fontSize={30}
              color={colors.darkText}
              bold
              letterSpacing={-1}
              alignSelf="center"
              mb={20}>
              Create your account
            </Heading>
            <Divider my={0.5} bgColor={colors.inpBorderColor} />
            <FormControl>
              <Controller
                control={control}
                render={({ field: { onChange, value } }) => (
                  <Input
                    InputLeftElement={
                      <Text color={colors.inpLabelColor} fontSize={17}>
                        Name
                      </Text>
                    }
                    py={4}
                    variant="underlined"
                    borderColor={colors.inpBorderColor}
                    onChangeText={(val) => onChange(val)}
                    value={value}
                    autoCapitalize="none"
                    color={colors.darkText}
                    fontSize={20}
                    letterSpacing={0.2}
                    textAlign="left"
                  />
                )}
                name="username"
                rules={{ required: 'Name is required.' }}
                defaultValue=""
              />
              {errors.username && (
                <ErrorMessage
                  message={errors.username?.message || 'Name is required.'}
                />
              )}
            </FormControl>
            <FormControl>
              <Controller
                control={control}
                render={({ field: { onChange, value } }) => (
                  <Input
                    InputLeftElement={
                      <Text color={colors.inpLabelColor} fontSize={17}>
                        Email
                      </Text>
                    }
                    py={4}
                    variant="underlined"
                    borderColor={colors.inpBorderColor}
                    onChangeText={(val) => onChange(val)}
                    value={value}
                    autoCapitalize="none"
                    color={colors.darkText}
                    fontSize={20}
                    letterSpacing={0.2}
                    textAlign="left"
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
            <FormControl>
              <Controller
                control={control}
                render={({ field: { onChange, value } }) => (
                  <Input
                    InputLeftElement={
                      <Text color={colors.inpLabelColor} fontSize={17}>
                        Password
                      </Text>
                    }
                    py={4}
                    variant="underlined"
                    borderColor={colors.inpBorderColor}
                    onChangeText={(val) => onChange(val)}
                    value={value}
                    autoCapitalize="none"
                    color={colors.darkText}
                    fontSize={20}
                    letterSpacing={3}
                    textAlign="left"
                    type="password"
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
              {errors.password && (
                <ErrorMessage
                  message={errors.password?.message || 'Password is required.'}
                />
              )}
            </FormControl>
            <FormControl>
              <Controller
                control={control}
                render={({ field: { onChange, value } }) => (
                  <Input
                    InputLeftElement={
                      <Text color={colors.inpLabelColor} fontSize={17}>
                        Confirm password
                      </Text>
                    }
                    py={4}
                    variant="underlined"
                    borderColor={colors.inpBorderColor}
                    onChangeText={(val) => onChange(val)}
                    value={value}
                    autoCapitalize="none"
                    color={colors.darkText}
                    fontSize={20}
                    letterSpacing={3}
                    textAlign="left"
                    type="password"
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
                <ErrorMessage
                  message={
                    errors.conPassword?.message ||
                    'Confirm password is required.'
                  }
                />
              )}
            </FormControl>

            <Flex alignSelf="center" mt={8}>
              <Button
                mt={3}
                colorScheme="tertiary"
                onPress={handleSubmit(onSubmit)}
                disabled={submitting}
                isLoading={submitting}
                spinner={<Spinner size="sm" color={colors.primary} />}
                isLoadingText="Submitting"
                label="Register"
              />
            </Flex>
          </Box>
        </KeyboardAvoidingView>

        <HStack alignSelf="center">
          <Text fontSize={12}>ARE YOU MEMBER? </Text>
          <Link onPress={(): void => navigation.navigate('IntroNav/Login')}>
            <Text fontSize={12} color={colors.primary}>
              LOGIN
            </Text>
          </Link>
        </HStack>
      </VStack>
    </KeyboardDismiss>
  );
};

export default Register;
