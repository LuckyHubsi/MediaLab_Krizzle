import React from "react";
import { TouchableOpacity } from "react-native";
import { StyledChooseCard, Circle, EditButton } from "./ChooseCard.styles";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { ThemedText } from "@/components/ThemedText";
import { useActiveColorScheme } from "@/context/ThemeContext";
import { Colors } from "@/constants/Colors";

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
  const colorScheme = useActiveColorScheme() ?? "light";

  return (
    <TouchableOpacity onPress={onPress}>
      <StyledChooseCard colorScheme={colorScheme}>
        {/* Edit Button (Pencil Icon) */}
        <EditButton>
          <MaterialIcons
            name="edit"
            size={20}
            color={Colors[colorScheme].text}
          />
        </EditButton>

        {/* Center Circle with Color & Icon */}
        <Circle
          style={{ backgroundColor: selectedColor ?? "transparent" }}
          colorScheme={colorScheme}
        >
          {selectedIcon && (
            <MaterialIcons
              name={selectedIcon}
              size={26}
              color={Colors[colorScheme].text}
            />
          )}
        </Circle>

        {/* Label Below */}
        <ThemedText fontSize="s" fontWeight="regular" style={{ marginTop: 5 }}>
          {label}
        </ThemedText>
      </StyledChooseCard>
    </TouchableOpacity>
  );
};
