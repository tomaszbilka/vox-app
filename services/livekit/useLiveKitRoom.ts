import { useCallback, useEffect, useRef, useState } from "react";

import type { LocalAudioTrack, RemoteParticipant, Room } from "livekit-client";

import type { Role } from "@/services/api/tokenService";

import { connectToRoom, disconnectFromRoom } from "./livekitClient";

export interface UseLiveKitRoomReturn {
  connected: boolean;
  participantsCount: number;
  isPublishing: boolean;
  error: string | null;
  publishAudio: () => Promise<void>;
  stopPublishing: () => Promise<void>;
  disconnect: () => Promise<void>;
}

export interface UseLiveKitRoomParams {
  serverUrl: string;
  token: string | null;
  role: Role;
  enabled?: boolean;
}

/**
 * Hook to manage LiveKit room connection, audio publishing/subscribing, and participant count
 */
export function useLiveKitRoom({
  serverUrl,
  token,
  role,
  enabled = true,
}: UseLiveKitRoomParams): UseLiveKitRoomReturn {
  const [connected, setConnected] = useState(false);
  const [participantsCount, setParticipantsCount] = useState(0);
  const [isPublishing, setIsPublishing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const roomRef = useRef<Room | null>(null);
  const audioTrackRef = useRef<LocalAudioTrack | null>(null);

  // Connect to room when token is available
  // Don't connect if there's already an error - user must manually retry
  useEffect(() => {
    if (!enabled || !token || roomRef.current || error) {
      return;
    }

    let mounted = true;

    const connect = async () => {
      try {
        setError(null);

        // Validate serverUrl
        if (!serverUrl) {
          throw new Error(
            "LiveKit server URL is not configured. Please set EXPO_PUBLIC_LIVEKIT_URL in .env file.",
          );
        }

        const room = await connectToRoom(serverUrl, token, {
          audioCaptureDefaults: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true,
          },
        });

        if (!mounted) {
          await disconnectFromRoom(room);
          return;
        }

        roomRef.current = room;

        // Set up event listeners BEFORE checking connection state
        room.on("connected", () => {
          if (mounted) {
            setConnected(true);
            // Count remote participants (listeners)
            const remoteCount = Array.from(
              room.remoteParticipants.values(),
            ).length;
            setParticipantsCount(remoteCount);
          }
        });

        room.on("disconnected", (reason) => {
          if (mounted) {
            setConnected(false);
            setParticipantsCount(0);
            setIsPublishing(false);
            // Ignore warnings for normal disconnects (code 1001 is "going away")
            // This is expected behavior when disconnecting gracefully
            // The reason is a DisconnectReason enum, we check the string representation
            if (reason) {
              const reasonStr = String(reason);
              if (reasonStr.includes("1001")) {
                // Normal disconnect, no need to log
                return;
              }
            }
          }
        });

        room.on("participantConnected", (_participant: RemoteParticipant) => {
          if (mounted) {
            setParticipantsCount((prev) => prev + 1);
          }
        });

        room.on("participantDisconnected", () => {
          if (mounted) {
            setParticipantsCount((prev) => Math.max(prev - 1, 0));
          }
        });

        room.on("trackSubscribed", (_track, _participant) => {
          // In React Native, audio tracks are automatically played after subscription
          // No need to call attach() - that's only for web (DOM)
          // The track is already subscribed and will play automatically
        });

        room.on("trackUnsubscribed", (_track) => {
          // In React Native, tracks are automatically cleaned up on unsubscribe
          // No need to call detach() - that's only for web (DOM)
        });

        room.on("localTrackPublished", () => {
          if (mounted) {
            setIsPublishing(true);
          }
        });

        room.on("localTrackUnpublished", () => {
          if (mounted) {
            setIsPublishing(false);
          }
        });

        // Check if already connected, otherwise wait for connection
        if (room.state === "connected") {
          if (mounted) {
            setConnected(true);
            const remoteCount = Array.from(
              room.remoteParticipants.values(),
            ).length;
            setParticipantsCount(remoteCount);
          }
        } else {
          // Wait for connection with timeout
          await new Promise<void>((resolve, reject) => {
            const timeout = setTimeout(() => {
              reject(
                new Error(
                  "Connection timeout: Failed to connect to LiveKit room within 10 seconds",
                ),
              );
            }, 10000);

            if (room.state === "connected") {
              clearTimeout(timeout);
              resolve();
            } else {
              room.once("connected", () => {
                clearTimeout(timeout);
                resolve();
              });
              room.once("disconnected", (reason) => {
                clearTimeout(timeout);
                reject(
                  new Error(`Connection failed: ${reason || "Unknown error"}`),
                );
              });
            }
          });
        }
      } catch (err) {
        if (mounted) {
          let errorMessage = "Failed to connect to room";

          if (err instanceof Error) {
            errorMessage = err.message;

            // Add more context for common errors
            if (errorMessage.includes("WebRTC")) {
              errorMessage +=
                " (WebRTC may not be initialized. Try rebuilding the app.)";
            } else if (errorMessage.includes("timeout")) {
              errorMessage +=
                " (Check your internet connection and LiveKit server URL)";
            } else if (errorMessage.includes("network")) {
              errorMessage += " (Network error - check your connection)";
            }
          }

          setError(errorMessage);
          setConnected(false);
        }
      }
    };

    connect();

    return () => {
      mounted = false;
      if (roomRef.current) {
        disconnectFromRoom(roomRef.current);
        roomRef.current = null;
      }
    };
  }, [serverUrl, token, enabled, role, error]);

  const publishAudio = useCallback(async () => {
    if (!roomRef.current || role !== "guide") {
      return;
    }

    try {
      setError(null);
      const room = roomRef.current;

      // Enable and publish microphone audio track
      await room.localParticipant.setMicrophoneEnabled(true);

      // Get the published track
      const audioTrack = room.localParticipant.audioTrackPublications
        .values()
        .next().value?.track as LocalAudioTrack | undefined;
      if (audioTrack) {
        audioTrackRef.current = audioTrack;
      }

      setIsPublishing(true);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to publish audio track";
      setError(errorMessage);
      setIsPublishing(false);
    }
  }, [role]);

  const stopPublishing = useCallback(async () => {
    if (!roomRef.current) {
      return;
    }

    try {
      const room = roomRef.current;

      // Disable microphone instead of unpublishing track
      // This is cleaner and avoids warnings
      await room.localParticipant.setMicrophoneEnabled(false);

      if (audioTrackRef.current) {
        audioTrackRef.current.stop();
        audioTrackRef.current = null;
      }
      setIsPublishing(false);
    } catch {
      // Error stopping audio publication - silently fail
      setIsPublishing(false);
    }
  }, []);

  const disconnect = useCallback(async () => {
    if (audioTrackRef.current) {
      await stopPublishing();
    }
    if (roomRef.current) {
      await disconnectFromRoom(roomRef.current);
      roomRef.current = null;
    }
    setConnected(false);
    setParticipantsCount(0);
    setIsPublishing(false);
    setError(null);
  }, [stopPublishing]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  return {
    connected,
    participantsCount,
    isPublishing,
    error,
    publishAudio,
    stopPublishing,
    disconnect,
  };
}
