import React, { useState, useEffect } from "react";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";
import { SearchContainer, SearchIcon, SearchInput } from "./SearchBar.styles";

interface SearchBarProps {
  placeholder?: string;
  onSearch: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = "Search...",
  onSearch,
}) => {
  const [query, setQuery] = useState("");
  const colorScheme = useColorScheme() ?? "light";
  const themeColors = Colors[colorScheme];

  // Call onSearch live as user types
  useEffect(() => {
    onSearch(query);
  }, [query]);

  return (
    <SearchContainer
      style={{ backgroundColor: themeColors.searchBarBackground }}
    >
      <SearchIcon name="magnify" size={20} color={themeColors.text} />
      <SearchInput
        style={{ color: themeColors.text }}
        placeholder={placeholder}
        placeholderTextColor={themeColors.searchBarPlaceholder}
        value={query}
        onChangeText={setQuery} // ✅ for React Native
        returnKeyType="search"
      />
    </SearchContainer>
  );
};

export default SearchBar;
