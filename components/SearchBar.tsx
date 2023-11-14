import { useState } from "react";
import { TextInput, View, StyleSheet, TouchableOpacity } from "react-native";
import { SearchBar as NativeSearchBar } from "@rneui/themed";
import { Feather } from "@expo/vector-icons";

interface SearchBarProps {
  onUpdate?(param?: string): void;
  onCancel?(): void;
}

const SearchBar = (props: SearchBarProps) => {
  const [search, setSearch] = useState("");

  const updateSearch = (search: string) => {
    setSearch(search);

    if (props.onUpdate) {
      props.onUpdate(search);
    }
  };

  return (
    <NativeSearchBar
      placeholder="Search for foods..."
      value={search}
      className="p-3"
      platform="ios"
      returnKeyType="search"
      showCancel={false}
    />
  );
};

export default SearchBar;
