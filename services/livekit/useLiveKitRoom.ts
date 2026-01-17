import { useCallback, useEffect, useRef, useState } from "react";

import type { LocalAudioTrack, RemoteParticipant, Room } from "livekit-client";
import { Track } from "livekit-client";

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
  useEffect(() => {
    if (!enabled || !token || roomRef.current) {
      return;
    }

    let mounted = true;

    const connect = async () => {
      try {
        setError(null);
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

        // Set up event listeners
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

        room.on("disconnected", () => {
          if (mounted) {
            setConnected(false);
            setParticipantsCount(0);
            setIsPublishing(false);
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

        room.on("trackSubscribed", (track, _participant) => {
          // Automatically subscribe to audio tracks for listeners
          if (track.kind === Track.Kind.Audio && role === "listener") {
            track.attach();
          }
        });

        room.on("trackUnsubscribed", (track) => {
          if (track.kind === Track.Kind.Audio) {
            track.detach();
          }
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

        // Wait for connection
        await new Promise<void>((resolve) => {
          if (room.state === "connected") {
            resolve();
          } else {
            room.once("connected", () => resolve());
          }
        });
      } catch (err) {
        if (mounted) {
          const errorMessage =
            err instanceof Error ? err.message : "Failed to connect to room";
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
  }, [serverUrl, token, enabled, role]);

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
    if (!roomRef.current || !audioTrackRef.current) {
      return;
    }

    try {
      const room = roomRef.current;
      const audioTrack = audioTrackRef.current;

      await room.localParticipant.unpublishTrack(audioTrack);
      audioTrack.stop();
      audioTrackRef.current = null;
      setIsPublishing(false);
    } catch (err) {
      console.error("Error stopping audio publication:", err);
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
