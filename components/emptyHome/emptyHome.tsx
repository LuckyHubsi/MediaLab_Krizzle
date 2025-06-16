import React, { FC, useState } from "react";
import { Image } from "react-native";
import { Button } from "../ui/Button/Button";
import { ThemedText } from "../ThemedText";
import { StyledEmptyHome } from "./emptyHome.styles";
import { ModalSelection } from "../Modals/CreateNCModal/CreateNCModal";
import { useActiveColorScheme } from "@/context/ThemeContext";

/**
 * Component to display an empty home screen with a message and an optional button.
 *
 * @param text - The message to display when there are no notes or collections.
 * @param showButton - Whether to show the button (default is true).
 * @param buttonLabel - The label for the button (default is "Start").
 * @param onButtonPress - Callback function to handle button press events.
 * @param useModal - Whether to use a modal for creating a new note/collection (default is true).
 */

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

  /**
   * Handles the button press event.
   */
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
        accessible={false}
      />
      <ThemedText
        fontSize="regular"
        fontWeight="regular"
        accessible={true}
        accessibilityRole="text"
      >
        {text}
      </ThemedText>
      {showButton && <Button onPress={handlePress}>{buttonLabel}</Button>}
      {useModal && (
        <ModalSelection
          isVisible={isModalVisible}
          onClose={() => setModalVisible(false)}
        />
      )}
    </StyledEmptyHome>
  );
};
