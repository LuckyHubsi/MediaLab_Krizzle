import { ThemedText } from "@/components/ThemedText";
import { TouchableOpacity } from "react-native";
import {
  FolderContainer,
  FolderShape,
  FolderTab,
} from "./SelectFolderComponent.styles";

interface SelectFolderComponentProps {
  title: string;
  key: string;
  onPress: () => void;
}

const SelectFolderComponent: React.FC<SelectFolderComponentProps> = ({
  title,
  onPress,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.9}
      style={{ width: "30%", marginBottom: 15, alignItems: "center", gap: 3 }}
    >
      <FolderContainer>
        <FolderShape />
        <FolderTab />
      </FolderContainer>
      <ThemedText
        colorVariant="white"
        fontWeight="semibold"
        numberOfLines={1}
        ellipsizeMode="tail"
        textIsCentered
      >
        {title}
      </ThemedText>
    </TouchableOpacity>
  );
};

export default SelectFolderComponent;
