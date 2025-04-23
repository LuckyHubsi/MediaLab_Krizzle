import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import styled from "styled-components/native";
import { Colors } from "@/constants/Colors";
import { StyleProp, TextStyle, ViewStyle } from "react-native";

export const CollectionListContainer = styled.View`
  width: 100%;
  gap: 8px;
`;

export interface PickerStyleProps {
  colorScheme: "light" | "dark";
}

export const getPickerStyles = ({
  colorScheme,
}: PickerStyleProps): {
  inputIOS: StyleProp<TextStyle>;
  inputIOSContainer: StyleProp<ViewStyle>;
  inputAndroid: StyleProp<TextStyle>;
  iconContainer: StyleProp<ViewStyle>;
  modalViewMiddle: StyleProp<ViewStyle>;
  modalViewBottom: StyleProp<ViewStyle>;
  placeholder: StyleProp<TextStyle>;
} => {
  const bgColor = colorScheme === "dark" ? Colors.grey100 : Colors.grey25;
  const textColor = colorScheme === "dark" ? Colors.dark.text : Colors.black;
  const borderColor = Colors.grey50;
  const iosModalColor = colorScheme === "dark" ? Colors.black : Colors.grey25;

  return {
    inputIOS: {
      fontSize: 16,
      fontFamily: "Lexend_400Regular",
      paddingHorizontal: 20,
      paddingVertical: 15,
      borderWidth: 1,
      borderColor: borderColor,
      borderRadius: 16,
      color: textColor,
      backgroundColor: bgColor,
    },
    inputIOSContainer: {
      width: "100%",
      justifyContent: "center",
    },
    inputAndroid: {
      height: 50,
      fontSize: 16,
      fontFamily: "Lexend_400Regular",
      paddingHorizontal: 12,
      borderWidth: 1,
      borderColor: borderColor,
      borderRadius: 16,
      color: textColor,
      backgroundColor: bgColor,
    },
    iconContainer: {
      top: 15,
      right: 12,
    },
    modalViewMiddle: {
      backgroundColor: iosModalColor,
    },
    modalViewBottom: {
      backgroundColor: iosModalColor,
    },
    placeholder: {
      color: Colors.grey100, // or whichever color you meant instead of `grey1ßß`
    },
  };
};
