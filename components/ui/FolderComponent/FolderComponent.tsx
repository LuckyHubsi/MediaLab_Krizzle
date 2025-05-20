import { ThemedText } from "@/components/ThemedText";
import {
  FolderContainer,
  FolderContent,
  FolderShape,
  FolderTab,
} from "./FolderComponent.styles";

interface FolderComponentProps {
  title?: string;
  itemCount?: number;
}

const FolderComponent: React.FC<FolderComponentProps> = ({
  title,
  itemCount,
}) => {
  return (
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
  );
};

export default FolderComponent;
