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
import {
  BottomSheetModalProvider,
  BottomSheetModal,
} from "@gorhom/bottom-sheet";
import DateTimePicker from "@react-native-community/datetimepicker";

export default function App() {
  const [data, setData] = useState<any>(null);
  const [search, setSearch] = useState("");
  const [onFood, setOnFood] = useState(false);
  const [selectedFood, setSelectedFood] = useState<any>([]);
  const [loading, setLoading] = useState<boolean | undefined>(undefined);
  const [disabled, setDisabled] = useState(true);
  const [date, setDate] = useState(new Date());

  const bottomSheetRef = useRef<BottomSheetModal>(null);

  // variables
  const snapPoints = useMemo(() => ["48%", "75%", "95%"], []);

  const onClickFood = useCallback((item: any) => {
    setOnFood(true);

    setSelectedFood(
      item.foodNutrients.filter(
        (nutrient: any) =>
          nutrient.nutrientName == "Protein" ||
          nutrient.nutrientName == "Energy" ||
          nutrient.nutrientName == "Total lipid (fat)" ||
          nutrient.nutrientName == "Sugars, total including NLEA" ||
          nutrient.nutrientName == "Sodium, Na"
      )
    );

    bottomSheetRef.current?.present();
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
        setLoading(true);
        const response = await client.POST("/v1/foods/search", {
          body: {
            query: term,
          },
        });

        setData(response);
      } catch (error) {
        setData(error);
      } finally {
        setLoading(false);
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
        <BottomSheetModalProvider>
          <View
            style={[styles.container, onFood && { backgroundColor: "#4C4C4C" }]}
          >
            <View className="mt-14 mx-2">
              <SearchBar
                placeholder="Search for foods"
                value={search}
                onChangeText={updateSearch}
                platform="ios"
                returnKeyType="search"
                showCancel={false}
                dimmed={onFood}
                placeholderTextColor={onFood ? "#303031" : undefined}
                disabled={onFood}
              />
            </View>

            {!loading && !onFood && data && (
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
                      onPress={() => onClickFood(item)}
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
          </View>
          <View>
            <BottomSheetModal
              ref={bottomSheetRef}
              index={1}
              snapPoints={snapPoints}
              onDismiss={() => {
                setOnFood(false);
                setDate(new Date());
              }}
            >
              <View className="mt-10 mx-6">
                {selectedFood.map((nutrient: any) => (
                  <Text key={nutrient.nutrientId}>
                    {nutrient.nutrientName}: {nutrient.value}
                    {nutrient.unitName}
                  </Text>
                ))}
                <View className="mt-10 flex flex-row justify-between">
                  <DateTimePicker
                    testID="dateTimePicker"
                    value={date}
                    maximumDate={new Date()}
                    mode="date"
                    is24Hour={true}
                    onChange={(event, selectedTime) => {
                      const currentData = selectedTime;
                      setDate(currentData!);
                    }}
                    style={{ marginLeft: -10 }}
                  />
                  <DateTimePicker
                    testID="dateTimePicker"
                    value={date}
                    maximumDate={new Date()}
                    mode="time"
                    is24Hour={true}
                    onChange={(event, selectedTime) => {
                      const currentData = selectedTime;
                      setDate(currentData!);
                    }}
                    style={{ marginLeft: -10 }}
                  />
                </View>
                <Pressable
                  className="bg-[#7265E3] p-3 rounded mt-4 active:bg-[#554bab] active:scale-[.97] transition"
                  onPress={() => console.log("Clicked!")}
                >
                  <Text className="text-white text-lg text-center font-bold">
                    Add Food
                  </Text>
                </Pressable>
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
    alignItems: "center",
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
