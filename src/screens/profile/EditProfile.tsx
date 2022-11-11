import React, { useEffect, useState } from 'react';
import { Text, View, Heading, Image, useToast } from 'native-base';
import { useForm } from 'react-hook-form';
import { colors, Sizes } from 'utils/theme';
import ImagePicker from 'react-native-image-crop-picker';
import { useNavigation } from '@react-navigation/core';
import { Alert, ImageBackground, SafeAreaView, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import { IPerformer, ICountry } from 'src/interfaces';
import { utilsService } from 'services/utils.service';
import { performerService } from 'services/perfomer.service';
import TabView from 'components/uis/TabView';

import { updatePerformer, updateCurrentUserAvatar, updateCurrentUserCover } from 'services/redux/user/actions';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import styles from '../model/profile/style';
import moment from 'moment';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { BottomSheet } from 'react-native-elements';
import { mediaService } from 'services/media.service';
import HeaderMenu from 'components/tab/HeaderMenu';
import { authService } from 'services/auth.service';
import VerificationForm from './component/VerificationForm';
import UpdateProfileForm from './component/UpdateProfileForm';
import SettingFeeForm from './component/SettingFeeForm';

interface IProps {
  current: IPerformer;
  updatePerformer: Function;
  updateCurrentUserAvatar: Function;
  updateCurrentUserCover: Function;
}

const EditProfile = ({
  current,
  updatePerformer: handleUpdatePerformer,
  updateCurrentUserAvatar: handleUpdateAvt,
  updateCurrentUserCover: handleUpdateCover
}: IProps): React.ReactElement => {
  const toast = useToast();
  const [countries, setCountries] = useState([] as Array<ICountry>);
  const [bodyInfo, setBodyInfo] = useState([] as any);
  const [showBottomSheet, setShowButtonSheet] = useState(false);
  const [type, setType] = useState('');
  const [emailSending, setEmailSending] = useState(false);
  const { heights = [], genders = [], ethnicities = [] } = bodyInfo;
  const defaultValues = {
    ...current,
    dateOfBirth: (current.dateOfBirth && moment(current.dateOfBirth)) || ''
  };

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({ defaultValues });
  const [submitting, setSubmitting] = useState(false);
  const navigation = useNavigation() as any;
  const onSubmit = async (data: any): Promise<void> => {
    submit(data);
  };
  const submit = async data => {
    if (typeof data.dateOfBirth === 'string') {
      const [day, month, year] = data.dateOfBirth.split('-');
      const datePick = new Date(+year, month - 1, +day);
      data.dateOfBirth = datePick.toISOString();
    }
    try {
      handleUpdatePerformer({
        ...current,
        ...data
      });

      toast.show({
        title: 'Updated successfully!'
      });
      navigation.navigate('Profile');
    } catch {
      Alert.alert('Something went wrong, please try again later');
    }
  };

  const verifyEmail = async () => {
    try {
      await setEmailSending(true);
      const resp = await authService.verifyEmail({
        sourceType: 'performer',
        source: current
      });
      // this.handleCountdown();
      resp.data && resp.data.message && Alert.alert(resp.data.message);
    } catch (e) {
      const error = await e;
      Alert.alert('An error occured, please try again');
    } finally {
      await setEmailSending(false);
    }
  };

  //  const handleCountdown = async () => {
  //     const { countTime } = this.state;
  //     if (countTime === 0) {
  //       clearInterval(this._intervalCountdown);
  //       this.setState({ countTime: 60 });
  //       return;
  //     }
  //     this.setState({ countTime: countTime - 1 });
  //     this._intervalCountdown = setInterval(this.coundown.bind(this), 1000);
  //   }
  const openGallery = async () => {
    ImagePicker.openPicker({
      width: 300,
      height: 300,
      cropping: true
    }).then(async image => {
      if (type === 'avatar') {
        const dataUrl = await performerService.getAvatarUploadUrl();
        const url = `https://api.caster.com${dataUrl}`;
        handleUpdate(url, image.path, 'avatar');
      } else {
        const dataUrl = await performerService.getCoverUploadUrl();
        const url = `https://api.caster.com${dataUrl}`;
        handleUpdate(url, image.path, 'cover');
      }
    });
  };

  const openCamera = async () => {
    ImagePicker.openCamera({
      width: 300,
      height: 300,
      cropping: true
    }).then(async image => {
      if (type === 'avatar') {
        const dataUrl = await performerService.getAvatarUploadUrl();
        const url = `https://api.caster.com${dataUrl}`;
        handleUpdate(url, image.path, 'avatar');
      } else {
        const dataUrl = await performerService.getCoverUploadUrl();
        const url = `https://api.caster.com${dataUrl}`;
        handleUpdate(url, image.path, 'cover');
      }
    });
  };

  const handleUpdate = async (uploadUrl: string, path: string, type: string) => {
    try {
      const resp = (await mediaService.upload(uploadUrl, [
        {
          fieldname: type,
          file: {
            uri: `file://${path}`,
            fieldname: 'file'
          }
        }
      ])) as any;
      resp.data.type === 'avatar' ? handleUpdateAvt(resp.data.url) : handleUpdateCover(resp.data.url);
    } catch (error) {}
  };

  useEffect(() => {
    async function loadData() {
      const [countries, bodyInfo] = await Promise.all([utilsService.countriesList(), utilsService.bodyInfo()]);
      setCountries(countries?.data);
      setBodyInfo(bodyInfo?.data);
    }
    loadData();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <HeaderMenu />
      <View style={styles.container}>
        <Heading mb={4} fontSize={34} textAlign="center" color={colors.lightText} bold>
          Edit Profile
        </Heading>
        <View style={styles.converPhoto}>
          <Image
            source={current?.cover ? { uri: current?.cover } : require('../../assets/bg.jpg')}
            height={'100%'}
            alt="cover"
          />
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => {
              setShowButtonSheet(true), setType('cover');
            }}
            style={styles.userCoverStyle}>
            <MaterialCommunityIcons name="camera-plus" size={27} color={colors.lightText} />
          </TouchableOpacity>
        </View>

        <View style={styles.avEdit}>
          <View style={styles.avBlueRound}>
            <ImageBackground
              source={
                current?.avatar
                  ? {
                      uri: current?.avatar
                    }
                  : require('../../assets/avatar-default.png')
              }
              style={styles.userProfilePhotoStyle}
              borderRadius={50.0}>
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => {
                  setShowButtonSheet(true), setType('avatar');
                }}
                style={styles.userProfilePhotoBlurContentStyle}>
                <MaterialCommunityIcons name="camera-plus" size={27} color={colors.lightText} />
              </TouchableOpacity>
            </ImageBackground>
          </View>
        </View>
        <Text style={styles.textName}>
          {current && current?.name != ' ' ? `${current.name}` : `${current?.username}`}
        </Text>

        <View style={{ flex: 1, marginTop: -15 }}>
          <TabView
            scenes={[
              {
                key: 'basicSettings',
                title: 'Basic Settings',
                sence: UpdateProfileForm
              },
              {
                key: 'idDocuments',
                title: 'ID Documents',
                sence: VerificationForm
              },
              {
                key: 'feeSettings',
                title: 'Fee Settings',
                sence: SettingFeeForm
              }
            ]}
          />
        </View>
        <BottomSheet isVisible={showBottomSheet} containerStyle={{ backgroundColor: 'rgba(0.5, 0.50, 0, 0.50)' }}>
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => setShowButtonSheet(false)}
            style={styles.bottomSheetContentStyle}>
            <Text>Choose Option</Text>
            <View
              style={{
                backgroundColor: '#CFC6C6',
                height: 1.0,
                marginBottom: Sizes.fixPadding + 2.0,
                marginTop: Sizes.fixPadding - 5.0
              }}></View>
            <TouchableOpacity onPress={() => openCamera()}>
              <View
                style={{
                  flexDirection: 'row',
                  marginHorizontal: Sizes.fixPadding * 2.0
                }}>
                <MaterialIcons name="photo-camera" size={24} color={Colors.blackColor} />
                <Text
                  style={{
                    marginLeft: Sizes.fixPadding
                  }}>
                  Camera
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => openGallery()}>
              <View
                style={{
                  flexDirection: 'row',
                  marginTop: Sizes.fixPadding,
                  marginHorizontal: Sizes.fixPadding * 2.0
                }}>
                <MaterialIcons name="photo-album" size={22} color={Colors.blackColor} />
                <Text
                  style={{
                    marginLeft: Sizes.fixPadding
                  }}>
                  Choose from gallery
                </Text>
              </View>
            </TouchableOpacity>
          </TouchableOpacity>
        </BottomSheet>
      </View>
    </SafeAreaView>
  );
};

const mapStates = (state: any) => ({
  ...state.user,
  isLoggedIn: state.auth.loggedIn
});
const mapDispatch = {
  updatePerformer,
  updateCurrentUserAvatar,
  updateCurrentUserCover
};
export default connect(mapStates, mapDispatch)(EditProfile);
