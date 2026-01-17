import { BACKEND_URL } from "@/config/livekit";

export type Role = "guide" | "listener";

export interface TokenResponse {
  token: string;
}

/**
 * Fetches a LiveKit token from the backend
 * @param role - The role of the user (guide or listener)
 * @param roomId - The room ID to join
 * @returns Promise resolving to the token response
 * @throws Error if the request fails
 */
export async function fetchRoomToken(
  role: Role,
  roomId: string,
): Promise<TokenResponse> {
  if (!roomId || roomId.trim() === "") {
    throw new Error("Room ID is required");
  }

  const url = `${BACKEND_URL}/token?role=${role}&room=${encodeURIComponent(roomId)}`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Failed to fetch token: ${response.status} ${response.statusText}. ${errorText}`,
      );
    }

    const data: TokenResponse = await response.json();

    if (!data.token) {
      throw new Error("Invalid token response: token is missing");
    }

    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Unknown error occurred while fetching token");
  }
}
