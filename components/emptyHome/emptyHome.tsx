import React, { FC, useState } from "react";
import { Image } from "react-native";
import { Colors } from "@/constants/Colors";
import { Button } from "../ui/Button/Button";
import { ThemedText } from "../ThemedText";
import { StyledEmptyHome } from "./emptyHome.styles";
import { ModalSelection } from "../Modals/CreateNCModal/CreateNCModal";
import { useActiveColorScheme } from "@/context/ThemeContext";

interface EmptyHomeProps {
  text?: string;
  showButton?: boolean;
  buttonLabel?: string;
  onButtonPress?: () => void;
  useModal?: boolean;
}

export const EmptyHome: FC<EmptyHomeProps> = ({
  text = "Add your first note/collection",
  showButton = true,
  buttonLabel = "Start",
  onButtonPress,
  useModal = true,
}) => {
  const colorScheme = useActiveColorScheme() ?? "light";
  const [isModalVisible, setModalVisible] = useState(false);

  const handlePress = () => {
    if (useModal) {
      setModalVisible(true);
    } else if (onButtonPress) {
      onButtonPress();
    }
  };

  return (
    <StyledEmptyHome colorScheme={colorScheme}>
      <Image
        source={require("@/assets/images/kriz.png")}
        style={{ width: 65, height: 70 }}
      />
      <ThemedText fontSize="regular" fontWeight="regular">
        {text}
      </ThemedText>
      {showButton && (
        <Button
          color={Colors[colorScheme].tint}
          size="medium"
          onPress={handlePress}
        >
          {buttonLabel}
        </Button>
      )}
      {useModal && (
        <ModalSelection
          isVisible={isModalVisible}
          onClose={() => setModalVisible(false)}
        />
      )}
    </StyledEmptyHome>
  );
};
