import React, { useState, FC } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { FlatList, TouchableOpacity, useColorScheme, View } from "react-native";
import { ThemedView } from "@/components/ui/ThemedView/ThemedView";
import { Card } from "@/components/ui/Card/Card";
import { Header } from "@/components/ui/Header/Header";
import { Button } from "@/components/ui/Button/Button";
import { AddButton } from "@/components/ui/AddButton/AddButton";
import { ThemedText } from "@/components/ThemedText";
import {
  Container,
  AddButtonWrapper,
  ListContent,
  NextButtonWrapper,
  RemoveButton,
  RemoveButtonContent,
} from "./CreateCollectionList.styles";
import Textfield from "../../Textfield/Textfield";
import { MaterialIcons } from "@expo/vector-icons";
import { IconTopRight } from "../../IconTopRight/IconTopRight";
import { Colors } from "@/constants/Colors";
import { InfoPopup } from "@/components/Modals/InfoModal/InfoModal";

const CreateCollectionList: FC = () => {
  const [cards, setCards] = useState<{ id: string }[]>([]);
  const router = useRouter();
  const [showHelp, setShowHelp] = useState(false);

  const handleAddCard = () => {
    const newCard = { id: Date.now().toString() };
    setCards((prevCards) => [...prevCards, newCard]);
  };

  const handleNext = () => {
    router.push("./collectionTemplate");
  };

  const handleRemoveCard = (id: string) => {
    setCards((prevCards) => prevCards.filter((card) => card.id !== id));
  };

  const colorScheme = useColorScheme();
  const iconColor =
    colorScheme === "dark" ? Colors.dark.text : Colors.light.text;

  return (
    <>
      <Container>
        <Card>
          <IconTopRight>
            <TouchableOpacity onPress={() => setShowHelp(true)}>
              <MaterialIcons name="help-outline" size={26} color={iconColor} />
            </TouchableOpacity>
          </IconTopRight>
          <Header title="Adding Lists" />
          <View style={{ marginLeft: 15 }}>
            <ThemedText fontSize="s" fontWeight="light">
              Add Lists to organize your Collections
            </ThemedText>
          </View>
        </Card>

        <FlatList
          style={{ marginBottom: 90 }}
          data={cards}
          keyExtractor={(item) => item.id}
          contentContainerStyle={ListContent}
          renderItem={({ item }) => (
            <Card>
              <ThemedText
                fontSize="regular"
                fontWeight="regular"
                style={{ marginBottom: 15 }}
              >
                List {cards.findIndex((card) => card.id === item.id) + 1}
              </ThemedText>
              <Textfield
                showTitle={false}
                textfieldIcon="text-fields"
                placeholderText={`Add a title to your note`}
                title={""}
                value={""}
                onChangeText={() => {}}
              />
              <RemoveButton onPress={() => handleRemoveCard(item.id)}>
                <RemoveButtonContent>
                  <MaterialIcons
                    name="delete"
                    size={16}
                    color="#ff4d4d"
                    style={{ marginRight: 6, marginTop: 2 }}
                  />
                  <ThemedText
                    fontSize="s"
                    fontWeight="bold"
                    style={{ color: "#ff4d4d" }}
                  >
                    remove
                  </ThemedText>
                </RemoveButtonContent>
              </RemoveButton>
            </Card>
          )}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={
            <AddButtonWrapper>
              <AddButton onPress={handleAddCard} />
            </AddButtonWrapper>
          }
        />

        <NextButtonWrapper>
          <Button onPress={handleNext}>Next</Button>
        </NextButtonWrapper>
      </Container>

      {showHelp && (
        <InfoPopup
          visible={showHelp}
          onClose={() => setShowHelp(false)}
          image={require("@/assets/images/list-guide.png")}
          title="What is a Collection List?"
          description={`Create Lists to group together related Items from one category together.\n\nFor example, inside your Books Collection you could create Lists for “Read Books”, “Book Wishlist” or anything you’d like.\n\nMake it your own!`}
        />
      )}
    </>
  );
};

export default CreateCollectionList;
