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
    // <TextInput
    //   placeholder="Search"
    //   className="p-3 rounded-md bg-gray-100"
    //   placeholderTextColor="#4b5563"
    // />
    <View style={styles.searchContainer}>
      <Feather name="search" size={24} color="#4b5563" />
      <TextInput
        placeholder="Search"
        className="flex-1 ml-1 p-0"
        placeholderTextColor="#4b5563"
      />
      <TouchableOpacity>
        <Feather name="x" size={24} color="#4b5563" />
      </TouchableOpacity>
    </View>
    // <NativeSearchBar
    //   placeholder="Search for foods..."
    //   onChangeText={updateSearch}
    //   onCancel={() => (props.onCancel) && props.onCancel()}
    //   value={search}
    //   className="p-3"
    //   platform="ios"
    //   returnKeyType="search"
    //   showCancel={false}
    // />
  );
};

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E5E7EB',
    borderRadius: 999,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  input: {
    flex: 1,
    fontSize: 18,
    marginLeft: 8,
    padding: 0, // Remove any default padding
  },
});

export default SearchBar;
