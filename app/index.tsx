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
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
} from "react-native";
import "expo-dev-client";
import { SafeAreaProvider } from "react-native-safe-area-context";
import client from "../lib";
import "../global.css";
import { SearchBar } from "../components/Search/SearchBar/SearchBar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
  BottomSheetModalProvider,
  BottomSheetModal,
  BottomSheetBackdropProps,
  BottomSheetBackdrop,
} from "@gorhom/bottom-sheet";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as Device from "expo-device";
import Button from "../components/Button";
import Illustration from "../assets/LoginIllustration.svg";

export default function Page() {
  const [email, setEmail] = useState("");

  return (
    <View className="mt-20 mx-2">
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View>
          <Illustration width="100%" height={150} className="mb-5" />
          <Text className="text-3xl font-black text-center mb-3">
            Continue with Email
          </Text>
          <Text className="text-center mb-6">Get personalized diet plans, exercise routine, and more.</Text>
          <Text className="block text-sm font-medium text-gray-900">Email</Text>
          <View className="relative mt-2 rounded-md shadow-sm">
            <TextInput
              id="email"
              className="rounded-md border-solid border-[1px] border-slate-200 py-3 pl-2 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
              placeholder="example@example.com"
              onChangeText={(text) => setEmail(text)}
              value={email}
              autoCapitalize="none"
              textContentType="emailAddress"
              autoComplete="email"
            />
          </View>
          <Button text="Log in" link="/home" />
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: "rgb(226 232 240)",
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 8,
    paddingRight: 56,
    borderRadius: 6,
    color: "black",
    fontSize: 16,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    shadowColor: "rgba(0, 0, 0, 0.05)",
  },
});
