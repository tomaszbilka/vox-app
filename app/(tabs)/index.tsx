import { useTranslation } from "react-i18next";
import { StyleSheet } from "react-native";

import { Image } from "expo-image";
import { useRouter } from "expo-router";

import partialReactLogo from "@/assets/images/partial-react-logo.png";
import ParallaxScrollView from "@/components/parallax-scroll-view";
import { ThemedButton } from "@/components/themed-button";
import { ThemedView } from "@/components/themed-view";

export default function HomeScreen() {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
      headerImage={<Image source={partialReactLogo} style={styles.reactLogo} />}
    >
      <ThemedView style={styles.stepContainer}>
        <ThemedButton
          title={t("home.guide")}
          onPress={() => router.push("/guide")}
        />
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedButton
          title={t("home.listener")}
          onPress={() => router.push("/listener")}
        />
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
});
