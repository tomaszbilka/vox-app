import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, ScrollView, StyleSheet } from "react-native";

import { ThemedButton } from "@/components/themed-button";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { LIVEKIT_SERVER_URL } from "@/config/livekit";
import { useMicrophonePermission } from "@/hooks/useMicrophonePermission";
import { useRoomToken } from "@/hooks/useRoomToken";
import { useLiveKitRoom } from "@/services/livekit/useLiveKitRoom";

interface GuideScreenProps {
  roomId: string;
}

export function GuideScreen({ roomId }: GuideScreenProps) {
  const { t } = useTranslation();

  const {
    granted: micGranted,
    status: micStatus,
    request: requestMic,
  } = useMicrophonePermission();
  const {
    token,
    loading: tokenLoading,
    error: tokenError,
    fetchToken,
    reset: resetToken,
  } = useRoomToken();

  const {
    connected,
    participantsCount,
    isPublishing,
    error: roomError,
    publishAudio,
    stopPublishing,
    disconnect,
  } = useLiveKitRoom({
    serverUrl: LIVEKIT_SERVER_URL,
    token,
    role: "guide",
    enabled: !!token && micGranted,
  });

  // Request microphone permission on mount
  useEffect(() => {
    if (micStatus === "undetermined") {
      requestMic();
    }
  }, [micStatus, requestMic]);

  // Fetch token when roomId is available and mic is granted
  useEffect(() => {
    if (roomId && micGranted && !token && !tokenLoading) {
      fetchToken("guide", roomId);
    }
  }, [roomId, micGranted, token, tokenLoading, fetchToken]);

  // Reset token if mic permission is revoked
  useEffect(() => {
    if (!micGranted && token) {
      resetToken();
      disconnect();
    }
  }, [micGranted, token, resetToken, disconnect]);

  const handleToggleSpeak = async () => {
    if (isPublishing) {
      await stopPublishing();
    } else {
      await publishAudio();
    }
  };

  const handleDisconnect = async () => {
    await disconnect();
    resetToken();
  };

  const getStatusMessage = () => {
    if (!micGranted) {
      return t("guide.status.micRequired");
    }
    if (tokenLoading) {
      return t("guide.status.connecting");
    }
    if (tokenError) {
      return `${t("guide.status.tokenError", { error: tokenError })}`;
    }
    if (roomError) {
      return `${t("guide.status.roomError", { error: roomError })}`;
    }
    if (!connected && token) {
      return t("guide.status.connecting");
    }
    if (!token && !tokenLoading) {
      return "Waiting for token...";
    }
    if (connected) {
      return t("guide.status.connected");
    }
    return t("guide.status.connecting");
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <ThemedText type="title" style={styles.title}>
          {t("guide.title")}
        </ThemedText>

        {/* Room ID Section */}
        <ThemedView style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            {t("guide.roomCode")}
          </ThemedText>
          <ThemedView style={styles.roomIdContainer}>
            <ThemedText type="defaultSemiBold" style={styles.roomId}>
              {roomId}
            </ThemedText>
            <ThemedText type="default" style={styles.copyText}>
              {t("guide.shareCode")}
            </ThemedText>
          </ThemedView>
        </ThemedView>

        {/* Status Section */}
        <ThemedView style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            {t("guide.status.title")}
          </ThemedText>
          <ThemedView style={styles.statusContainer}>
            {(tokenLoading || (!connected && !tokenError && !roomError)) && (
              <ActivityIndicator size="small" style={styles.loader} />
            )}
            <ThemedText type="default" style={styles.statusText}>
              {getStatusMessage()}
            </ThemedText>
          </ThemedView>
        </ThemedView>

        {/* Listeners Count */}
        {connected && (
          <ThemedView style={styles.section}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>
              {t("guide.listeners")}
            </ThemedText>
            <ThemedView style={styles.listenerCountContainer}>
              <ThemedText style={styles.listenerCount}>
                {participantsCount}
              </ThemedText>
            </ThemedView>
          </ThemedView>
        )}

        {/* Error Messages */}
        {tokenError && (
          <ThemedView style={styles.errorContainer}>
            <ThemedText style={styles.errorText}>
              {t("guide.error.token", { error: tokenError })}
            </ThemedText>
            <ThemedButton
              title={t("guide.retry")}
              onPress={() => fetchToken("guide", roomId)}
              style={styles.retryButton}
            />
          </ThemedView>
        )}

        {roomError && (
          <ThemedView style={styles.errorContainer}>
            <ThemedText style={styles.errorText}>
              {t("guide.error.room", { error: roomError })}
            </ThemedText>
            <ThemedText style={styles.errorDetailText}>
              LiveKit URL: {LIVEKIT_SERVER_URL}
            </ThemedText>
            <ThemedButton
              title={t("guide.retry")}
              onPress={() => {
                resetToken();
                disconnect();
                if (roomId && micGranted) {
                  fetchToken("guide", roomId);
                }
              }}
              style={styles.retryButton}
            />
          </ThemedView>
        )}

        {!micGranted && (
          <ThemedView style={styles.errorContainer}>
            <ThemedText style={styles.errorText}>
              {t("guide.error.micPermission")}
            </ThemedText>
            <ThemedButton
              title={t("guide.requestPermission")}
              onPress={requestMic}
              style={styles.retryButton}
            />
          </ThemedView>
        )}

        {/* Speak/Stop Button */}
        <ThemedView style={styles.buttonContainer}>
          <ThemedButton
            title={isPublishing ? t("guide.stop") : t("guide.speak")}
            onPress={handleToggleSpeak}
            disabled={!connected || !micGranted || tokenLoading}
            style={[
              styles.speakButton,
              ...(isPublishing ? [styles.speakButtonActive] : []),
            ]}
          />
        </ThemedView>

        {/* Disconnect Button */}
        {connected && (
          <ThemedView style={styles.disconnectContainer}>
            <ThemedButton
              title={t("guide.disconnect")}
              onPress={handleDisconnect}
              style={styles.disconnectButton}
              lightBackgroundColor="#dc3545"
              darkBackgroundColor="#dc3545"
              lightTextColor="#ffffff"
              darkTextColor="#ffffff"
            />
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
  roomIdContainer: {
    width: "100%",
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#0a7ea4",
    alignItems: "center",
    backgroundColor: "rgba(10, 126, 164, 0.1)",
  },
  roomId: {
    fontSize: 18,
    marginBottom: 8,
    textAlign: "center",
  },
  copyText: {
    fontSize: 14,
    opacity: 0.7,
    marginTop: 8,
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
  listenerCountContainer: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },
  listenerCount: {
    fontSize: 64,
    fontWeight: "bold",
    textAlign: "center",
    minHeight: 80,
    lineHeight: 80,
  },
  buttonContainer: {
    width: "100%",
    marginTop: 24,
  },
  speakButton: {
    minWidth: 200,
  },
  speakButtonActive: {
    opacity: 0.8,
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
  errorDetailText: {
    color: "#ff0000",
    textAlign: "center",
    fontSize: 12,
    opacity: 0.7,
    marginBottom: 12,
  },
  retryButton: {
    minWidth: 150,
  },
  disconnectContainer: {
    width: "100%",
    marginTop: 16,
    alignItems: "center",
  },
  disconnectButton: {
    minWidth: 120,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
});
