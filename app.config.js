export default {
  expo: {
    name: "vox-app",
    slug: "vox-app",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "voxapp",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    ios: {
      supportsTablet: true,
      infoPlist: {
        NSMicrophoneUsageDescription:
          "This app needs access to your microphone to stream audio as a guide.",
        CFBundleLocalizations: ["en", "pl", "en", "pl"],
      },
      bitcode: false,
      bundleIdentifier: "com.tomaszbilka.voxapp",
    },
    android: {
      adaptiveIcon: {
        backgroundColor: "#E6F4FE",
        foregroundImage: "./assets/images/android-icon-foreground.png",
        backgroundImage: "./assets/images/android-icon-background.png",
        monochromeImage: "./assets/images/android-icon-monochrome.png",
      },
      edgeToEdgeEnabled: true,
      predictiveBackGestureEnabled: false,
      permissions: [
        "android.permission.RECORD_AUDIO",
        "android.permission.MODIFY_AUDIO_SETTINGS",
        "android.permission.ACCESS_NETWORK_STATE",
        "android.permission.CAMERA",
        "android.permission.INTERNET",
        "android.permission.SYSTEM_ALERT_WINDOW",
        "android.permission.WAKE_LOCK",
        "android.permission.BLUETOOTH",
      ],
      package: "com.tomaszbilka.voxapp",
    },
    web: {
      output: "static",
      favicon: "./assets/images/favicon.png",
    },
    plugins: [
      "expo-router",
      [
        "expo-splash-screen",
        {
          image: "./assets/images/splash-icon.png",
          imageWidth: 200,
          resizeMode: "contain",
          backgroundColor: "#ffffff",
          dark: {
            backgroundColor: "#000000",
          },
        },
      ],
      [
        "expo-localization",
        {
          supportedLocales: {
            ios: ["en", "pl"],
            android: ["en", "pl"],
          },
        },
      ],
      "@config-plugins/react-native-webrtc",
    ],
    experiments: {
      typedRoutes: true,
      reactCompiler: true,
    },
    // Add environment variables to extra config
    // These will be available via Constants.expoConfig?.extra
    extra: {
      eas: {
        projectId: "f748cca2-13a5-404f-9a41-4db4b6ff1265",
      },
      livekitUrl: process.env.EXPO_PUBLIC_LIVEKIT_URL || "",
      backendUrl: process.env.EXPO_PUBLIC_BACKEND_URL || "",
      mobileApiKey: process.env.EXPO_PUBLIC_MOBILE_API_KEY || "",
      isDev:
        process.env.EXPO_PUBLIC_ISDEV === "true" ||
        process.env.EXPO_PUBLIC_ISDEV === "1",
    },
  },
};
