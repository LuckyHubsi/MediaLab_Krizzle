import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import styled from "styled-components/native";
import { Colors } from "@/constants/Colors";
import { Platform, StyleProp, TextStyle, ViewStyle } from "react-native";

export const CollectionListContainer = styled.View`
  width: 100%;
  gap: 8px;
`;

export interface PickerStyleProps {
  colorScheme: "light" | "dark";
}

export const AndroidPickerWrapper = styled.View`
  ${Platform.OS === "android" &&
  ((props: PickerStyleProps) => `
    border-width: 1px;
    border-radius: 16px;
    border-color: ${Colors.grey50};
    background-color: ${Colors.grey25};
    font-family: "Lexend_400Regular";
    padding: 0;
  `)}
`;

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
  const placeholderColor =
    colorScheme === "dark" ? Colors.grey25 : Colors.grey100;

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
      fontSize: 16,
      fontFamily: "Lexend_400Regular",
      color: textColor,
      borderWidth: 1,
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
      color: placeholderColor,
    },
  };
};
