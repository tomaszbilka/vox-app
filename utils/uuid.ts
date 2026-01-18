/**
 * Generates a user-friendly room code (6 characters: uppercase letters and numbers)
 * Example: "A3B9K2", "M7N4P1"
 * @returns A 6-character alphanumeric code
 */
export function generateRoomId(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // Removed confusing chars: 0, O, I, 1
  let result = "";
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}
