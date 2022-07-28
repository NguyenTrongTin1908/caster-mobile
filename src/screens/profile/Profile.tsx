import React, { useEffect, useState, useContext } from 'react';
import { connect } from 'react-redux';
import {
  Box,
  Flex,
  ScrollView,
  Heading,
  VStack,
  useToast,
  Image,
  View,

} from 'native-base';
import { SafeAreaView, StyleSheet, ImageBackground, Text } from 'react-native';
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
import TabView from 'components/uis/TabView';
import Photo from './component/Photo';
import Video from './component/Video';
import styles from './style'

interface Props {
  current: IUser;
  isLoggedIn: boolean;
  handleLogout: Function;
}
const Profile = ({ current, handleLogout }: Props): React.ReactElement => {
  const navigation = useNavigation() as any;
  const [q, setQ] = useState('');

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitleAlign: 'center',
      title: 'Profile',
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
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <Image source={current?.cover ? { uri: current?.cover } : require('assets/icon.png')} style={styles.converPhoto} />
        <View style={styles.avContainer}>


          <View style={styles.avBlueRound}>
            <Image
              source={current?.avatar ? { uri: current?.avatar } : { uri: '' }}
              alt={'avatar'}
              size={100}
              borderRadius={80}
              resizeMode="cover"
            />
            <View style={styles.activeNowTick}></View>

          </View>


        </View>
        <Text style={styles.textName}>Fanso</Text>

        {/* <Text flex={1} color={colors.dark} marginTop={77} fontSize={'3xl'} fontWeight={'bold'} alignSelf="center"  >fAnso</Text> */}
        <View style={styles.listFeeds}>

          {/* <Button
            colorScheme="tertiary"
            onPress={() => {
              handleLogout();
              navigation.navigate('IntroNav', { screen: 'IntroNav/Login' });
            }}
            disabled={false}
            label="Logout"
          /> */}
          <TabView
            scenes={[
              {
                key: 'videoList',
                title: 'Video',
                sence: Video,
                params: { q }
              },
              {
                key: 'photoList',
                title: 'Photo',
                sence: Photo,
                params: { q }
              }
            ]}
          />

        </View>




      </View>
    </SafeAreaView>
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
