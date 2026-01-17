import type { RoomOptions } from "livekit-client";
import { Room } from "livekit-client";

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
  const room = new Room(options);

  try {
    await room.connect(serverUrl, token, {
      autoSubscribe: true,
    });
    return room;
  } catch (error) {
    room.disconnect();
    throw error;
  }
}

/**
 * Disconnects from a LiveKit room
 * @param room - The room instance to disconnect from
 */
export async function disconnectFromRoom(room: Room | null): Promise<void> {
  if (room) {
    try {
      await room.disconnect();
    } catch (error) {
      console.error("Error disconnecting from room:", error);
    }
  }
}
