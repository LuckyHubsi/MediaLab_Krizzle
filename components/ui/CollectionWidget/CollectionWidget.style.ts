import styled from "styled-components/native";

export const CollectionCardContainer = styled.View<{
  colorScheme: "light" | "dark";
}>`
  border-radius: 25px;
  border-width: 1px;
  border-color: ${({ colorScheme }: { colorScheme: "light" | "dark" }) =>
    colorScheme === "light" ? "#EAEAEA" : "#242424"};
  background-color: ${({ colorScheme }: { colorScheme: "light" | "dark" }) =>
    colorScheme === "light" ? "#FBFBFB" : "#242424"};
  /* Shadow for iOS */
  shadow-color: #000;
  shadow-offset: 0px 2px; /* Corrected syntax */
  shadow-opacity: 0.1;
  shadow-radius: 10px;
  /* Shadow for Android */
  elevation: 5;
  width: 100%;
  padding: 20px;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: 10px;
`;

export const CollectionTitle = styled.Text<{ colorScheme: "light" | "dark" }>`
  font-family: Lexend_400Bold;
  color: ${({ colorScheme }: { colorScheme: "light" | "dark" }) =>
    colorScheme === "light" ? "black" : "white"};
  font-weight: 700;
  font-size: 16px;
  line-height: 20px; /* 125% */
`;

export const CollectionText = styled.Text<{ colorScheme: "light" | "dark" }>`
  width: 100%;
  height: 48px; /* Set a fixed height */
  max-height: 48px; /* Limit the height to 48px */
  color: ${({ colorScheme }: { colorScheme: "light" | "dark" }) =>
    colorScheme === "light" ? "#585858" : "#ABABAB"};
  font-family: Lexend;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 24px; /* 171.429% */
  letter-spacing: -0.35px;
  overflow: hidden; /* Hide any overflowing text */
`;
export const CollectionDate = styled.Text<{ colorScheme: "light" | "dark" }>`
  color: ${({ colorScheme }: { colorScheme: "light" | "dark" }) =>
    colorScheme === "light" ? "#585858" : "#ABABAB"};
`;

export const CollectionRating = styled.Text<{ colorScheme: "light" | "dark" }>`
  color: ${({ colorScheme }: { colorScheme: "light" | "dark" }) =>
    colorScheme === "light" ? "#585858" : "#ABABAB"};
  font-family: Lexend;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 24px; /* 171.429% */
  letter-spacing: -0.35px;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

export const CollectionSelectable = styled.Text<{
  colorScheme: "light" | "dark";
}>`
  border-radius: 33px;
  border: 1px solid
    ${({ colorScheme }: { colorScheme: "light" | "dark" }) =>
      colorScheme === "light" ? "#585858" : "#EAEAEA"};
  background: ${({ colorScheme }: { colorScheme: "light" | "dark" }) =>
    colorScheme === "light" ? "#EAEAEA" : "#242424"};
  display: flex;
  padding: 4px 12px;
  justify-content: center;
  align-items: center;
  gap: 10px;
  margin-right: 5px;
  margin-top: 5px;
  color: ${({ colorScheme }: { colorScheme: "light" | "dark" }) =>
    colorScheme === "light" ? "#585858" : "#EAEAEA"};
`;
