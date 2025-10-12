/**
 * Learn more about light and dark modes:
 * https://docs.expo.dev/guides/color-schemes/
 */

import { Colors } from "@/constants/theme";
import { useTheme } from "@/contexts/ThemeContext";

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof Colors.light & keyof typeof Colors.dark,
) {
  const { actualTheme } = useTheme();
  const colorFromProps = props[actualTheme];

  if (colorFromProps) {
    return colorFromProps;
  } else {
    return Colors[actualTheme][colorName];
  }
}
