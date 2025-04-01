import React, { useState } from "react";
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

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      onSearch(query);
    }
  };

  return (
    <SearchContainer>
      <SearchIcon name="magnify" size={24} />
      <SearchInput
        type="text"
        value={query}
        onChange={handleInputChange}
        onKeyPress={handleKeyPress}
        placeholder={placeholder}
      />
    </SearchContainer>
  );
};

export default SearchBar;
