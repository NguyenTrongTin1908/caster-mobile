export const config = {
  name: "Fanso mobile app",
  slug: "fanso-mobile",
  privacy: "hidden",
  platforms: ["ios", "android", "web"],
  version: "1.0.0",
  orientation: "portrait",
  icon: "./src/assets/icon.png",
  splash: {
    image: "./src/assets/splash.png",
    resizeMode: "cover",
    backgroundColor: "#000000",
  },
  updates: {
    fallbackToCacheTimeout: 0,
  },
  assetBundlePatterns: ["**/*"],
  android: {
    versionCode: 1,
    permissions: [
      "CAMERA",
      "AUDIO_RECORDING",
      "WRITE_EXTERNAL_STORAGE",
      "CAMERA_ROLL",
      "CAPTURE_MEDIA_OUTPUT",
      "READ_EXTERNAL_STORAGE",
    ],
  },
  ios: {
    buildNumber: "1",
    supportsTablet: true,
  },
  description: "Fanso mobile project.",
  extra: {
    apiEndpoint: "https://api.caster.com",
    socketEndpint: "https://api.caster.com",
    googleClientId:
      "402823973725-4to8t06d7eq6g0m9eer57tjettjfrqmg.apps.googleusercontent.com",
  },
  ANT_MEDIA_URL: "https://streaming.afrivega.com/LiveApp",
  ANT_SIGNALING_URL: "wss://streaming.afrivega.com/LiveApp/websocket",
};
