import { v4 as uuidv4 } from "uuid";

/**
 * Generates a unique room ID using UUID v4
 * @returns A UUID v4 string to be used as roomId
 */
export function generateRoomId(): string {
  return uuidv4();
}
