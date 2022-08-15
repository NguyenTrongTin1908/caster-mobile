import React, { useCallback, useContext, useEffect, useMemo, useState, useLayoutEffect } from 'react';
import {
  Flex, Text, View, VStack, Box, FormControl,
} from 'native-base';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Controller, useForm } from 'react-hook-form';
import ErrorMessage from 'components/uis/ErrorMessage';
import { RootStackParamList } from 'navigations/RootStackNavigator';
import {
  Image,
  ImageLoadEventData,
  NativeSyntheticEvent,
  TouchableWithoutFeedback,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import Video, { LoadError, OnLoadData } from 'react-native-video';
import KeyboardDismiss from 'components/uis/KeyboardDismiss';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { colors } from 'utils/theme';
import { Switch } from 'react-native-switch';
import { connect } from 'react-redux';
import CameraRoll from '@react-native-community/cameraroll';
import { feedService } from 'services/feed.service';
import { mediaService } from 'services/media.service';
import { IPerformer } from 'interfaces/performer';
import { IFeed } from 'interfaces/feed';
import styles from './styles';
const isVideoOnLoadEvent = (event: OnLoadData | NativeSyntheticEvent<ImageLoadEventData>): event is OnLoadData =>
  'duration' in event && 'naturalSize' in event;
type Props = NativeStackScreenProps<RootStackParamList, 'Upload'>;
interface IProps {
  current: IPerformer;
  feed?: IFeed;
}
const Upload = ({ navigation, route }: Props, { current, feed }: IProps): React.ReactElement => {
  const { path, type } = route.params;
  const [saveToGallery, setsaveToGallery] = useState(false);
  const [fileIds, setFileids] = useState(feed?.fileIds ? feed.fileIds : []);
  const [fileList, setFileList] = useState(feed?.files ? feed.files : []) as any;
  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm();
  useLayoutEffect(() => {
    uploadVideo()
  }, [])
  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [useContext]);
  const onSubmit = async ({
    text, isSale, active
  }: any): Promise<void> => {
    submit(
      text,
      isSale,
      active
    );
  };
  const submit = async (
    text,
    isSale,
    active
  ) => {
    const formValues = {
      text,
      isSale,
      active,
      type,
      fileIds
    };
    try {
      saveToGallery && onSavePressed()
      !feed ? await feedService.create({ ...formValues, type }) : await feedService.update(feed._id, { ...formValues, type: feed?.type });
      Alert.alert('Posted successfully!');
    } catch {
      Alert.alert('Something went wrong, please try again later');
    }
  };

  const onMediaLoad = useCallback((event: OnLoadData | NativeSyntheticEvent<ImageLoadEventData>) => {
    if (isVideoOnLoadEvent(event)) {
      console.log(
        `Video loaded. Size: ${event.naturalSize.width}x${event.naturalSize.height} (${event.naturalSize.orientation}, ${event.duration} seconds)`
      );
    }
  }, []);
  const onMediaLoadEnd = useCallback(() => {
    console.log('media has loaded.');
  }, []);
  const requestSavePermission = async (): Promise<boolean> => {
    if (Platform.OS !== 'android') return true;
    const permission = PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE;
    if (permission == null) return false;
    let hasPermission = await PermissionsAndroid.check(permission);
    if (!hasPermission) {
      const permissionRequestResult = await PermissionsAndroid.request(permission);
      hasPermission = permissionRequestResult === 'granted';
    }
    return hasPermission;
  };

  const onSavePressed = useCallback(async () => {
    try {
      const hasPermission = await requestSavePermission();
      if (!hasPermission) {
        Alert.alert(
          'Permission denied!',
          'Vision Camera does not have permission to save the media to your camera roll.'
        );
        return;
      }
      const resp = await CameraRoll.save(`file://${path}`, {
        type: type
      });


    } catch (e) {
      const message = e instanceof Error ? e.message : JSON.stringify(e);
      setsaveToGallery(false);
      Alert.alert('Failed to save!', `An unexpected error occured while trying to save your ${type}. ${message}`);
    }
  }, [path, type]);
  const onMediaLoadError = useCallback((error: LoadError) => {
    console.log(`failed to load media: ${JSON.stringify(error)}`);
  }, []);
  const source = useMemo(() => ({ uri: type === 'video' ? `file://${path}` : `file://file://${path}` }), [path]);
  const uploadVideo = async () => {
    try {
      const url = type === 'video' ? `https://api.caster.com/feeds/performers/video/upload` : `https://api.caster.com/feeds/performers/photo/upload`
      const resp = await mediaService
        .upload(
          url,
          [
            {
              fieldname: 'file',
              file: {
                uri: type === 'video' ? path : `file://${path}`,
                fieldname: 'file'
              }
            }
          ],
          {
            onProgress: percentage => console.log(percentage)
          },
        ) as any
      setFileids(resp.data._id)
    } catch (e) {
      throw e;
    }
  };

  return (
    <KeyboardDismiss>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.container}>
          <View style={styles.headerWrapStyle}>
            <Text color={colors.lightText} fontSize={20}>
              Post
            </Text>
            <MaterialIcons
              name="arrow-back"
              color={colors.lightText}
              size={24}
              style={{
                position: 'absolute',
                left: 10.0
              }}
              onPress={() => navigation.pop()}
            />
          </View>
          <View style={styles.postInfoWrapStyle}>
            <Image
              source={current?.avatar ? { uri: current?.avatar } : require('../../assets/dance_1.jpg')}
              style={{ width: 70.0, height: 70.0, borderRadius: 35.0 }}
            />
            <FormControl>
              <Controller
                control={control}
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    selectionColor={colors.lightText}
                    value={value}
                    placeholder="Write about your post here"
                    placeholderTextColor={colors.gray}
                    secureTextEntry={true}
                    multiline
                    numberOfLines={6}
                    onChangeText={val => onChange(val)}
                    style={styles.aboutPostTextFieldStyle}
                  />
                )}
                name="text"
                rules={{ required: 'Description is required' }}
                defaultValue=""
              />
              {errors.text && (
                <ErrorMessage message={'Please add a description'} />
              )}
            </FormControl>
            <TouchableWithoutFeedback >
              <Box
                bgColor={colors.primary}
                mr={3}
                h={34}
                w={34}
                borderRadius={17}
                alignItems="center"
                justifyContent="center"
              >
                <MaterialIcons
                  name="insert-emoticon"
                  size={25}
                  color={colors.lightText}
                />
              </Box>
            </TouchableWithoutFeedback>
          </View>
          <VStack>
            <Flex justifyContent={'space-between'} alignContent={'flex-start'} w="100%" flexDirection={'row'}>
              {type === 'photo' && (
                <TouchableWithoutFeedback
                  onPress={() =>
                    navigation.navigate('MediaPreview', {
                      path: path,
                      type: type
                    })
                  }>
                  <Image
                    source={source}
                    style={styles.photo}
                    resizeMode="cover"
                    onLoadEnd={onMediaLoadEnd}
                    onLoad={onMediaLoad}
                  />
                </TouchableWithoutFeedback>
              )}
              {type === 'video' && (
                <TouchableWithoutFeedback
                  onPress={() =>
                    navigation.navigate('MediaPreview', {
                      path: path,
                      type: type
                    })
                  }>
                  <Video
                    source={source}
                    style={styles.video}
                    paused={true}
                    resizeMode="cover"
                    posterResizeMode="cover"
                    allowsExternalPlayback={false}
                    automaticallyWaitsToMinimizeStalling={false}
                    disableFocus={true}
                    repeat={true}
                    useTextureView={false}
                    controls={false}
                    playWhenInactive={true}
                    ignoreSilentSwitch="ignore"
                    onReadyForDisplay={onMediaLoadEnd}
                    onLoad={onMediaLoad}
                    onError={onMediaLoadError}
                  />
                </TouchableWithoutFeedback>
              )}
            </Flex>
          </VStack>
          <VStack marginTop={5}>
            <View style={styles.saveToGalleryInfoWrapStyle}>
              <Text color={colors.lightText} style={styles.textSwitch}>
                Save to Gallery
              </Text>
              <Switch
                value={saveToGallery}
                onValueChange={val => setsaveToGallery(val)}
                disabled={false}
                activeText={'On'}
                inActiveText={'Off'}
                circleSize={27}
                barHeight={37}
                circleBorderWidth={0}
                backgroundActive={colors.secondary}
                backgroundInactive={'#9E9E9E'}
                circleActiveColor={colors.lightText}
                circleInActiveColor={colors.lightText}
                switchLeftPx={5}
                switchRightPx={5}
                switchWidthMultiplier={2.8}
              />
            </View>
            <View style={styles.saveToGalleryInfoWrapStyle}>
              <Text color={colors.lightText} style={styles.textSwitch}>
                Subscribe to view
              </Text>
              <View>
                <FormControl>
                  <Controller
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <Switch
                        value={value}
                        onValueChange={val => onChange(val)}
                        disabled={false}
                        activeText={'On'}
                        inActiveText={'Off'}
                        circleSize={27}
                        barHeight={37}
                        circleBorderWidth={0}
                        backgroundActive={colors.secondary}
                        backgroundInactive={'#9E9E9E'}
                        circleActiveColor={colors.lightText}
                        circleInActiveColor={colors.lightText}
                        switchLeftPx={5}
                        switchRightPx={5}
                        switchWidthMultiplier={2.8}
                      />)}
                    name="isSale"
                    defaultValue={false}
                  />
                </FormControl>
              </View>
            </View>
            <View style={styles.saveToGalleryInfoWrapStyle}>
              <Text color={colors.lightText} style={styles.textSwitch}>
                Active
              </Text>
              <View>
                <FormControl>
                  <Controller
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <Switch
                        value={value}
                        onValueChange={val => onChange(val)}
                        disabled={false}
                        activeText={'On'}
                        inActiveText={'Off'}
                        circleSize={27}
                        barHeight={37}
                        circleBorderWidth={0}
                        backgroundActive={colors.secondary}
                        backgroundInactive={'#9E9E9E'}
                        circleActiveColor={colors.lightText}
                        circleInActiveColor={colors.lightText}
                        switchLeftPx={5}
                        switchRightPx={5}
                        switchWidthMultiplier={2.8}
                      />)}
                    name="active"
                    defaultValue={false}
                  />
                </FormControl>
              </View>
            </View>
          </VStack>
          <TouchableOpacity activeOpacity={0.9} style={styles.postVideoButtonStyle} onPress={handleSubmit(onSubmit)}>
            <Text color={colors.lightText}>Post Video</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </KeyboardDismiss>
  );
};
const mapStateToProp = (state: any): any => ({
  ...state.user
});
export default connect(mapStateToProp)(Upload);
