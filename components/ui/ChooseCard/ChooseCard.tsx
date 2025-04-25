import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useColorScheme } from "@/hooks/useColorScheme";
import {
  StyledChooseCard,
  Circle,
  EditButton,
  Label,
} from "./ChooseCard.styles";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

interface ChooseCardProps {
  label: string;
  selectedColor?: string;
  selectedIcon?: keyof typeof MaterialIcons.glyphMap;
  onPress: () => void;
}

export const ChooseCard: React.FC<ChooseCardProps> = ({
  label,
  selectedColor,
  selectedIcon,
  onPress,
}) => {
  const colorScheme = useColorScheme() ?? "light";

  return (
    <TouchableOpacity onPress={onPress}>
      <StyledChooseCard colorScheme={colorScheme}>
        {/* Edit Button (Pencil Icon) */}
        <EditButton>
          <MaterialIcons
            name="edit"
            size={20}
            color={colorScheme === "light" ? "black" : "white"}
          />
        </EditButton>

        {/* Center Circle with Color & Icon */}
        <Circle style={{ backgroundColor: selectedColor ?? "transparent" }}>
          {selectedIcon && (
            <MaterialIcons
              name={selectedIcon}
              size={26}
              color={colorScheme === "light" ? "black" : "white"}
            />
          )}
        </Circle>

        {/* Label Below */}
        <Label colorScheme={colorScheme}>{label}</Label>
      </StyledChooseCard>
    </TouchableOpacity>
  );
};
