import React, { useState } from "react";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors"; // ✅ make sure this is imported
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
  const colorScheme = useColorScheme();

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      onSearch(query);
    }
  };

  return (
    <SearchContainer colorScheme={colorScheme}>
      <SearchIcon colorScheme={colorScheme} />
      <SearchInput
        colorScheme={colorScheme}
        type="text"
        value={query}
        onChange={handleInputChange}
        onKeyPress={handleKeyPress}
        placeholder={placeholder}
        placeholderTextColor={
          Colors[colorScheme ?? "light"].searchBarPlaceholder
        } // ✅ this line!
      />
    </SearchContainer>
  );
};

export default SearchBar;
