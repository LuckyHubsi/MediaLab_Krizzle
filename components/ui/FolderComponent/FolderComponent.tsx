import { ThemedText } from "@/components/ThemedText";
import {
  FolderContainer,
  FolderContent,
  FolderShape,
  FolderTab,
} from "./FolderComponent.styles";
import { TouchableOpacity } from "react-native";

/**
 * Component for displaying a UI element styled like a folder.
 * @param title (required) - The title of the folder.
 * @param itemCount (required) - The number of items in the folder.
 * @param cardWidth - Optional width for the folder card.
 * @param onPress (required) - Callback function to handle press events.
 * @param onLongPress - Optional callback function to handle long press events.
 */

interface FolderComponentProps {
  title: string;
  itemCount: number;
  cardWidth?: number;
  onPress: () => void;
  onLongPress?: () => void;
}

const FolderComponent: React.FC<FolderComponentProps> = ({
  title,
  itemCount,
  cardWidth,
  onPress,
  onLongPress,
}) => {
  /**
   * Function to handle long press events.
   * If an onLongPress callback is provided, it will be called.
   */
  const handleLongPress = () => {
    if (onLongPress) {
      onLongPress();
    } else {
      console.log("Long press detected on widget:", title);
    }
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.9}
      onLongPress={handleLongPress}
    >
      <FolderContainer cardWidth={cardWidth}>
        <FolderShape />
        <FolderTab />

        <FolderContent>
          <ThemedText
            colorVariant="white"
            fontWeight="semibold"
            numberOfLines={2}
            ellipsizeMode="tail"
          >
            {title}
          </ThemedText>
          <ThemedText fontWeight="light" fontSize="s" colorVariant="white">
            {itemCount} {itemCount === 1 ? "item" : "items"}
          </ThemedText>
        </FolderContent>
      </FolderContainer>
    </TouchableOpacity>
  );
};

export default FolderComponent;
