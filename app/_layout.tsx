import "../global.css";
import { SafeAreaProvider } from "react-native-safe-area-context";
import "expo-dev-client";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { Slot } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { View } from "react-native";

export default function Layout() {
  return (
    <SafeAreaProvider>
      <GestureHandlerRootView className="mt-12 mx-2" style={{ flex: 1 }}>
        <BottomSheetModalProvider>
          <Slot />
          <StatusBar style="auto" />
        </BottomSheetModalProvider>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}
