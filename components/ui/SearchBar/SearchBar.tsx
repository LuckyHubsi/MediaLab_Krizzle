import React, { useState, useEffect, useRef } from "react";
import { Colors } from "@/constants/Colors";
import { SearchContainer, SearchIcon, SearchInput } from "./SearchBar.styles";
import { useActiveColorScheme } from "@/context/ThemeContext";
import { TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

interface SearchBarProps {
  placeholder?: string;
  onSearch: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = "Search...",
  onSearch,
}) => {
  const [query, setQuery] = useState("");
  const colorScheme = useActiveColorScheme() ?? "light";
  const themeColors = Colors[colorScheme];

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
        onChangeText={setQuery}
        returnKeyType="search"
        accessibilityRole="search"
        accessibilityHint="Type to search"
      />
      {query.length > 0 && (
        <TouchableOpacity
          onPress={() => setQuery("")}
          style={{
            width: 48,
            height: 48,
            justifyContent: "center",
            alignItems: "center",
            marginRight: -12,
          }}
          accessibilityRole="button"
          accessibilityLabel="Clear search input"
        >
          <MaterialIcons name="close" size={20} color={themeColors.text} />
        </TouchableOpacity>
      )}
    </SearchContainer>
  );
};

export default SearchBar;
