import { TextInput, type TextInputProps } from "react-native";

import { useThemeColor } from "@/hooks/use-theme-color";

export type ThemedInputProps = TextInputProps & {
  lightColor?: string;
  darkColor?: string;
  lightPlaceholderColor?: string;
  darkPlaceholderColor?: string;
};

export function ThemedInput({
  style,
  lightColor,
  darkColor,
  lightPlaceholderColor,
  darkPlaceholderColor,
  placeholderTextColor,
  ...rest
}: ThemedInputProps) {
  const textColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    "text",
  );
  const defaultPlaceholderColor = useThemeColor(
    { light: lightPlaceholderColor, dark: darkPlaceholderColor },
    "icon",
  );

  return (
    <TextInput
      style={[{ color: textColor }, style]}
      placeholderTextColor={placeholderTextColor || defaultPlaceholderColor}
      {...rest}
    />
  );
}
