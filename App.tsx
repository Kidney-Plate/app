import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { FlatList, Text, View, StyleSheet, Keyboard, TextInput } from "react-native";
import "expo-dev-client";
import { SafeAreaProvider } from "react-native-safe-area-context";
import SearchBar from "./components/SearchBar";
import client from "./lib";
import "./global.css"

export default function App() {
  const [data, setData] = useState<any>(null);

  const fetchData = async (term: string) => {
    if (term.length > 2) {
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
    } else {
      setData(null);
    }
  };

  return (
    <SafeAreaProvider>
      <View className="bg-red">
        <View className="mt-14 mx-2">
          <SearchBar onUpdate={fetchData} onCancel={() => setData(null)} />
        </View>
        {data && (
          // <FlatList
          //   data={data.data.foods!}
          //   removeClippedSubviews={false}
          //   contentContainerStyle={{ paddingBottom: 120 }}
          //   renderItem={({ item }) => (
          //     <View className="p-3 border-b">
          //       <Text className={"text-lg font-semibold text-gray-700"}>
          //         {item.description}
          //       </Text>
          //     </View>
          //   )}
          // />
          <FlatList
            data={data.data.foods}
            onScrollBeginDrag={() => Keyboard.dismiss()}
            removeClippedSubviews={false}
            contentContainerStyle={{ paddingBottom: 130}}
            renderItem={({ item }) => (
              <View className="p-4 border-b-[1px] border-b-gray-200 bg-white">
                <Text style={styles.listItemText}>{item.description}</Text>
              </View>
            )}
          />
        )}
        <StatusBar style="auto" />
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white", // Background color of the whole screen
  },
  listContainer: {
    paddingBottom: 120,
  },
  listItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#dcdcdc",
    backgroundColor: "white", // Background color of each list item
  },
  listItemText: {
    fontSize: 18,
    color: "black",
    fontFamily: "System", // iOS system font
  },
});
