import { ThemedText } from "@/components/ThemedText";
import { FC } from "react";
import {
  ItemCountContainer,
  ItemCount,
} from "./CreateCollectionTemplate.styles";
import { useColorScheme } from "@/hooks/useColorScheme";
import { AddButton } from "../../AddButton/AddButton";
import BottomButtons from "../../BottomButtons/BottomButtons";
import ItemTemplateCard from "./ItemTemplateCard/ItemTemplateCard";

interface CreateCollectionTemplateProps {
  title: string;
  //   itemTypes?: string[];
  //itemPreview?: string[];
}

const CreateCollectionTemplate: FC<CreateCollectionTemplateProps> = ({
  title,
  // onChangeText,
  //  value
}) => {
  const itemTypeCount = 3;
  const itemPreviewCount = 3;
  const colorScheme = useColorScheme();

  return (
    <>
      <ItemCountContainer>
        <ItemCount colorScheme={colorScheme}>
          <ThemedText colorVariant={"primary"}>{itemTypeCount}</ThemedText>
          <ThemedText
            colorVariant={colorScheme === "light" ? "grey" : "lightGrey"}
          >
            /10 Item Types
          </ThemedText>
        </ItemCount>
        <ItemCount colorScheme={colorScheme}>
          <ThemedText colorVariant={"primary"}>{itemPreviewCount}</ThemedText>
          <ThemedText
            colorVariant={colorScheme === "light" ? "grey" : "lightGrey"}
          >
            /3 Item Previews
          </ThemedText>
        </ItemCount>
      </ItemCountContainer>

      <ItemTemplateCard isTitleCard={true} />

      <AddButton onPress={undefined} />

      <BottomButtons
        variant={"back"}
        titleLeftButton={"Back"}
        titleRightButton={"Add"}
        onDiscard={function (): void {
          throw new Error("Function not implemented.");
        }}
        onNext={function (): void {
          throw new Error("Function not implemented.");
        }}
      />
    </>
  );
};

export default CreateCollectionTemplate;
