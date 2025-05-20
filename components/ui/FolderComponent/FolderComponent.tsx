import { ThemedText } from "@/components/ThemedText";
import {
  FolderContainer,
  FolderContent,
  FolderShape,
  FolderTab,
} from "./FolderComponent.styles";
import {
  TouchableNativeFeedback,
  TouchableOpacity,
  useWindowDimensions,
} from "react-native";

interface FolderComponentProps {
  title: string;
  itemCount: number;
  cardWidth?: number;
}

const FolderComponent: React.FC<FolderComponentProps> = ({
  title,
  itemCount,
  cardWidth,
}) => {
  return (
    <TouchableOpacity onPress={() => {}} activeOpacity={0.9}>
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
            {itemCount} items
          </ThemedText>
        </FolderContent>
      </FolderContainer>
    </TouchableOpacity>
  );
};

export default FolderComponent;
