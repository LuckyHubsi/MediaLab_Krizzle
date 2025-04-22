import { FC } from "react";
import Textfield from "../Textfield/Textfield";
import DateField from "../DateField/DateField";
import { StyledCardWrapper } from "./AddCollectionItemCard.styles";
import { useColorScheme } from "@/hooks/useColorScheme";

interface AddCollectionItemProps {}

const AddCollectionItemCard: FC<AddCollectionItemProps> = ({}) => {
  const colorScheme = useColorScheme();
  return (
    <StyledCardWrapper colorScheme={colorScheme}>
      {/* Get correct textfield title */}
      <Textfield title="Textfield Title" placeholderText="Add text here" />
      {/* Get correct datefield title */}
      <DateField title="Date Field" />
    </StyledCardWrapper>
  );
};

export default AddCollectionItemCard;
