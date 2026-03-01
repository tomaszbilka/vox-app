import { useTranslation } from "react-i18next";
import { LogBox, Platform } from "react-native";

import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider as NavigationThemeProvider,
} from "@react-navigation/native";

import { ThemeProvider, useTheme } from "@/contexts/ThemeContext";

import "@/locales/i18n";
import "react-native-get-random-values";
import "react-native-reanimated";

// Ignore known warnings that are not critical
if (__DEV__) {
  LogBox.ignoreLogs([
    // Ignore DevTools warnings (not critical)
    "Ignoring DevTools app debug target",
    // Ignore LiveKit websocket closed warnings (code 1001 is normal on disconnect)
    "websocket closed",
    // Ignore ping timeout warnings (network latency is expected)
    "ping timeout triggered",
  ]);
}

// Register LiveKit globals for React Native (must be before any LiveKit imports)
if (Platform.OS !== "web") {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const livekit = require("@livekit/react-native");
    if (livekit.registerGlobals) {
      livekit.registerGlobals();
    } else if (typeof livekit === "function") {
      livekit();
    }
  } catch {
    // WebRTC initialization failed - will be handled by error messages
  }
}

export const unstable_settings = {
  anchor: "(tabs)",
};

function RootLayoutContent() {
  const { actualTheme } = useTheme();
  const { t } = useTranslation();

  return (
    <NavigationThemeProvider
      value={actualTheme === "dark" ? DarkTheme : DefaultTheme}
    >
      <Stack>
        <Stack.Screen name="(tabs)" options={{ title: t("layout.tabs") }} />
        <Stack.Screen
          name="modal"
          options={{ presentation: "modal", title: "Modal" }}
        />
        <Stack.Screen name="guide" options={{ headerTitle: "" }} />
        <Stack.Screen name="listener" options={{ headerTitle: "" }} />
      </Stack>
      <StatusBar style={actualTheme === "dark" ? "light" : "dark"} />
    </NavigationThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <RootLayoutContent />
    </ThemeProvider>
  );
}
