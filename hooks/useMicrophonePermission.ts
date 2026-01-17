import { useCallback, useEffect, useState } from "react";
import { Platform } from "react-native";

import { Audio } from "expo-av";

export type PermissionStatus = "undetermined" | "granted" | "denied";

export interface UseMicrophonePermissionReturn {
  granted: boolean;
  status: PermissionStatus;
  request: () => Promise<void>;
}

/**
 * Hook to manage microphone permissions
 * Uses expo-av for audio permissions
 */
export function useMicrophonePermission(): UseMicrophonePermissionReturn {
  const [status, setStatus] = useState<PermissionStatus>("undetermined");
  const [granted, setGranted] = useState(false);

  const checkPermission = useCallback(async () => {
    try {
      const { status: audioStatus } = await Audio.getPermissionsAsync();
      if (audioStatus === "granted") {
        setStatus("granted");
        setGranted(true);
      } else if (audioStatus === "denied") {
        setStatus("denied");
        setGranted(false);
      } else {
        setStatus("undetermined");
        setGranted(false);
      }
    } catch (error) {
      console.error("Error checking microphone permission:", error);
      setStatus("denied");
      setGranted(false);
    }
  }, []);

  useEffect(() => {
    checkPermission();
  }, [checkPermission]);

  const request = useCallback(async () => {
    try {
      if (Platform.OS === "web") {
        // Web doesn't need explicit permission request for audio
        setStatus("granted");
        setGranted(true);
        return;
      }

      const { status: audioStatus } = await Audio.requestPermissionsAsync();
      if (audioStatus === "granted") {
        setStatus("granted");
        setGranted(true);
      } else {
        setStatus("denied");
        setGranted(false);
      }
    } catch (error) {
      console.error("Error requesting microphone permission:", error);
      setStatus("denied");
      setGranted(false);
    }
  }, []);

  return {
    granted,
    status,
    request,
  };
}
