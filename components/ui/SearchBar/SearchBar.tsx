import React, { useState } from "react";
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

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      onSearch(query);
    }
  };

  const themeColors = Colors[colorScheme];

  return (
    <SearchContainer
      style={{ backgroundColor: themeColors.searchBarBackground }}
    >
      <SearchIcon name="magnify" size={20} color={themeColors.icon} />
      <SearchInput
        style={{ color: themeColors.text }}
        placeholder={placeholder}
        value={query}
        onChange={handleInputChange}
        onKeyPress={handleKeyPress}
        placeholderTextColor={themeColors.searchBarPlaceholder}
      />
    </SearchContainer>
  );
};
export default SearchBar;
