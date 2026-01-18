import { BACKEND_URL } from "@/config/livekit";

export type Role = "guide" | "listener";

export interface TokenResponse {
  token: string;
}

/**
 * Fetches a LiveKit token from the backend
 * @param role - The role of the user (guide or listener)
 * @param roomCode - The user-friendly room code (e.g., "A3B9K2")
 * @returns Promise resolving to the token response
 * @throws Error if the request fails
 */
export async function fetchRoomToken(
  role: Role,
  roomCode: string,
): Promise<TokenResponse> {
  if (!roomCode || roomCode.trim() === "") {
    throw new Error("Room code is required");
  }

  // Validate backend URL
  if (!BACKEND_URL) {
    throw new Error(
      "Backend URL is not configured. Please set EXPO_PUBLIC_BACKEND_URL in .env file.",
    );
  }

  // Use room code directly (backend accepts any string)
  const normalizedCode = roomCode.trim().toUpperCase();
  const url = `${BACKEND_URL}/token?role=${role}&room=${encodeURIComponent(normalizedCode)}`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      const errorMessage = `Failed to fetch token: ${response.status} ${response.statusText}. ${errorText}`;
      throw new Error(errorMessage);
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
