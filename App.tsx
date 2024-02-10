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
  BottomSheetBackdropProps,
  BottomSheetBackdrop,
} from "@gorhom/bottom-sheet";
import DateTimePicker from "@react-native-community/datetimepicker";
import { AntDesign } from "@expo/vector-icons";

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

  const BackdropElement = useCallback(
    (backdropProps: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...backdropProps}
        opacity={0.7}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
      />
    ),
    []
  );

  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <BottomSheetModalProvider>
          <View className="flex-1 items-center">
            <View className="mt-16 mx-2">
              <SearchBar
                placeholder="Search for foods"
                value={search}
                onChangeText={updateSearch}
                platform="ios"
                returnKeyType="search"
                showCancel={false}
                disabled={onFood}
              />

              {!loading && !onFood && data && (
                <FlatList
                  data={data.data.foods}
                  onScrollBeginDrag={() => Keyboard.dismiss()}
                  removeClippedSubviews={false}
                  contentContainerStyle={{ paddingBottom: 130 }}
                  renderItem={({ item }) => (
                    <>
                      <View className="border-b-[0.75px] border-b-black/10"></View>
                      <Pressable
                        className="p-4 bg-transparent active:bg-gray-200" // #00000016, #d1d5db
                        onPress={() => onClickFood(item)}
                      >
                        <Text style={styles.listItemText}>
                          {capitalizeFirstLetter(item.description)}
                        </Text>
                      </Pressable>
                    </>
                  )}
                />
              )}
              <StatusBar style="auto" />
            </View>
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
              backdropComponent={BackdropElement}
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
  searchSection: {
    flex: 1,
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  searchIcon: {
    padding: 10,
  },
  input: {
    flex: 1,
    paddingTop: 10,
    paddingRight: 10,
    paddingBottom: 10,
    paddingLeft: 0,
    backgroundColor: "#818181",
    color: "#424242",
  },
});
