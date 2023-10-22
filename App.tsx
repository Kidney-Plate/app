import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { FlatList, Text, View } from "react-native";
import "expo-dev-client";
import { SafeAreaProvider } from "react-native-safe-area-context";
import SearchBar from "./components/SearchBar";
import client from "./lib";

export default function App() {
  type SearchBarComponentProps = {};
  const [data, setData] = useState<any>();

  const fetchData = async (term: string) => {
    try {
      const response = await client.POST("/v1/foods/search", {
        body: {
          query: term,
        },
      });

      setData(response);
    } catch (error) {
      setData(error);
    }
  };

  return (
    <SafeAreaProvider>
      <View className="bg-white">
        <View className="mt-12">
          <SearchBar onUpdate={fetchData} />
        </View>
        {data && (
          <FlatList
            data={data.data.foods!}
            removeClippedSubviews={false}
            renderItem={({ item }) => (
              <View className={"p-3 border-b"}>
                <Text className={"text-lg font-semibold text-gray-700"}>
                  {item.description}
                </Text>
              </View>
            )}
          />
        )}
        <StatusBar style="auto" />
      </View>
    </SafeAreaProvider>
  );
}
