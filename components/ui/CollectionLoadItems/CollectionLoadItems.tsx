import { FC, useState } from "react";
import Textfield from "../Textfield/Textfield";
import DateField from "../DateField/DateField";
import { StyledCardWrapper } from "./CollectionLoadItems.stlyle";
import { useColorScheme } from "@/hooks/useColorScheme";
import MultiSelectPicker from "../MultiSelectPicker/MultiSelectPicker";
import RatingPicker from "../RatingPicker/RatingPicker";
import CollectionListDropdown from "../CollectionListDropdown/CollectionListDropdown";
import { useNavigation, useRouter } from "expo-router";
import { View } from "react-native";
import { Text } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { ListCOntainer } from "./CollectionLoadItems.stlyle";
import { CollectionListText } from "../CollectionList/CollectionList.style";
import { ThemedText } from "@/components/ThemedText";

interface CollectionLoadItemProps {
  collectionTitle?: string;
  collectionTitleValue?: string;
  collectionTextValue?: string;
  collectionList?: string;
  collectionDateTitle?: string;
  collectionDateValue?: string;
  collectionRating?: string;
  collectionSelectable?: string[];
  collectionSelectableTitle?: string;
}

export const CollectionLoadItem: React.FC<CollectionLoadItemProps> = ({
  collectionTitle,
  collectionTitleValue,
  collectionTextValue,
  collectionList,
  collectionDateTitle,
  collectionDateValue,
  collectionRating,
  collectionSelectable,
  collectionSelectableTitle,
}) => {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const [selectedList, setSelectedList] = useState("");

  const handleSelectionChange = (value: string) => {
    setSelectedList(value);
  };

  return (
    <StyledCardWrapper colorScheme={colorScheme}>
      //List
      <ListCOntainer>
        <View
          style={{
            flexDirection: "row",
            flexWrap: "nowrap",
            alignContent: "center",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <MaterialIcons
            name="format-list-bulleted"
            size={16}
            color="#FFFFFF"
            style={{ marginRight: 10 }}
          />

          <CollectionListText>{collectionList}</CollectionListText>
        </View>
      </ListCOntainer>
      //Title
      <Textfield
        title={collectionTitle}
        placeholderText={collectionTitleValue}
        editable={false}
      />
      //Date
      <DateField title={collectionDateTitle} />
      //Text
      <View style={{ flexDirection: "column", gap: 12 }}>
        <ThemedText>Text</ThemedText>
        <ThemedText fontSize="s" fontWeight="light">
          {collectionTextValue}
        </ThemedText>
      </View>
      //MultiSelect
      <MultiSelectPicker
        title={collectionSelectableTitle}
        multiselectArray={collectionSelectable}
        selectedTag={null}
        onSelectTag={() => {}}
      />
      //Rating
      <ThemedText>Rating</ThemedText>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <MaterialIcons
          name="star"
          size={24}
          color="#E7C716"
          style={{ marginRight: 6 }}
        />
        <Text>{collectionRating + "/5"}</Text>
      </View>
    </StyledCardWrapper>
  );
};

export default CollectionLoadItemProps;
