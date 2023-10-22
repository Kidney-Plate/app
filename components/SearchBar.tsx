import { useState } from "react";
import { View } from "react-native";
import { SearchBar as NativeSearchBar } from "@rneui/themed";

interface SearchBarProps {
  onUpdate?(param?: string): void;
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
      onChangeText={updateSearch}
      value={search}
      className="p-3"
      platform="ios"
      returnKeyType="search"
    />
  );
};

export default SearchBar;
