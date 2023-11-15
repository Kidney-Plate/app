import { StatusBar } from "expo-status-bar";
import React, { useState, useCallback, useMemo, useRef } from "react";
import {
  FlatList,
  Text,
  View,
  StyleSheet,
  Keyboard,
  TextInput,
  Pressable,
} from "react-native";
import "expo-dev-client";
import { SafeAreaProvider } from "react-native-safe-area-context";
import client from "./lib";
import "./global.css";
import { SearchBar } from "./components/SearchBar/SearchBar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import BottomSheet, {
  BottomSheetView,
  BottomSheetModalProvider,
  BottomSheetModal,
} from "@gorhom/bottom-sheet";

export default function App() {
  const [data, setData] = useState<any>(null);
  const [search, setSearch] = useState("");
  const [onFood, setOnFood] = useState(false);

  const bottomSheetRef = useRef<BottomSheetModal>(null);
  bottomSheetRef.current?.present();

  // variables
  const snapPoints = ["25%", "48%", "75%"];

  // callbacks
  const handleSheetChanges = useCallback((index: number) => {
    console.log("handleSheetChanges", index);
  }, []);

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
      <GestureHandlerRootView style={{ flex: 1 }}>
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

        {!onFood && data && (
          <FlatList
            data={data.data.foods}
            onScrollBeginDrag={() => Keyboard.dismiss()}
            removeClippedSubviews={false}
            contentContainerStyle={{ paddingBottom: 130 }}
            renderItem={({ item }) => (
              <>
                <View className="ml-4 border-t-[0.75px] border-t-gray-200"></View>
                <Pressable
                  className="p-4 bg-white active:bg-[#D1D0D4]"
                  onPress={() => setOnFood(true)}
                >
                  <Text style={styles.listItemText}>
                    {capitalizeFirstLetter(item.description)}
                  </Text>
                </Pressable>
                {item == data.data.foods[data.data.foods.length - 1] && (
                  <View className="ml-4 border-b-[0.75px] border-b-gray-200"></View>
                )}
              </>
            )}
          />
        )}
        <StatusBar style="auto" />
        <BottomSheetModalProvider>
          <View style={styles.container}>
            <Text>afks</Text>
            <BottomSheetModal
              ref={bottomSheetRef}
              index={1}
              snapPoints={snapPoints}
              onChange={handleSheetChanges}
            >
              <View style={{ flex: 1, backgroundColor: "gray" }}>
                <Text>Awesome 🎉</Text>
              </View>
            </BottomSheetModal>
          </View>
        </BottomSheetModalProvider>
      </GestureHandlerRootView>
    </SafeAreaProvider>
    // <GestureHandlerRootView style={{ flex: 1 }}>
    // </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white", // Background color of the whole screen
    alignItems: "center",
    justifyContent: "center",
  },
  listContainer: {
    paddingBottom: 120,
  },
  listItem: {
    paddingLeft: 4,
    paddingRight: 4,
  },
  listItemText: {
    fontSize: 18,
    color: "black",
    fontFamily: "System", // iOS system font
  },
});
