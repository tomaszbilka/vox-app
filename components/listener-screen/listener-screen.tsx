import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  TextInput,
} from "react-native";

import { ThemedButton } from "@/components/themed-button";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { LIVEKIT_SERVER_URL } from "@/config/livekit";
import { useRoomToken } from "@/hooks/useRoomToken";
import { useLiveKitRoom } from "@/services/livekit/useLiveKitRoom";

export function ListenerScreen() {
  const { t } = useTranslation();
  const [roomId, setRoomId] = useState("");
  const [shouldConnect, setShouldConnect] = useState(false);

  const {
    token,
    loading: tokenLoading,
    error: tokenError,
    fetchToken,
    reset: resetToken,
  } = useRoomToken();

  const {
    connected,
    error: roomError,
    disconnect,
  } = useLiveKitRoom({
    serverUrl: LIVEKIT_SERVER_URL,
    token,
    role: "listener",
    enabled: !!token && shouldConnect,
  });

  // Reset connection state when roomId changes
  useEffect(() => {
    if (!shouldConnect) {
      resetToken();
      disconnect();
    }
  }, [shouldConnect, resetToken, disconnect]);

  const handleEnter = async () => {
    const trimmedRoomId = roomId.trim().toUpperCase();
    if (!trimmedRoomId) {
      return;
    }

    // Simple room code validation (4-8 characters, alphanumeric)
    if (trimmedRoomId.length < 4 || trimmedRoomId.length > 8) {
      return;
    }

    // Update roomId to uppercase version
    setRoomId(trimmedRoomId);
    setShouldConnect(true);
    await fetchToken("listener", trimmedRoomId);
  };

  const handleDisconnect = () => {
    setShouldConnect(false);
    resetToken();
    disconnect();
    setRoomId("");
  };

  const getStatusMessage = () => {
    if (tokenLoading) {
      return t("listener.status.connecting");
    }
    if (tokenError) {
      return t("listener.status.tokenError", { error: tokenError });
    }
    if (roomError) {
      return t("listener.status.roomError", { error: roomError });
    }
    if (connected) {
      return t("listener.status.connected");
    }
    if (!shouldConnect) {
      return t("listener.status.notConnected");
    }
    return t("listener.status.connecting");
  };

  const isValidRoomId = roomId.trim().length >= 4 && roomId.trim().length <= 8;
  const canEnter = isValidRoomId && !tokenLoading && !connected;

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <ThemedText type="title" style={styles.title}>
          {t("listener.title")}
        </ThemedText>

        {/* Room ID Input */}
        {!connected && (
          <ThemedView style={styles.section}>
            <TextInput
              style={styles.input}
              value={roomId}
              onChangeText={(text) => {
                // Convert to uppercase and filter to alphanumeric only
                const filtered = text.toUpperCase().replace(/[^A-Z0-9]/g, "");
                setRoomId(filtered);
              }}
              placeholder={t("listener.roomIdPlaceholder")}
              placeholderTextColor="#999"
              autoCapitalize="characters"
              autoCorrect={false}
              maxLength={8}
              editable={!tokenLoading && !connected}
            />
            {!isValidRoomId && roomId.length > 0 && (
              <ThemedText style={styles.errorText}>
                {t("listener.error.invalidRoomId")}
              </ThemedText>
            )}
          </ThemedView>
        )}

        {/* Status Section */}
        <ThemedView style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            {t("listener.status.title")}
          </ThemedText>
          <ThemedView style={styles.statusContainer}>
            {(tokenLoading ||
              (shouldConnect && !connected && !tokenError && !roomError)) && (
              <ActivityIndicator size="small" style={styles.loader} />
            )}
            <ThemedText type="default" style={styles.statusText}>
              {getStatusMessage()}
            </ThemedText>
          </ThemedView>
        </ThemedView>

        {/* Error Messages */}
        {tokenError && (
          <ThemedView style={styles.errorContainer}>
            <ThemedText style={styles.errorText}>
              {t("listener.error.token", { error: tokenError })}
            </ThemedText>
            <ThemedButton
              title={t("guide.retry")}
              onPress={() => fetchToken("listener", roomId.trim())}
              style={styles.retryButton}
            />
          </ThemedView>
        )}

        {roomError && (
          <ThemedView style={styles.errorContainer}>
            <ThemedText style={styles.errorText}>
              {t("listener.error.room", { error: roomError })}
            </ThemedText>
          </ThemedView>
        )}

        {/* Enter/Disconnect Button */}
        <ThemedView style={styles.buttonContainer}>
          {connected ? (
            <ThemedButton
              title={t("listener.disconnect")}
              onPress={handleDisconnect}
              style={styles.disconnectButton}
            />
          ) : (
            <ThemedButton
              title={t("listener.enter")}
              onPress={handleEnter}
              disabled={!canEnter}
              style={styles.enterButton}
            />
          )}
        </ThemedView>

        {connected && (
          <ThemedView style={styles.connectedContainer}>
            <ThemedText type="default" style={styles.connectedText}>
              {t("listener.listening")}
            </ThemedText>
          </ThemedView>
        )}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    alignItems: "center",
  },
  title: {
    marginBottom: 32,
    textAlign: "center",
  },
  section: {
    width: "100%",
    marginBottom: 24,
    alignItems: "center",
  },
  sectionTitle: {
    marginBottom: 12,
    textAlign: "center",
  },
  input: {
    width: "100%",
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#0a7ea4",
    fontSize: 16,
    textAlign: "center",
    backgroundColor: "rgba(10, 126, 164, 0.1)",
    color: "#000",
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  loader: {
    marginRight: 8,
  },
  statusText: {
    textAlign: "center",
    opacity: 0.8,
  },
  buttonContainer: {
    width: "100%",
    marginTop: 24,
  },
  enterButton: {
    minWidth: 200,
  },
  disconnectButton: {
    minWidth: 200,
    backgroundColor: "#ff0000",
  },
  errorContainer: {
    width: "100%",
    padding: 16,
    borderRadius: 8,
    backgroundColor: "rgba(255, 0, 0, 0.1)",
    marginBottom: 16,
    alignItems: "center",
  },
  errorText: {
    color: "#ff0000",
    textAlign: "center",
    marginBottom: 12,
  },
  retryButton: {
    minWidth: 150,
  },
  connectedContainer: {
    marginTop: 24,
    padding: 16,
    borderRadius: 8,
    backgroundColor: "rgba(0, 255, 0, 0.1)",
  },
  connectedText: {
    textAlign: "center",
    color: "#00aa00",
    fontWeight: "600",
  },
});
