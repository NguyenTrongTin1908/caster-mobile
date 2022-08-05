import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Button, Flex, HStack, Text, TextArea, View, VStack } from 'native-base';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from 'navigations/RootStackNavigator';
import { Image, ImageLoadEventData, NativeSyntheticEvent, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import Video, { LoadError, OnLoadData } from 'react-native-video';
import KeyboardDismiss from 'components/uis/KeyboardDismiss';
const isVideoOnLoadEvent = (event: OnLoadData | NativeSyntheticEvent<ImageLoadEventData>): event is OnLoadData =>
  'duration' in event && 'naturalSize' in event;
type Props = NativeStackScreenProps<RootStackParamList, 'UploadMedia'>;
const Upload = ({ navigation, route }: Props) => {
  const { path, type } = route.params;
  const [hasMediaLoaded, setHasMediaLoaded] = useState(false);
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
  const onMediaLoadError = useCallback((error: LoadError) => {
    console.log(`failed to load media: ${JSON.stringify(error)}`);
  }, []);
  const source = useMemo(() => ({ uri: `file://${path}` }), [path]);
  return (
    <KeyboardDismiss>
      <View style={styles.container}>
        <VStack>
          <Flex justifyContent={'space-between'} alignContent={'flex-start'} w="100%" flexDirection={'row'}>
            <TextArea h={150} placeholder="Add description" w="65%" padding={5} />
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
          <Flex flexDirection={'row'} flexWrap={'wrap'}>
            <Button variant={'outline'} colorScheme={'orange'} width={100} m={1}>
              <Text color={'orange.400'} bold>
                #hashtag1
              </Text>
            </Button>
            <Button variant={'outline'} colorScheme={'orange'} width={100} m={1}>
              <Text color={'orange.400'} bold>
                #hashtag2
              </Text>
            </Button>
            <Button variant={'outline'} colorScheme={'orange'} width={100} m={1}>
              <Text color={'orange.400'} bold>
                #hashtag3
              </Text>
            </Button>
            <Button variant={'outline'} colorScheme={'orange'} width={100} m={1}>
              <Text color={'orange.400'} bold>
                #hashtag4
              </Text>
            </Button>
            <Button variant={'outline'} colorScheme={'orange'} width={100} m={1}>
              <Text color={'orange.400'} bold>
                #hashtag5
              </Text>
            </Button>
          </Flex>
        </VStack>
        <VStack>
          <Button variant={'outline'} colorScheme={'orange'}>
            <Text color={'orange.400'} bold>
              Upload
            </Text>
          </Button>
        </VStack>
      </View>
    </KeyboardDismiss>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  video: {
    // position: 'absolute',
    width: '30%',
    height: 150,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  },
  photo: {
    // position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  }
});

export default Upload;
