import { useTranslation } from "react-i18next";
import { StyleSheet } from "react-native";

import { Image } from "expo-image";
import { useRouter } from "expo-router";

import logoTransparent from "@/assets/images/logo_transparent.png";
import ParallaxScrollView from "@/components/parallax-scroll-view";
import { ThemedButton } from "@/components/themed-button";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Colors } from "@/constants/theme";
import { generateRoomId } from "@/utils/uuid";

export default function HomeScreen() {
  const { t } = useTranslation();
  const router = useRouter();

  const handleGuidePress = () => {
    const roomId = generateRoomId();
    router.push({
      pathname: "/guide",
      params: { roomId },
    });
  };

  const handleListenerPress = () => {
    router.push("/listener");
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{
        light: Colors.light.background,
        dark: Colors.dark.background,
      }}
      headerImage={
        <Image
          source={logoTransparent}
          style={styles.logo}
          contentFit="contain"
        />
      }
    >
      <ThemedView style={styles.container}>
        <ThemedText type="title" style={styles.title}>
          {t("home.title")}
        </ThemedText>
        <ThemedText type="default" style={styles.subtitle}>
          {t("home.subtitle")}
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedButton title={t("home.guide")} onPress={handleGuidePress} />
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedButton
          title={t("home.listener")}
          onPress={handleListenerPress}
        />
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
    alignItems: "center",
  },
  title: {
    marginBottom: 8,
  },
  subtitle: {
    textAlign: "center",
    opacity: 0.7,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  logo: {
    width: "100%",
    height: "100%",
    position: "absolute",
  },
});
