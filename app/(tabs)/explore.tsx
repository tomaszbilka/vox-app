import { useTranslation } from "react-i18next";
import { Button, StyleSheet } from "react-native";

import ParallaxScrollView from "@/components/parallax-scroll-view";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage } from "@/locales/useLanguage";

export default function TabTwoScreen() {
  const { t } = useTranslation();
  const { toggleLanguage } = useLanguage();
  const { theme, actualTheme, setTheme } = useTheme();

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#D0D0D0", dark: "#353636" }}
      headerImage={
        <IconSymbol
          size={310}
          color="#808080"
          name="chevron.left.forwardslash.chevron.right"
          style={styles.headerImage}
        />
      }
    >
      <ThemedView style={styles.controlsContainer}>
        <ThemedText type="subtitle">Controls</ThemedText>
        <ThemedText>
          Theme: {actualTheme} ({theme})
        </ThemedText>
        <Button title="Zmień język" onPress={toggleLanguage} />
        <Button
          title={actualTheme === "light" ? "🌙 Dark Mode" : "☀️ Light Mode"}
          onPress={() => setTheme(actualTheme === "light" ? "dark" : "light")}
        />
        <Button title="🔄 System Theme" onPress={() => setTheme("system")} />
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: "#808080",
    bottom: -90,
    left: -35,
    position: "absolute",
  },
  controlsContainer: {
    gap: 8,
    marginBottom: 16,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
  },
});
