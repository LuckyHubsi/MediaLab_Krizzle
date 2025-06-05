import React, { useState, useEffect } from "react";
import { Colors } from "@/constants/Colors";
import { SearchContainer, SearchIcon, SearchInput } from "./SearchBar.styles";
import { useActiveColorScheme } from "@/context/ThemeContext";
import { TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

/**
 * Component for a search bar that allows users to input a search query.
 *
 * @param placeholder - Optional placeholder text for the search input.
 * @param onSearch (required) - Callback function to handle search queries.
 */

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
  const colors = Colors[colorScheme];

  /**
   * Effect to trigger the search callback whenever the query changes for live search functionality.
   */
  useEffect(() => {
    onSearch(query);
  }, [query]);

  return (
    <SearchContainer style={{ backgroundColor: colors.searchBarBackground }}>
      <SearchIcon name="magnify" size={20} color={colors.text} />
      <SearchInput
        style={{ color: colors.text }}
        placeholder={placeholder}
        placeholderTextColor={colors.searchBarPlaceholder}
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
          <MaterialIcons name="close" size={20} color={colors.text} />
        </TouchableOpacity>
      )}
    </SearchContainer>
  );
};

export default SearchBar;
