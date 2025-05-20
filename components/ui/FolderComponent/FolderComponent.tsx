import { ThemedText } from "@/components/ThemedText";
import {
  FolderContainer,
  FolderContent,
  FolderShape,
  FolderTab,
} from "./FolderComponent.styles";
import { TouchableNativeFeedback, TouchableOpacity } from "react-native";

interface FolderComponentProps {
  title: string;
  itemCount: number;
}

const FolderComponent: React.FC<FolderComponentProps> = ({
  title,
  itemCount,
}) => {
  return (
    <TouchableOpacity onPress={() => {}} activeOpacity={0.9}>
      <FolderContainer>
        <FolderShape />
        <FolderTab />

        <FolderContent>
          <ThemedText
            fontWeight="semibold"
            numberOfLines={2}
            ellipsizeMode="tail"
          >
            {title}
          </ThemedText>
          <ThemedText fontWeight="light" fontSize="s">
            {itemCount} items
          </ThemedText>
        </FolderContent>
      </FolderContainer>
    </TouchableOpacity>
  );
};

export default FolderComponent;
