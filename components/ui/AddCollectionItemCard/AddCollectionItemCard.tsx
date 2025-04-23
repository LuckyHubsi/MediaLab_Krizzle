import { FC } from "react";
import Textfield from "../Textfield/Textfield";
import DateField from "../DateField/DateField";
import { StyledCardWrapper } from "./AddCollectionItemCard.styles";
import { useColorScheme } from "@/hooks/useColorScheme";
import MultiSelectPicker from "../MultiSelectPicker/MultiSelectPicker";

interface AddCollectionItemProps {}

const AddCollectionItemCard: FC<AddCollectionItemProps> = ({}) => {
  const colorScheme = useColorScheme();

  return (
    <StyledCardWrapper colorScheme={colorScheme}>
      {/* Get correct textfield title */}
      <Textfield title="Textfield Title" placeholderText="Add text here" />
      {/* Get correct datefield title */}
      <DateField title="Date Field" />
      {/* Get correct multi select */}
      <MultiSelectPicker
        title="MultiSelect Title"
        multiselectArray={["scifi", "fantasy", "horror"]}
        selectedTag={null}
        onSelectTag={() => {}}
      />
    </StyledCardWrapper>
  );
};

export default AddCollectionItemCard;
