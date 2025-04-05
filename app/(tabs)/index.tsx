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

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const color = Colors[colorScheme || "light"].tint;
  const { width } = useWindowDimensions();
  const columns = width >= 768 ? 3 : 2;

  const exampleWidgets = [
    {
      id: "1",
      title: "Grocery lists",
      label: "Lists",
      color: "gradientPink", // Ensure this matches the allowed ColorKey values
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
    {
      id: "3",
      title: "Café’s 2024",
      label: "Cafés",
      color: "gradientBlue",
      iconLeft: (
        <MaterialCommunityIcons name="coffee" size={20} color="black" />
      ),
      iconRight: (
        <MaterialCommunityIcons name="clipboard-text" size={20} color="black" />
      ),
    },
    {
      id: "4",
      title: "Books 2026",
      label: "Books",
      color: "gradientRed",
      iconLeft: <MaterialCommunityIcons name="book" size={20} color="black" />,
      iconRight: (
        <MaterialCommunityIcons name="file-document" size={20} color="black" />
      ),
    },
    {
      id: "5",
      title: "Grocery list",
      label: "Lists",
      color: "gradientGreen", // Ensure this matches the allowed ColorKey values
      iconRight: (
        <MaterialCommunityIcons name="clipboard-text" size={20} color="black" />
      ),
    },
    {
      id: "6",
      title: "Daily To-Dos",
      label: "To-Dos",
      color: "lightBlue", // Ensure this matches the allowed ColorKey values
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
    {
      id: "7",
      title: "Café’s 2025",
      label: "Cafés",
      color: "violet",
      iconLeft: (
        <MaterialCommunityIcons name="coffee" size={20} color="black" />
      ),
      iconRight: (
        <MaterialCommunityIcons name="clipboard-text" size={20} color="black" />
      ),
    },
    {
      id: "8",
      title: "Books 2025",
      label: "Books",
      color: "pink",
      iconLeft: <MaterialCommunityIcons name="book" size={20} color="black" />,
      iconRight: (
        <MaterialCommunityIcons name="file-document" size={20} color="black" />
      ),
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

        <SearchBar
          placeholder="Search"
          onSearch={(query) => console.log(query)}
        />
        {/* <ThemedText fontSize="regular" fontWeight="regular">
          Pinned
        </ThemedText>
        <FlatList
          data={exampleWidgetsPinned}
          keyExtractor={(item) => item.id}
          numColumns={columns}
          columnWrapperStyle={{
            justifyContent: "space-between",
            marginBottom: 16, // spacing between rows
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
        /> */}
        <TagList
          tags={["All", "Games", "Books", "Movies", "Cafés"]}
          onSelect={(tag) => {
            console.log("Selected tag:", tag);
            // Optional: filter your FlatList data here
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
            marginBottom: 16, // spacing between rows
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
      </ThemedView>
    </SafeAreaView>
  );
}
