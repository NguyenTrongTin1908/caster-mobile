import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  ImageLoadEventData,
  NativeSyntheticEvent,
  PermissionsAndroid,
  Platform,
  StyleSheet,
  View,
  TouchableOpacity,
  TouchableWithoutFeedback
} from 'react-native';
import { Button, Text, Actionsheet, useDisclose, Input, FormControl, Modal } from 'native-base';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from 'navigations/RootStackNavigator';
import Video, { LoadError, OnLoadData } from 'react-native-video';
import { useIsFocused } from '@react-navigation/core';
import { useIsForeground } from '../../hooks/useIsForeground';
import CameraRoll from '@react-native-community/cameraroll';
import { SAFE_AREA_PADDING, SCREEN_HEIGHT } from 'utils/theme';
import IonIcon from 'react-native-vector-icons/Ionicons';

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

const isVideoOnLoadEvent = (event: OnLoadData | NativeSyntheticEvent<ImageLoadEventData>): event is OnLoadData =>
  'duration' in event && 'naturalSize' in event;
type Props = NativeStackScreenProps<RootStackParamList, 'MediaPreview'>;

const MediaPreview = ({ navigation, route }: Props) => {
  const { path, type } = route.params;
  const [hasMediaLoaded, setHasMediaLoaded] = useState(false);
  const isForeground = useIsForeground();
  const isScreenFocused = useIsFocused();
  const isVideoPaused = !isForeground || !isScreenFocused;
  const [paused, setVideoPaused] = useState(isVideoPaused);
  const [savingState, setSavingState] = useState<'none' | 'saving' | 'saved'>('none');
  const videoRef = useRef(null) as any;
  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [useContext]);

  const onMediaLoad = useCallback((event: OnLoadData | NativeSyntheticEvent<ImageLoadEventData>) => {
    if (isVideoOnLoadEvent(event)) {
      console.log(
        `Video loaded. Size: ${event.naturalSize.width}x${event.naturalSize.height} (${event.naturalSize.orientation}, ${event.duration} seconds)`
      );
    } else {
      // console.log(`Image loaded. Size: ${event.nativeEvent.source.width}x${event.nativeEvent.source.height}`);
    }
  }, []);
  const onMediaLoadEnd = useCallback(() => {
    console.log('media has loaded.');
    setHasMediaLoaded(true);
  }, []);
  const onMediaLoadError = useCallback((error: LoadError) => {
    console.log(`failed to load media: ${JSON.stringify(error)}`);
  }, []);

  const onSavePressed = useCallback(async () => {
    try {
      setSavingState('saving');

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
      setSavingState('saved');
    } catch (e) {
      const message = e instanceof Error ? e.message : JSON.stringify(e);
      setSavingState('none');
      Alert.alert('Failed to save!', `An unexpected error occured while trying to save your ${type}. ${message}`);
    }
  }, [path, type]);
  const source = useMemo(() => ({ uri: `file://${path}` }), [path]);
  const screenStyle = useMemo(() => ({ opacity: hasMediaLoaded ? 1 : 0 }), [hasMediaLoaded]);

  const togglePlayVideo = () => {
    if (!paused) {
      setVideoPaused(true);
    } else {
      setVideoPaused(false);
    }
  };

  return (
    <View style={[styles.container, screenStyle]}>
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
        <TouchableWithoutFeedback onPress={togglePlayVideo}>
          <Video
            ref={videoRef}
            source={source}
            style={styles.video}
            paused={paused}
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

      <TouchableOpacity style={styles.closeButton} onPress={navigation.goBack}>
        <IonIcon name="close" size={35} color="white" style={styles.icon} />
      </TouchableOpacity>

      {/* <TouchableOpacity style={styles.saveButton} onPress={onSavePressed} disabled={savingState !== 'none'}>
        {savingState === 'none' && <IonIcon name="download" size={35} color="white" style={styles.icon} />}
        {savingState === 'saved' && <IonIcon name="checkmark" size={35} color="white" style={styles.icon} />}
        {savingState === 'saving' && <ActivityIndicator color="white" />}
      </TouchableOpacity> */}

      <Button
        variant={'outline'}
        style={styles.nextButton}
        colorScheme={'orange'}
        onPress={() =>
          navigation.navigate('Upload', {
            path: path,
            type: type
          })
        }>
        <Text color={'orange.400'} bold>
          Next
        </Text>
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white'
  },
  closeButton: {
    position: 'absolute',
    top: SAFE_AREA_PADDING.paddingTop,
    left: SAFE_AREA_PADDING.paddingLeft,
    width: 40,
    height: 40
  },
  saveButton: {
    position: 'absolute',
    bottom: SAFE_AREA_PADDING.paddingBottom,
    left: SAFE_AREA_PADDING.paddingLeft,
    width: 40,
    height: 40
  },
  nextButton: {
    position: 'absolute',
    bottom: SAFE_AREA_PADDING.paddingBottom,
    right: SAFE_AREA_PADDING.paddingLeft,
    height: 40,
    width: 80
  },
  icon: {
    textShadowColor: 'black',
    textShadowOffset: {
      height: 0,
      width: 0
    },
    textShadowRadius: 1
  },
  video: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  },
  photo: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  }
});

export default MediaPreview;
