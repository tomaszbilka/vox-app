import Constants from "expo-constants";

/**
 * LiveKit server URL
 * Set via EXPO_PUBLIC_LIVEKIT_URL environment variable or use default
 */
export const LIVEKIT_SERVER_URL =
  Constants.expoConfig?.extra?.livekitUrl ||
  process.env.EXPO_PUBLIC_LIVEKIT_URL ||
  "wss://your-livekit-server.com";

/**
 * Backend URL for token generation
 * Set via EXPO_PUBLIC_BACKEND_URL environment variable or use default
 */
export const BACKEND_URL =
  Constants.expoConfig?.extra?.backendUrl ||
  process.env.EXPO_PUBLIC_BACKEND_URL ||
  "https://your-backend.netlify.app/.netlify/functions";

/**
 * Mobile API Key for backend authentication
 * Set via EXPO_PUBLIC_MOBILE_API_KEY environment variable
 */
export const MOBILE_API_KEY =
  Constants.expoConfig?.extra?.mobileApiKey ||
  process.env.EXPO_PUBLIC_MOBILE_API_KEY ||
  "";
