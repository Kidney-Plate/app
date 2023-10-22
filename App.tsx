import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import { Text, View } from "react-native";
import "expo-dev-client";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { SearchBar } from "@rneui/themed";

export default function App() {
  type SearchBarComponentProps = {};

  const SwitchComponent: React.FunctionComponent<
    SearchBarComponentProps
  > = () => {
    const [search, setSearch] = useState("");

    const updateSearch = (search: string) => {
      setSearch(search);
    };

    return (
      <View className="mt-11">
        <SearchBar
          placeholder="Search for foods..."
          onChangeText={updateSearch}
          value={search}
          className="p-3"
          platform="ios"
          returnKeyType="search"
        />
      </View>
    );
  };

  return (
    <SafeAreaProvider>
      <View className="bg-white">
        <SwitchComponent />
        <Text>Open up App.tsx to start working on your app!</Text>
        <StatusBar style="auto" />
      </View>
    </SafeAreaProvider>
  );
}
