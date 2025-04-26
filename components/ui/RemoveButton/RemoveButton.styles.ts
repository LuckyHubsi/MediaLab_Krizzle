import { Colors } from "@/constants/Colors";
import styled from "styled-components/native";

export const StyledButtonContainer = styled.TouchableOpacity`
  padding: 10px 20px;
  border-radius: 33px;
  width: 50%;
  gap: 10px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  border: 1px solid ${Colors.negative};
`;
