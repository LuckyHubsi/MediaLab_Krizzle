import React, { FC, useState } from "react";
import { Image } from "react-native";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";
import { Button } from "../ui/Button/Button";
import { ThemedText } from "../ThemedText";
import { StyledEmptyHome } from "./emptyHome.styles";
import { ModalSelection } from "../ui/ModalSelection/ModalSelection";

export const EmptyHome: FC = () => {
  const colorScheme = useColorScheme() ?? "light";
  const [isModalVisible, setModalVisible] = useState(false);

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
        onPress={() => setModalVisible(true)}
      >
        Start
      </Button>
      <ModalSelection
        isVisible={isModalVisible}
        onClose={() => setModalVisible(false)}
      />
    </StyledEmptyHome>
  );
};
