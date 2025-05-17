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

type ColorSchemeProps = {
  colorScheme: "light" | "dark";
};

export const AndroidPickerWrapper = styled.View<ColorSchemeProps>(
  ({ colorScheme }: ColorSchemeProps) => ({
    ...(Platform.OS === "android" && {
      borderWidth: 1,
      borderRadius: 16,
      borderColor: Colors.grey50,
      backgroundColor: colorScheme === "dark" ? Colors.grey100 : Colors.grey25,
      padding: 0,
      color: colorScheme === "dark" ? Colors.dark.text : Colors.black,
    }),
  }),
);

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
