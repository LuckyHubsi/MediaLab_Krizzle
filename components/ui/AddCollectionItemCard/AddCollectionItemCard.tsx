import { FC, useState } from "react";
import Textfield from "../Textfield/Textfield";
import DateField from "../DateField/DateField";
import { StyledCardWrapper } from "./AddCollectionItemCard.styles";
import MultiSelectPicker from "../MultiSelectPicker/MultiSelectPicker";
import RatingPicker from "../RatingPicker/RatingPicker";
import CollectionListDropdown from "../CollectionListDropdown/CollectionListDropdown";
import { ScrollView } from "react-native";
import { useActiveColorScheme } from "@/context/ThemeContext";

interface AddCollectionItemProps {}

const AddCollectionItemCard: FC<AddCollectionItemProps> = ({}) => {
  const colorScheme = useActiveColorScheme();
  const [selectedList, setSelectedList] = useState("");

  const handleSelectionChange = (value: string) => {
    setSelectedList(value);
  };

  return (
    <StyledCardWrapper colorScheme={colorScheme}>
      <ScrollView
        contentContainerStyle={{
          gap: 30,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* get correct list */}
        <CollectionListDropdown
          title={"Select a List"}
          collectionList={["list 1", "list 2", "list 3"]}
          selectedList={selectedList}
          onSelectionChange={handleSelectionChange}
        />
        {/* Get correct textfield title */}
        <Textfield
          title="Textfield Title"
          placeholderText="Add text here"
          onChangeText={function (text: string): void {
            throw new Error("Function not implemented.");
          }}
          value={""}
        />
        {/* Get correct datefield title */}
        <DateField title="Date Field" />
        {/* Get correct multi select */}
        <MultiSelectPicker
          title="MultiSelect Title"
          multiselectArray={["scifi", "fantasy", "horror"]}
          selectedTag={null}
          onSelectTag={() => {}}
        />
        {/* Get correct rating */}
        <RatingPicker title={"Rating"} selectedIcon="star" />
      </ScrollView>
    </StyledCardWrapper>
  );
};

export default AddCollectionItemCard;
