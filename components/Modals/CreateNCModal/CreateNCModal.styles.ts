import styled from "styled-components/native";
import { Colors } from "@/constants/Colors";

type ThemeProps = {
  colorScheme: "light" | "dark";
};

export const Overlay = styled.View`
  flex: 1;
  justify-content: flex-end;
  background-color: rgba(0, 0, 0, 0.5);
`;

export const BottomSheet = styled.View<ThemeProps>`
  background-color: ${({ colorScheme }: ThemeProps) =>
    Colors[colorScheme].background};
  padding: 20px;
  padding-top: 15px;
  border-top-left-radius: 24px;
  border-top-right-radius: 24px;
  align-items: center;
`;

export const DragIndicator = styled.View`
  width: 40px;
  height: 5px;
  background-color: #ccc;
  border-radius: 10px;
  margin-bottom: 20px;
`;

export const OptionsRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  gap: 16px;
`;

export const OptionButton = styled.TouchableOpacity<ThemeProps>`
  flex: 1;
  padding: 20px;
  background-color: ${({ colorScheme }: ThemeProps) =>
    colorScheme === "light" ? "#F1F1F1" : "#2D2D2D"};
  border-radius: 33px;
  align-items: center;
  justify-content: center;
`;

export const OptionIcon = styled.View`
  margin-bottom: 8px;
`;

export const OptionText = styled.Text`
  text-align: center;
`;
