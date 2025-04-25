import { Platform } from "react-native";
import styled from "styled-components/native";

export const StyledView = styled.View<{
  backgroundColor: string;
  topPadding: number;
}>`
  padding: ${({ topPadding }: { topPadding: number }) => `${topPadding}px`} 20px
    0px 20px;
  background-color: ${({ backgroundColor }: { backgroundColor: string }) =>
    backgroundColor};
  display: flex;
  flex-direction: column;
  height: 100%;
  gap: 15px;
  font-family: "Lexend_400Regular";
`;

// export const StyledView = styled.View<{ backgroundColor: string }>`
//   padding: ${Platform.OS === "ios" ? "0px 20px 0px 20px" : "20px"};
//   background-color: ${({ backgroundColor }: { backgroundColor: string }) =>
//     backgroundColor};
//   display: flex;
//   flex-direction: column;
//   height: 100%;
//   gap: 15px;
//   font-family: "Lexend_400Regular";
// `;
