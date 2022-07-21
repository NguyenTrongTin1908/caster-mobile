import React, { useEffect, useState, useContext } from 'react';
import { connect } from 'react-redux';
import {
  Box,
  Flex,
  ScrollView,
  Heading,
  Text,
  VStack,
  useToast,
  Image
} from 'native-base';
import { useForm } from 'react-hook-form';
import KeyboardDismiss from 'components/uis/KeyboardDismiss';
import { colors } from 'utils/theme';
import { useNavigation } from '@react-navigation/core';
import Button from 'components/uis/Button';
import BackButton from 'components/uis/BackButton';
import { logout } from 'services/redux/auth/actions';
import UpdateProfileForm from './component/UpdateProfileForm';
import { authService } from 'services/auth.service';
import { IUser } from 'interfaces/user';

interface Props {
  current: IUser;
  isLoggedIn: boolean;
  handleLogout: Function;
}
const Profile = ({ current, handleLogout }: Props): React.ReactElement => {
  const navigation = useNavigation() as any;
  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
      headerTitleAlign: 'center',
      title: null,
      headerLeft: () => <BackButton />,
      headerRight: null
    });
  }, [useContext]);

  const defaultValues = {
    email: current?.email,
    username: current?.username,
    password: '',
    conPassword: ''
  };

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({ defaultValues });

  const [submitting, setSubmitting] = useState(false);
  const toast = useToast();

  // todo - handle update profile status from redux
  // useEffect((): any => {
  //   const { success, error } = updateProfile;
  //   if (!success && !error) return;
  //   if (error) {
  //     return Alert.alert(
  //       error?.data?.message || 'An error occurred, please try again!'
  //     );
  //   }

  //   if (success) {
  //     toast.show({
  //       title: 'Success',
  //       status: 'success',
  //       description: 'Update profile successfully!'
  //     });
  //     setSubmitting(false);
  //   }
  // }, [updateProfile.success, updateProfile.error]);

  const onUpdatePassword = async ({
    password,
    prePassword
  }: any): Promise<void> => {
    if (!password) {
      return toast.show({
        title: 'Warning',
        status: 'warning',
        description: 'Please enter new password!',
        placement: 'bottom'
      });
    }

    setSubmitting(true);
    //todo - source: performer for performer update
    await authService
      .updatePassword({ password, prePassword })
      .then(() => {
        toast.show({
          title: 'Success',
          status: 'success',
          description: 'Update password successfully!',
          placement: 'bottom'
        });
        reset(defaultValues);
        setSubmitting(false);
      })
      .catch(async (e) => {
        const error = await Promise.resolve(e);
        toast.show({
          title: 'Error',
          status: 'error',
          description: 'An error occurred, please try again!',
          placement: 'bottom'
        });
        setSubmitting(false);
      });
  };

  return (
    <ScrollView>
      <Box safeAreaX={4} safeAreaY={12} flex={1}>
        <VStack space={1} alignSelf="center" mb={6}>
          <Image
            size={100}
            resizeMode={'contain'}
            borderRadius={100}
            source={current?.avatar ? { uri: current?.avatar } : require('assets/icon.png')}
            alt="My Avatar"
          />
          <Heading
            textAlign="center"
            color={colors.darkText}
            fontSize={24}
            bold
            letterSpacing={-1}>
            {current?.username}
          </Heading>
          <Text
            textAlign="center"
            color={'#C4C4C4'}
            fontSize={15}
            letterSpacing={-0.2}>
            {current.balance && current.balance > 1
              ? `${current.balance} tokens`
              : `${current.balance} token`}
          </Text>
        </VStack>
        <KeyboardDismiss>
          <UpdateProfileForm
            control={control}
            formErrors={errors}
            onSubmit={handleSubmit(onUpdatePassword)}
            submitting={submitting}
          />
        </KeyboardDismiss>
        <Flex alignSelf="center" my={5}>
          <Button
            colorScheme="tertiary"
            onPress={() => {
              handleLogout();
              navigation.navigate('IntroNav', { screen: 'IntroNav/Login' });
            }}
            disabled={false}
            label="Logout"
          />
        </Flex>
      </Box>
    </ScrollView>
  );
};

const mapStateToProp = (state: any): any => ({
  ...state.user,
  isLoggedIn: state.auth.loggedIn
});
const mapDispatch = {
  handleLogout: logout
};
export default connect(mapStateToProp, mapDispatch)(Profile);
