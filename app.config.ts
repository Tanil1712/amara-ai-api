import { ExpoConfig } from "expo/config";
const config: ExpoConfig = {
  name: "EduBox",
  slug: "edubox",
  owner: "tannymaina",
  version: "1.1.0",
  orientation: "portrait",
  icon: "./assets/icon.png",
  userInterfaceStyle: "light",
  splash: {
    image: "./assets/splash.png",
    resizeMode: "contain",
    backgroundColor: "#ffffff",
  },
  assetBundlePatterns: ["**/*"],
  ios: {
    supportsTablet: true,
  },
  android: {
    package: "com.maina1233.edubox",
    permissions: ["INTERNET"],
    adaptiveIcon: {
      foregroundImage: "./assets/adaptive-icon.png",
      backgroundColor: "#ffffff",
    },
  },
  web: {
    favicon: "./assets/favicon.png",
  },
  // 👇 ADD THIS BLOCK
  extra: {
    eas: {
      projectId: "7af2fbbb-8d64-47ed-8ef2-e8b17beec56f",
    },
  },
};
export default config;