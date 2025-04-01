import styled from "styled-components/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";

// define prop type for color scheme
type ColorProps = {
  colorScheme?: "light" | "dark";
};

export const SearchContainer = styled.View<ColorProps>`
  flex-direction: row;
  align-items: center;
  background-color: ${({ colorScheme }: { colorScheme?: "light" | "dark" }) =>
    Colors[colorScheme ?? "light"].searchBarBackground};
  border-radius: 33px;
  padding: 8px 20px;
  width: 100%;
  max-width: 400px;
  gap: 6px;
`;

export const SearchIcon = styled(MaterialCommunityIcons).attrs<ColorProps>(
  ({ colorScheme }: ColorProps) => ({
    name: "magnify",
    size: 20,
    color: Colors[colorScheme ?? "light"].icon,
  }),
)<ColorProps>``;

export const SearchInput = styled.TextInput<ColorProps>`
  font-size: 16px;
  font-style: normal;
  font-weight: 300;
  line-height: 24px;
  letter-spacing: -0.4px;
  color: ${({ colorScheme }: { colorScheme?: ColorProps["colorScheme"] }) =>
    Colors[colorScheme ?? "light"].text};
  background-color: transparent;
`;
