import { Stack } from "expo-router";

export default function Layout() {
  return (
    // headerShown: false diyerek uygulamanın kendi çirkin üst menüsünü gizliyoruz
    <Stack screenOptions={{ headerShown: false }} />
  );
}