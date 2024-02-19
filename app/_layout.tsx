import "../global.css";
import { SafeAreaProvider } from "react-native-safe-area-context";
import "expo-dev-client";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { Slot } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { AppState, View } from "react-native";
import { supabase } from "../lib/supabase";

// Tells Supabase Auth to continuously refresh the session automatically if
// the app is in the foreground. When this is added, you will continue to receive
// `onAuthStateChange` events with the `TOKEN_REFRESHED` or `SIGNED_OUT` event
// if the user's session is terminated. This should only be registered once.
AppState.addEventListener('change', (state) => {
    if (state === 'active') {
      supabase.auth.startAutoRefresh()
    } else {
      supabase.auth.stopAutoRefresh()
    }
  })
  
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
