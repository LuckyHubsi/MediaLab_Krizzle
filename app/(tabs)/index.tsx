import { FlatList } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ui/ThemedView/ThemedView";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";
import { SafeAreaView } from "react-native-safe-area-context";
import SearchBar from "@/components/ui/SearchBar/SearchBar";
import Widget from "@/components/ui/Widget/Widget";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useWindowDimensions } from "react-native";
import TagList from "@/components/ui/TagList/TagList";
import { WidgetIcons } from "@/constants/Icons";
import { EmptyHome } from "@/components/emptyHome/emptyHome";

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const color = Colors[colorScheme || "light"].tint;
  const { width } = useWindowDimensions();
  const columns = width >= 768 ? 3 : 2;

  // const exampleWidgets = [
  //   {
  //     id: "1",
  //     title: "Grocery lists",
  //     label: "Lists",
  //     color: "gradientPink", // Ensure this matches the allowed ColorKey values
  //     iconLeft: WidgetIcons.food,
  //     iconRight: WidgetIcons.note,
  //   },
  //   {
  //     id: "2",
  //     title: "Daily To-Dost",
  //     label: "To-Dos",
  //     color: "gradientPurple", // Ensure this matches the allowed ColorKey values
  //     iconLeft: WidgetIcons.checkbox,
  //     iconRight: WidgetIcons.note,
  //   },
  //   {
  //     id: "3",
  //     title: "Café’s 2024",
  //     label: "Cafés",
  //     color: "gradientBlue",
  //     iconLeft: WidgetIcons.coffee,
  //     iconRight: WidgetIcons.collection,
  //   },
  //   {
  //     id: "4",
  //     title: "Books 2026",
  //     label: "Books",
  //     color: "gradientRed",
  //     iconLeft: WidgetIcons.book,
  //     iconRight: WidgetIcons.note,
  //   },
  //   {
  //     id: "5",
  //     title: "Grocery list",
  //     label: "Lists",
  //     color: "gradientGreen", // Ensure this matches the allowed ColorKey values
  //     iconLeft: WidgetIcons.book,
  //     iconRight: WidgetIcons.note,
  //   },
  //   {
  //     id: "6",
  //     title: "Daily To-Dos",
  //     label: "To-Dos",
  //     color: "lightBlue", // Ensure this matches the allowed ColorKey values
  //     iconLeft: WidgetIcons.book,
  //     iconRight: WidgetIcons.note,
  //   },
  //   {
  //     id: "7",
  //     title: "Café’s 2025",
  //     label: "Cafés",
  //     color: "violet",
  //     iconLeft: WidgetIcons.book,
  //     iconRight: WidgetIcons.note,
  //   },
  //   {
  //     id: "8",
  //     title: "Books 2025",
  //     label: "Books",
  //     color: "pink",
  //     iconLeft: WidgetIcons.book,
  //     iconRight: WidgetIcons.note,
  //   },
  // ];

  const exampleWidgets = [
    {
      id: "1",
      title: "Grocery lists",
      label: "Lists",
      color: "gradientPink",
      iconLeft: WidgetIcons.food,
      iconRight: WidgetIcons.note,
    },
  ];

  const exampleWidgetsPinned = [
    {
      id: "1",
      title: "Grocery lists",
      label: "Lists",
      color: "sage", // Ensure this matches the allowed ColorKey values
      iconRight: (
        <MaterialCommunityIcons name="clipboard-text" size={20} color="black" />
      ),
    },
    {
      id: "2",
      title: "Daily To-Dost",
      label: "To-Dos",
      color: "gradientPurple", // Ensure this matches the allowed ColorKey values
      iconLeft: (
        <MaterialCommunityIcons
          name="checkbox-marked-circle-outline"
          size={20}
          color="black"
        />
      ),
      iconRight: (
        <MaterialCommunityIcons name="clipboard-text" size={20} color="black" />
      ),
    },
  ];

  return (
    <SafeAreaView>
      <ThemedView>
        <ThemedText fontSize="xl" fontWeight="bold">
          Home
        </ThemedText>

        {exampleWidgets.length > 0 ? (
          <>
            <SearchBar
              placeholder="Search"
              onSearch={(query) => console.log(query)}
            />

            <TagList
              tags={["All", "Games", "Books", "Movies", "Cafés"]}
              onSelect={(tag) => {
                console.log("Selected tag:", tag);
              }}
            />

            <ThemedText fontSize="regular" fontWeight="regular">
              Recent
            </ThemedText>

            <FlatList
              data={exampleWidgets}
              keyExtractor={(item) => item.id}
              numColumns={columns}
              columnWrapperStyle={{
                justifyContent: "space-between",
                marginBottom: 16,
              }}
              renderItem={({ item }) => (
                <Widget
                  title={item.title}
                  label={item.label}
                  iconLeft={item.iconLeft}
                  iconRight={item.iconRight}
                  color={item.color}
                  onPress={() => console.log("Pressed:", item.title)}
                />
              )}
            />
          </>
        ) : (
          <EmptyHome />
        )}
      </ThemedView>
    </SafeAreaView>
  );
}
