import type { PressableProps, TextStyle, ViewStyle } from "react-native";
import { Pressable, StyleSheet } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

import { ThemedText } from "@/components/themed-text";
import { useThemeColor } from "@/hooks/use-theme-color";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export type ThemedButtonProps = Omit<PressableProps, "style"> & {
  title: string;
  lightBackgroundColor?: string;
  darkBackgroundColor?: string;
  lightTextColor?: string;
  darkTextColor?: string;
  style?: ViewStyle | ViewStyle[];
  textStyle?: TextStyle | TextStyle[];
};

export function ThemedButton({
  title,
  onPress,
  lightBackgroundColor,
  darkBackgroundColor,
  lightTextColor,
  darkTextColor,
  disabled,
  style,
  textStyle,
  ...rest
}: ThemedButtonProps) {
  const backgroundColor = useThemeColor(
    { light: lightBackgroundColor, dark: darkBackgroundColor },
    "buttonBackground",
  );
  const textColor = useThemeColor(
    { light: lightTextColor, dark: darkTextColor },
    "buttonText",
  );

  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const handlePressIn = () => {
    scale.value = withSpring(0.95, {
      damping: 15,
      stiffness: 300,
    });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, {
      damping: 15,
      stiffness: 300,
    });
  };

  return (
    <AnimatedPressable
      {...rest}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
      style={[
        styles.button,
        {
          backgroundColor: disabled ? `${backgroundColor}80` : backgroundColor,
        },
        animatedStyle,
        style,
      ]}
    >
      <ThemedText
        style={[
          styles.buttonText,
          {
            color: textColor,
            opacity: disabled ? 0.6 : 1,
          },
          textStyle,
        ]}
      >
        {title}
      </ThemedText>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 0,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
  },
});
