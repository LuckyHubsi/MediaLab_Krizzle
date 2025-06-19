import { ThemedText } from "@/components/ThemedText";
import { TouchableOpacity } from "react-native";
import {
  Folder,
  FolderContainer,
  FolderShape,
  FolderTab,
} from "./SelectFolderComponent.styles";
import { MaterialIcons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";

/**
 * Component for selecting a folder and selection state.
 *
 * @param title (required) - The title of the folder.
 * @param key (required) - Unique key for the folder component.
 * @param onPress (required) - Callback function to handle folder selection.
 * @param selected (required) - Boolean indicating if the folder is selected.
 * @param itemSize (required) - The size of the folder item.
 */

interface SelectFolderComponentProps {
  title: string;
  key: string;
  onPress: () => void;
  selected: boolean;
  itemSize: number;
}

const SelectFolderComponent: React.FC<SelectFolderComponentProps> = ({
  title,
  onPress,
  selected,
  itemSize,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.9}
      style={{
        width: itemSize,
        marginBottom: 15,
        alignItems: "center",
      }}
      accessibilityRole="radio"
      accessibilityLabel={`Folder: ${title}`}
      accessibilityHint="Activating selects this folder"
      accessibilityState={{ selected: selected }}
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
