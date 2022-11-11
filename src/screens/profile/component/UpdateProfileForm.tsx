import React, { useEffect, useRef, useState } from 'react';
import { Box, FormControl, Text, Input, Divider, View, TextArea, Select, HStack, ScrollView } from 'native-base';
import { Controller, useForm } from 'react-hook-form';
import { colors } from 'utils/theme';
import Button from 'components/uis/Button';
import ImagePicker from 'react-native-image-crop-picker';
import { useNavigation } from '@react-navigation/core';
import { Alert } from 'react-native';
import { connect } from 'react-redux';
import { IPerformer, ICountry } from 'src/interfaces';
import { utilsService } from 'services/utils.service';
import { performerService } from 'services/perfomer.service';
import { updatePerformer, updateCurrentUserAvatar, updateCurrentUserCover } from 'services/redux/user/actions';
import styles from './style';
import moment from 'moment';
import ErrorMessage from 'components/uis/ErrorMessage';
import DatePicker from 'react-native-datepicker';
import { mediaService } from 'services/media.service';
import { authService } from 'services/auth.service';

interface IProps {
  current: IPerformer;
  updatePerformer: Function;
  updateCurrentUserAvatar: Function;
  updateCurrentUserCover: Function;
}
const UpdateProfileForm = ({
  current,
  updatePerformer: handleUpdatePerformer,
  updateCurrentUserAvatar: handleUpdateAvt,
  updateCurrentUserCover: handleUpdateCover
}: IProps): React.ReactElement => {
  const [countries, setCountries] = useState([] as Array<ICountry>);
  const [bodyInfo, setBodyInfo] = useState([] as any);
  const [type, setType] = useState('');
  // const [emailSending, setEmailSending] = useState(false);
  const { heights = [], genders = [], ethnicities = [] } = bodyInfo;
  const defaultValues = {
    ...current,
    dateOfBirth: (current.dateOfBirth && moment(current.dateOfBirth)) || ''
  };
  const {
    control,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm({ defaultValues });
  const password = useRef({});
  password.current = watch('password', '');

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
      Alert.alert('Posted successfully!');
      navigation.navigate('Profile');
    } catch {
      Alert.alert('Something went wrong, please try again later');
    }
  };
  // const verifyEmail = async () => {
  //   try {
  //     await setEmailSending(true);
  //     const resp = await authService.verifyEmail({
  //       sourceType: "performer",
  //       source: current,
  //     });
  //     // this.handleCountdown();
  //     resp.data && resp.data.message && Alert.alert(resp.data.message);
  //   } catch (e) {
  //     const error = await e;
  //     Alert.alert("An error occured, please try again");
  //   } finally {
  //     await setEmailSending(false);
  //   }
  // };
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
  useEffect(async () => {
    const [countries, bodyInfo] = await Promise.all([utilsService.countriesList(), utilsService.bodyInfo()]);
    setCountries(countries?.data);
    setBodyInfo(bodyInfo?.data);
  }, []);
  return (
    <View style={styles.container}>
      <ScrollView style={styles.profileScrollView}>
        <FormControl>
          <Controller
            control={control}
            render={({ field: { onChange, value } }) => (
              <Input
                InputLeftElement={
                  <Text color={colors.inpLabelColor} fontSize={17}>
                    UserName
                  </Text>
                }
                mx={4}
                mt={1}
                p={4}
                variant="unstyled"
                borderColor={colors.lightText}
                onChangeText={val => onChange(val)}
                value={value}
                autoCapitalize="none"
                color={colors.lightText}
                fontSize={20}
                letterSpacing={0.2}
                textAlign="left"
              />
            )}
            name="username"
            rules={{
              required: 'Please input your username!',
              minLength: {
                value: 3,
                message: 'Username must containt at least 3 characters'
              }
            }}
          />
          {errors.username && <ErrorMessage message={errors.username?.message || 'Username is required.'} />}
        </FormControl>
        <Divider borderColor={colors.divider} />
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
                mx={4}
                p={4}
                variant="unstyled"
                borderColor={colors.inpBorderColor}
                onChangeText={val => onChange(val)}
                value={value}
                autoCapitalize="none"
                color={colors.lightText}
                fontSize={20}
                letterSpacing={0.2}
                textAlign="left"
              />
            )}
            name="email"
            rules={{
              required: 'Please input your email!',
              minLength: {
                value: 3,
                message: 'Email must containt at least 3 characters'
              }
            }}
          />
          {errors.email && <ErrorMessage message={errors.email?.message || 'Email is required.'} />}
        </FormControl>
        <Divider borderColor={colors.divider} />
        <HStack>
          <View width={'50%'}>
            <FormControl>
              <Controller
                control={control}
                render={({ field: { onChange, value } }) => (
                  <Select
                    fontSize={17}
                    selectedValue={value}
                    color={colors.lightText}
                    accessibilityLabel="Choose Gender"
                    placeholder="Choose Gender"
                    onValueChange={val => onChange(val)}>
                    {genders.map((item, index) => (
                      <Select.Item label={item.value} value={item.value}></Select.Item>
                    ))}
                  </Select>
                )}
                name="gender"
              />
              {errors.gender && <ErrorMessage message={errors.gender?.message || 'Gender is required.'} />}
            </FormControl>
          </View>
          <View width={'50%'}>
            <FormControl>
              <Controller
                control={control}
                render={({ field: { onChange, value } }) => (
                  <DatePicker
                    modal
                    style={styles.editDatePicker}
                    placeholder="Select date"
                    format="DD-MM-YYYY"
                    date={value}
                    customStyles={{
                      dateIcon: {
                        position: 'absolute',
                        left: 0,
                        top: 4,
                        marginLeft: 0
                      },
                      dateInput: {
                        marginLeft: 36
                      },
                      dateText: { fontSize: 17, color: colors.lightText }
                    }}
                    onDateChange={val => onChange(val)}
                  />
                )}
                name="dateOfBirth"
              />
            </FormControl>
          </View>
        </HStack>
        <Divider borderColor={colors.divider} />
        <FormControl>
          <Controller
            control={control}
            render={({ field: { onChange, value } }) => (
              <Select
                fontSize={17}
                selectedValue={value}
                color={colors.lightText}
                accessibilityLabel="Choose Country"
                placeholder="Choose Country"
                onValueChange={val => onChange(val)}>
                {countries.map(country => (
                  <Select.Item label={country.name} value={country.code} />
                ))}
              </Select>
            )}
            name="country"
            rules={{ required: 'Country is required.' }}
          />
          {errors.country && <ErrorMessage message={errors.country?.message || 'Country is required.'} />}
        </FormControl>
        <Divider borderColor={colors.divider} />
        <FormControl>
          <Controller
            control={control}
            render={({ field: { onChange, value } }) => (
              <Input
                InputLeftElement={
                  <Text color={colors.inpLabelColor} fontSize={17}>
                    State
                  </Text>
                }
                mx={4}
                p={4}
                variant="unstyled"
                borderColor={colors.inpBorderColor}
                onChangeText={val => onChange(val)}
                value={value}
                autoCapitalize="none"
                color={colors.lightText}
                fontSize={20}
                letterSpacing={0.2}
                textAlign="left"
              />
            )}
            name="state"
          />
        </FormControl>
        {/* <FormControl>
          <Controller
            control={control}
            render={({ field: { onChange, value } }) => (
              <Select
                fontSize={17}
                accessibilityLabel="Relationship Status"
                placeholder="Relationship Status"
              ></Select>
            )}
            name="relationshipStatus"
          />
        </FormControl> */}
        <HStack>
          <View width={'50%'}>
            <FormControl>
              <Controller
                control={control}
                render={({ field: { onChange, value } }) => (
                  <Select
                    fontSize={17}
                    selectedValue={value}
                    color={colors.lightText}
                    accessibilityLabel="Choose Ethnicity"
                    placeholder="Choose Ethnicity"
                    onValueChange={val => onChange(val)}>
                    {ethnicities.map(item => (
                      <Select.Item label={item.value} value={item.value}></Select.Item>
                    ))}
                  </Select>
                )}
                name="ethnicity"
              />
            </FormControl>
          </View>
          <View width={'50%'}>
            <FormControl>
              <Controller
                control={control}
                render={({ field: { onChange, value } }) => (
                  <Select
                    fontSize={17}
                    selectedValue={value}
                    color={colors.lightText}
                    accessibilityLabel="Height"
                    onValueChange={val => onChange(val)}
                    placeholder="Height">
                    {heights.map(item => (
                      <Select.Item label={item.value} value={item.value}></Select.Item>
                    ))}
                  </Select>
                )}
                name="height"
              />
            </FormControl>
          </View>
        </HStack>
        <Divider borderColor={colors.divider} />
        <FormControl>
          <Controller
            control={control}
            render={({ field: { onChange, value } }) => (
              <TextArea
                InputLeftElement={
                  <Text color={colors.inpLabelColor} fontSize={17}>
                    Bio
                  </Text>
                }
                mx={4}
                p={4}
                variant="unstyled"
                placeholder="Tell people something about you..."
                borderColor={colors.inpBorderColor}
                onChangeText={val => onChange(val)}
                value={value}
                autoCapitalize="none"
                color={colors.lightText}
                fontSize={16}
                letterSpacing={0.2}
                textAlign="left"
              />
            )}
            name="bio"
          />
        </FormControl>
        <Divider borderColor={colors.divider} />
        <FormControl>
          <Controller
            control={control}
            render={({ field: { onChange, value } }) => (
              <Input
                InputLeftElement={
                  <Text color={colors.inpLabelColor} fontSize={17}>
                    New Password
                  </Text>
                }
                mx={4}
                p={4}
                variant="unstyled"
                borderColor={colors.inpBorderColor}
                onChangeText={val => onChange(val)}
                value={value}
                autoCapitalize="none"
                color={colors.lightText}
                fontSize={20}
                letterSpacing={0.2}
                textAlign="left"
                type="password"
              />
            )}
            name="password"
            rules={{
              pattern: new RegExp(/^(?=.{8,})(?=.*[a-z])(?=.*[0-9])(?=.*[A-Z])(?=.*[^\w\d]).*$/g)
            }}
          />
          {errors.password && (
            <ErrorMessage
              message={
                errors.password?.message ||
                'Password must have minimum 8 characters, at least 1 number, 1 uppercase letter, 1 lowercase letter & 1 special character'
              }
            />
          )}
        </FormControl>
        <Divider borderColor={colors.divider} />
        <FormControl>
          <Controller
            dependencies={['password']}
            hasFeedback
            control={control}
            render={({ field: { onChange, value } }) => (
              <Input
                InputLeftElement={
                  <Text color={colors.inpLabelColor} fontSize={17}>
                    Confirm Password
                  </Text>
                }
                mx={4}
                p={4}
                variant="unstyled"
                borderColor={colors.inpBorderColor}
                onChangeText={val => onChange(val)}
                value={value}
                autoCapitalize="none"
                color={colors.lightText}
                fontSize={20}
                letterSpacing={0.2}
                textAlign="left"
                type="password"
              />
            )}
            name="confirm"
            rules={{
              validate: value => value === password.current || 'The passwords do not match'
            }}
          />
          {errors.confirm && <ErrorMessage message={errors.confirm?.message || 'Comfirm is required.'} />}
        </FormControl>
        <Divider borderColor={colors.divider} />
      </ScrollView>
      <Box alignSelf="center" my={5}>
        <Button colorScheme="primary" onPress={handleSubmit(onSubmit)} disabled={submitting} label="Save Changes" />
      </Box>
    </View>
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
export default connect(mapStates, mapDispatch)(UpdateProfileForm);
