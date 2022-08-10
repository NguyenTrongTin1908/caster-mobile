import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Flex, Text, View, VStack } from 'native-base';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from 'navigations/RootStackNavigator';
import { Image, ImageLoadEventData, NativeSyntheticEvent, TouchableWithoutFeedback, TextInput, TouchableOpacity, SafeAreaView, Alert, PermissionsAndroid, Platform, } from 'react-native';
import Video, { LoadError, OnLoadData } from 'react-native-video';
import KeyboardDismiss from 'components/uis/KeyboardDismiss';
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { colors } from 'utils/theme';
import { Switch } from 'react-native-switch';
import { connect } from 'react-redux';
import CameraRoll from '@react-native-community/cameraroll';
import { feedService } from 'services/feed.service';
import { mediaService } from 'services/media.service';
import { IPerformer } from 'interfaces/performer';
import styles from './styles'
const isVideoOnLoadEvent = (event: OnLoadData | NativeSyntheticEvent<ImageLoadEventData>): event is OnLoadData =>
  'duration' in event && 'naturalSize' in event;
type Props = NativeStackScreenProps<RootStackParamList, 'Upload'>;
interface IProps {
  current: IPerformer;
}
const Upload = ({ navigation, route }: Props, { current }: IProps): React.ReactElement => {
  const { path, type } = route.params;
  const [hasMediaLoaded, setHasMediaLoaded] = useState(false);
  const [saveToGallery, setsaveToGallery] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [text, setText] = useState('') as any;
  const [isSale, setisSale] = useState(false);
  const [active, setActive] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [useContext]);
  const onMediaLoad = useCallback((event: OnLoadData | NativeSyntheticEvent<ImageLoadEventData>) => {
    if (isVideoOnLoadEvent(event)) {
      console.log(
        `Video loaded. Size: ${event.naturalSize.width}x${event.naturalSize.height} (${event.naturalSize.orientation}, ${event.duration} seconds)`
      );
    }
  }, []);
  const onMediaLoadEnd = useCallback(() => {
    console.log('media has loaded.');
    setHasMediaLoaded(true);
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
      await CameraRoll.save(`file://${path}`, {
        type: type
      });
      setsaveToGallery(true);
    } catch (e) {
      const message = e instanceof Error ? e.message : JSON.stringify(e);
      setsaveToGallery(false);
      Alert.alert('Failed to save!', `An unexpected error occured while trying to save your ${type}. ${message}`);
    }
  }, [path, type]);
  const onMediaLoadError = useCallback((error: LoadError) => {
    console.log(`failed to load media: ${JSON.stringify(error)}`);
  }, []);
  const source = useMemo(() => ({ uri: `file://${path}` }), [path]);
  const uploadVideo = async () => {
    try {
      const result = await mediaService
        .axiosUpload({
          url: `https://api.caster.com/feeds/performers/video/upload`,
          file: source,
          onUploadProgress: (progressEvent: any) => {
            setProgress(
              progressEvent.loaded / progressEvent.total
            );
          }
        })
        .catch((e) => {
          throw e;
        });
      return result;
    } catch (e) {
      throw e;
    }
  }
  const submit = async () => {
    const formValues = {
      isSale,
      text,
      type
    }
    try {
      await setUploading(true)
      await feedService.create({ ...formValues, type })
      Alert.alert('Posted successfully!');
    } catch {
      Alert.alert('Something went wrong, please try again later');
      setUploading(false);
    }
  }
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardDismiss>
        <View style={styles.container}>
          <View style={styles.headerWrapStyle}>
            <Text color={colors.lightText} fontSize={20} >
              Post
            </Text>
            <MaterialIcons
              name="arrow-back"
              color={colors.lightText}
              size={24}
              style={{
                position: 'absolute',
                left: 10.0,
              }}
              onPress={() => navigation.pop()}
            />
          </View>
          <View style={styles.postInfoWrapStyle}>
            <Image
              source={current?.avatar ? { uri: current?.avatar } : require('../../assets/dance_1.jpg')}
              style={{ width: 70.0, height: 70.0, borderRadius: 35.0, }}
            />
            <TextInput
              selectionColor={colors.lightText}
              value={text}
              placeholder="Write about your post here"
              placeholderTextColor={colors.gray}
              multiline
              numberOfLines={6}
              onChangeText={(text) => { setText(text) }}
              style={styles.aboutPostTextFieldStyle}
            />
          </View>
          <VStack>
            <Flex justifyContent={'space-between'} alignContent={'flex-start'} w="100%" flexDirection={'row'}>
              {type === 'photo' && (
                <Image
                  source={source}
                  style={styles.photo}
                  resizeMode="cover"
                  onLoadEnd={onMediaLoadEnd}
                  onLoad={onMediaLoad}
                />
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
                onValueChange={(val) => { setsaveToGallery(val) }}
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
              <Switch
                value={isSale}
                onValueChange={(val) => { setisSale(val) }}
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
                Active
              </Text>
              <Switch
                value={active}
                onValueChange={(val) => { setActive(val) }}
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
          </VStack>
        </View>
      </KeyboardDismiss>
      <TouchableOpacity
        activeOpacity={0.9}
        style={styles.postVideoButtonStyle}
      >
        <Text color={colors.lightText}>
          Post Video
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};
const mapStateToProp = (state: any): any => ({
  ...state.user,
});
export default connect(mapStateToProp)(Upload);
