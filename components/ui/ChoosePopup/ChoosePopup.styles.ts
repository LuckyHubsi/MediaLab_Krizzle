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
  width: 80%;
  height: auto;
  max-height: 600px;
  border-radius: 33px;
  padding: 24px 0;
  gap: 20px;
  align-items: center;
`;

export const ItemsGrid = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: flex-start;
  gap: 10px;
  row-gap: 15px;
  padding: 0 20px;
`;

export const ItemWrapper = styled.TouchableOpacity<{
  isSelected: boolean;
  colorScheme: "light" | "dark";
}>`
  flex-direction: row;
  align-items: center;
  padding: 5px;
  border-radius: 33px;
  background-color: ${({
    isSelected,
    colorScheme,
  }: {
    isSelected: boolean;
    colorScheme: "light" | "dark";
  }) =>
    isSelected ? "#4599E8" : colorScheme === "light" ? "#EAEAEA" : "#3D3D3D"};
`;

export const ItemCircle = styled.View<{ backgroundColor: string }>`
  width: 24px;
  height: 24px;
  border-radius: 16px;
  justify-content: center;
  align-items: center;
  background-color: ${({ backgroundColor }: { backgroundColor: string }) =>
    backgroundColor};
`;

export const ColorLabel = styled.Text<{
  isSelected: boolean;
  colorScheme: "light" | "dark";
}>`
  color: {
    color: ${({
      isSelected,
      colorScheme,
    }: {
      isSelected: boolean;
      colorScheme: "light" | "dark";
    }) =>
      isSelected ? "#FBFBFB" : colorScheme === "light" ? "#585858" : "#EAEAEA"};
  }
  margin-left: 4px;
`;

export const DoneButton = styled.TouchableOpacity`
  padding: 12px 24px;
  border-radius: 30px;
  background-color: #4599e8;
`;

export const DoneButtonText = styled.Text`
  font-size: 16px;
  font-weight: 600;
  color: #fff;
`;
