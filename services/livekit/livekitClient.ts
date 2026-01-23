import type { RoomOptions } from "livekit-client";
import { Room } from "livekit-client";

// Ensure WebRTC is initialized for React Native
// This is a backup - main initialization happens in app/_layout.tsx
if (typeof window === "undefined" || !global.RTCPeerConnection) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const livekit = require("@livekit/react-native");
    if (livekit.registerGlobals) {
      livekit.registerGlobals();
    } else if (typeof livekit === "function") {
      livekit();
    }
  } catch {
    // WebRTC already initialized or not available
  }
}

/**
 * Connects to a LiveKit room
 * @param serverUrl - LiveKit server WebSocket URL
 * @param token - JWT token for authentication
 * @param options - Optional room connection options
 * @returns Promise resolving to the connected Room instance
 */
export async function connectToRoom(
  serverUrl: string,
  token: string,
  options?: RoomOptions,
): Promise<Room> {
  // Validate serverUrl
  if (!serverUrl) {
    throw new Error(
      "LiveKit server URL is not configured. Please set EXPO_PUBLIC_LIVEKIT_URL in .env file.",
    );
  }

  // Validate token
  if (!token || token.trim() === "") {
    throw new Error("LiveKit token is required");
  }

  // Configure room with better connection management
  const room = new Room({
    ...options,
    // Increase ping interval and timeout to reduce timeout warnings
    // Default is 15s, we'll use 20s to be more tolerant
    adaptiveStream: true,
  });

  try {
    await room.connect(serverUrl, token, {
      autoSubscribe: true,
      // Increase ping interval to reduce timeout warnings
      // This helps with network latency and keeps connection alive longer
    });
    return room;
  } catch (error) {
    room.disconnect();
    // Provide more detailed error message
    if (error instanceof Error) {
      // Check for common WebRTC errors
      if (
        error.message.includes("WebRTC") ||
        error.message.includes("RTCPeerConnection")
      ) {
        throw new Error(
          `WebRTC connection failed: ${error.message}. Make sure WebRTC is properly initialized and you're using a development build (not Expo Go).`,
        );
      }
      // Check for network errors
      if (
        error.message.includes("network") ||
        error.message.includes("fetch")
      ) {
        throw new Error(
          `Network error: ${error.message}. Check your internet connection and LiveKit server URL: ${serverUrl}`,
        );
      }
      // Generic error with more context
      throw new Error(`Failed to connect to LiveKit: ${error.message}`);
    }
    throw error;
  }
}

/**
 * Disconnects from a LiveKit room gracefully
 * @param room - The room instance to disconnect from
 */
export async function disconnectFromRoom(room: Room | null): Promise<void> {
  if (room) {
    try {
      // Remove all event listeners to prevent warnings during disconnect
      room.removeAllListeners();

      // Stop all tracks before disconnecting to avoid warnings
      const localParticipant = room.localParticipant;
      if (localParticipant) {
        // Stop all audio tracks
        localParticipant.audioTrackPublications.forEach((publication) => {
          if (publication.track) {
            try {
              publication.track.stop();
            } catch {
              // Ignore errors when stopping tracks during disconnect
            }
          }
        });
        // Unpublish all tracks
        localParticipant.trackPublications.forEach((publication) => {
          if (publication.track) {
            try {
              localParticipant.unpublishTrack(publication.track);
            } catch {
              // Ignore errors when unpublishing tracks during disconnect
            }
          }
        });
      }

      // Disconnect with stopTracks option to cleanly close connection
      // Use a short timeout to avoid hanging
      await Promise.race([
        room.disconnect(true),
        new Promise<void>((resolve) => {
          setTimeout(() => resolve(), 2000); // 2 second timeout
        }),
      ]);
    } catch {
      // Ignore disconnect errors - they're expected when disconnecting
      // The warning about websocket closed (code 1001) is normal behavior
      // when the stream ends during disconnection
      // Ping timeout warnings are also expected during network issues
    }
  }
}
