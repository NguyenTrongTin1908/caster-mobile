
### Installation
- Run `yarn`
- Create `config.ts` file from `config.ts.example` and update configurations accordingly
- Edit `android > local.properties` and add android SDK path if cannot be found eg `sdk.dir = /Users/username/Library/Android/sdk`
- Run `yarn android` or `yarn ios` to run on device

## WebRTC Streams for AntMediaServer
Ant media server webrtc capabilities.

- Webrtc signaling message commands are found [here](https://ant-media-docs.readthedocs.io/en/latest/WebRTC-Developers.html#webrtc-websocket-messaging-details)

#### Stream Checklist
- [x] Publish webrtc streams to ant media server
- [x] Mute audio support
- [x] Mute video support
- [x] Switch Camera Support
- [x] Streams playing (webrtc streams playing)

### Build app
#### Android debug
- Run `yarn bundle-android`
- cd `android`
- Now in this android folder, run this command `./gradlew assembleDebug`

There! you'll find the apk file in the following path: `android/app/build/outputs/apk/debug/app-debug.apk`


#### iOS
- Need to conect real device to test
- Run `react-native run-ios --device`

### Common issues
#### Android

1. Cannot build
```
cd android
./gradlew clean ##mind the slash based on your OS
```

2. Error animated module
https://stackoverflow.com/questions/70335156/how-to-resolve-react-native-navigation-error-while-installing-version-6

Clean XCode Project with

cd ios
xcodebuild clean
And then clean Android Project with

cd android
./gradlew clean
