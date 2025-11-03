import { useTranslation } from "react-i18next";
import { Button, StyleSheet } from "react-native";

import ParallaxScrollView from "@/components/parallax-scroll-view";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage } from "@/locales/useLanguage";

export default function SettingsScreen() {
  const { t } = useTranslation();
  const { toggleLanguage, currentLanguage } = useLanguage();
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
        <ThemedText type="subtitle">{t("settings.title")}</ThemedText>
        <ThemedText>
          {t("settings.theme")}: {actualTheme} ({theme})
        </ThemedText>
        <Button
          title={`🔄 ${t("settings.changeLanguage")} (${currentLanguage === "pl" ? "PL 👉 EN" : "EN 👉 PL"})`}
          onPress={toggleLanguage}
        />
        <Button
          title={
            actualTheme === "light"
              ? `🌙 ${t("settings.dark")}`
              : `☀️ ${t("settings.light")}`
          }
          onPress={() => setTheme(actualTheme === "light" ? "dark" : "light")}
        />
        <Button
          title={`🔄 ${t("settings.system")}`}
          onPress={() => setTheme("system")}
        />
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
    alignItems: "flex-start",
  },
});
