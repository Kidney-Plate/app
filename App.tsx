import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
  FlatList,
  Text,
  View,
  StyleSheet,
  Keyboard,
  TextInput,
} from "react-native";
import "expo-dev-client";
import { SafeAreaProvider } from "react-native-safe-area-context";
import client from "./lib";
import "./global.css";
import { SearchBar } from "./components/SearchBar/SearchBar";

export default function App() {
  const [data, setData] = useState<any>(null);
  const [search, setSearch] = useState("");

  function capitalizeFirstLetter(words: string) {
    // Check if the input string is already in all caps
    if (words === words.toUpperCase()) {
      // Convert all letters to lowercase
      let lowercasedWords = words.toLowerCase();

      // Capitalize the first letter of each word
      let capitalizedWords = lowercasedWords.replace(/\b\w/g, function (char) {
        return char.toUpperCase();
      });

      return capitalizedWords;
    } else {
      // Return the original string if it's not in all caps
      return words;
    }
  }

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

  const updateSearch = (search: string) => {
    setSearch(search);
    fetchData(search);
  };

  return (
    <SafeAreaProvider>
      <View>
        <View className="mt-14 mx-2">
          <SearchBar
            placeholder="Search for foods"
            value={search}
            onChangeText={updateSearch}
            platform="ios"
            returnKeyType="search"
            showCancel={false}
          />
        </View>
        {data && (
          <FlatList
            data={data.data.foods}
            onScrollBeginDrag={() => Keyboard.dismiss()}
            removeClippedSubviews={false}
            contentContainerStyle={{ paddingBottom: 130 }}
            renderItem={({ item }) => (
              <View className="p-4 border-b-[1px] border-b-gray-200 bg-white">
                <Text style={styles.listItemText}>
                  {capitalizeFirstLetter(item.description)}
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
