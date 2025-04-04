import styled from "styled-components/native";

export const Backdrop = styled.View`
  flex: 1;
  background-color: rgba(0, 0, 0, 0.5);
  justify-content: center;
  align-items: center;
`;

export const Content = styled.View<{ colorScheme: "light" | "dark" }>`
  background-color: ${({ colorScheme }: { colorScheme: "light" | "dark" }) =>
    colorScheme === "light" ? "#fff" : "#1A1A1A"};
  width: 350px;
  height: 500px;
  border-radius: 20px;
  padding: 24px 0;
  gap: 20px;
  align-items: center;
`;

export const PopupTitle = styled.Text`
  font-size: 18px;
  font-weight: 700;
  color: white;
  text-align: center;
`;

export const ItemsGrid = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  gap: 16px;
  padding: 0 20px;
`;

export const ItemWrapper = styled.TouchableOpacity<{
  isSelected: boolean;
}>`
  flex-direction: row;
  align-items: center;
  padding: 8px 12px;
  border-radius: 33px;
  background-color: ${({ isSelected }: { isSelected: boolean }) =>
    isSelected ? "#4599E8" : "#EAEAEA"};
  margin: 8px;
`;

export const ItemCircle = styled.View<{ backgroundColor: string }>`
  width: 24px;
  height: 24px;
  border-radius: 16px;
  background-color: ${({ backgroundColor }: { backgroundColor: string }) =>
    backgroundColor};
`;

export const ColorLabel = styled.Text<{
  isSelected: boolean;
  colorScheme: "light" | "dark";
}>`
  font-family: Lexend;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 24px;
  letter-spacing: -0.4px;
  color: ${({
    isSelected,
    colorScheme,
  }: {
    isSelected: boolean;
    colorScheme: "light" | "dark";
  }) =>
    isSelected ? "#FBFBFB" : colorScheme === "light" ? "#585858" : "#EAEAEA"};
`;

export const DoneButton = styled.TouchableOpacity`
  padding: 12px 24px;
  border-radius: 30px;
  background-color: #4599e8;
`;

export const DoneButtonText = styled.Text<{ colorScheme: "light" | "dark" }>`
  font-size: 16px;
  font-weight: 600;
  color: ${({ colorScheme }: { colorScheme: "light" | "dark" }) =>
    colorScheme === "light" ? "#fff" : "#fff"};
`;
