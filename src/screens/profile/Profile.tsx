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
import { SafeAreaView, StyleSheet, ImageBackground, Text, TouchableOpacity } from 'react-native';
import { useForm } from 'react-hook-form';
import KeyboardDismiss from 'components/uis/KeyboardDismiss';
import { useNavigation } from '@react-navigation/core';
import Button from 'components/uis/Button';
import BackButton from 'components/uis/BackButton';
import { logout } from 'services/redux/auth/actions';
import UpdateProfileForm from './component/UpdateProfileForm';
import { authService } from 'services/auth.service';
import { IPerformer } from 'interfaces/performer';
import TabView from 'components/uis/TabView';
import { colors, Fonts, Sizes } from 'utils/theme';

import Photo from './component/Photo';
import Video from './component/Video';
import styles from './style'

interface Props {
  current: IPerformer;
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
  console.log('data', current);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>


        <Image source={current?.cover ? { uri: current?.cover } : { uri: '' }} style={styles.converPhoto} />
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
        <Text style={styles.textName}>Modell
        </Text>


        <View style={{ flexDirection: 'row', alignSelf: 'center', marginTop: 5 }}>
          <TouchableOpacity
            activeOpacity={0.9}
            style={styles.editProfileButtonStyle}
          >
            <Text style={styles.subText}>
              Edit Profile
            </Text>
          </TouchableOpacity>
          <Image
            source={require('../../assets/images/insta.png')}
            style={{ marginLeft: Sizes.fixPadding + 5.0, marginTop: 3, width: 33.0, height: 33.0, }}
            resizeMode="contain"
          />
        </View>


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
                key: 'photoList',
                title: '',
                sence: Photo,
                params: { q }
              }
            ]}
          />

        </View>




      </View>
    </SafeAreaView >
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
