import React, { FC } from "react";
import { Image } from "react-native";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";
import { Button } from "../ui/Button/Button";
import { ThemedText } from "../ThemedText";
import { StyledEmptyHome } from "./emptyHome.styles"; // 👈 import styles

export const EmptyHome: FC = () => {
  const colorScheme = useColorScheme() ?? "light";

  return (
    <StyledEmptyHome colorScheme={colorScheme}>
      <Image
        source={require("@/assets/images/kriz.png")}
        style={{ width: 65, height: 70 }}
      />
      <ThemedText fontSize="regular" fontWeight="regular">
        Add your first note/collection
      </ThemedText>
      <Button
        color={Colors[colorScheme].tint}
        size="medium"
        onPress={() => console.log("Button clicked!")}
      >
        Start
      </Button>
    </StyledEmptyHome>
  );
};
