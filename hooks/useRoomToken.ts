import { useCallback, useState } from "react";

import { fetchRoomToken, type Role } from "@/services/api/tokenService";

export interface UseRoomTokenReturn {
  token: string | null;
  loading: boolean;
  error: string | null;
  fetchToken: (role: Role, roomId: string) => Promise<void>;
  reset: () => void;
}

/**
 * Hook to fetch LiveKit room token from backend
 */
export function useRoomToken(): UseRoomTokenReturn {
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchToken = useCallback(async (role: Role, roomId: string) => {
    try {
      setLoading(true);
      setError(null);
      setToken(null);

      const response = await fetchRoomToken(role, roomId);
      setToken(response.token);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch token";
      setError(errorMessage);
      setToken(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setToken(null);
    setError(null);
    setLoading(false);
  }, []);

  return {
    token,
    loading,
    error,
    fetchToken,
    reset,
  };
}
