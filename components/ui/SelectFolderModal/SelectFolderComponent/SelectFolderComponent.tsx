import { ThemedText } from "@/components/ThemedText";
import { TouchableOpacity, View } from "react-native";
import {
  Folder,
  FolderContainer,
  FolderShape,
  FolderTab,
} from "./SelectFolderComponent.styles";
import { MaterialIcons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";

interface SelectFolderComponentProps {
  title: string;
  key: string;
  onPress: () => void;
  selected: boolean;
}

const SelectFolderComponent: React.FC<SelectFolderComponentProps> = ({
  title,
  onPress,
  selected,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.9}
      style={{ width: "30%", marginBottom: 15, alignItems: "center", gap: 3 }}
    >
      <FolderContainer>
        <Folder selected={selected}>
          <FolderShape selected={selected} />
          <FolderTab selected={selected} />
        </Folder>
        {selected && (
          <MaterialIcons
            name="check-circle"
            size={24}
            color={Colors.white}
            style={{
              position: "absolute",
              zIndex: 1,
              top: "40%",
            }}
          />
        )}
      </FolderContainer>
      <ThemedText
        fontWeight="light"
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
