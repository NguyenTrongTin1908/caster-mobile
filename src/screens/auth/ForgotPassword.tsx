import { Alert } from 'react-native';
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
import { IForgotPassword } from 'src/interfaces';

const defaultValues = { email: '' };

const ForgotPassword = (): React.ReactElement => {
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
              Forgot password
            </Heading>
            <Text my={5} fontSize={14} color="#5B5B5B" letterSpacing={0.2}>
              A confirmation link will be sent to your email
            </Text>
            <Divider my={0.5} bgColor={colors.inpBorderColor} />

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

            <Flex alignSelf="center" mt={8}>
              <Button
                mt={3}
                colorScheme="tertiary"
                onPress={handleSubmit(onSubmit)}
                disabled={submitting}
                isLoading={submitting}
                spinner={<Spinner size="sm" color={colors.primary} />}
                isLoadingText="Submitting"
                label="Send link"
              />
            </Flex>
          </Box>
        </KeyboardAvoidingView>
      </VStack>
    </KeyboardDismiss>
  );
};

export default ForgotPassword;
