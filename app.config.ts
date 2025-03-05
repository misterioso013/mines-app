import { ExpoConfig, ConfigContext } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  name: "Mines",
  slug: "mines",
  version: "0.0.1",
  orientation: "portrait",
  icon: "./assets/images/icon.png",
  scheme: "mines",
  userInterfaceStyle: "automatic",
  splash: {
    image: "./assets/images/icon.png",
    resizeMode: "contain",
    backgroundColor: "#ffffff"
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/images/icon.png",
      backgroundColor: "#ffffff"
    },
    package: "com.alldevs.mines",
    versionCode: 1,
    config: {
      googleMobileAdsAppId: process.env.EXPO_PUBLIC_ADMOB_ANDROID_APP_ID
    }
  },
  plugins: [
    "expo-router",
    "react-native-google-mobile-ads"
  ],
  experiments: {
    typedRoutes: true
  }
});