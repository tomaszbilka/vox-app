import { useLocalSearchParams } from "expo-router";

import { GuideScreen } from "@/components/guide-screen";

export default function GuidePage() {
  const { roomId } = useLocalSearchParams<{ roomId: string }>();

  if (!roomId || typeof roomId !== "string") {
    return null;
  }

  return <GuideScreen roomId={roomId} />;
}
