import { FlatList, Image } from "react-native";
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
import { WidgetIcons } from "@/constants/WidgetIcons";
import { EmptyHome } from "@/components/emptyHome/emptyHome";
import React, { useState, useMemo } from "react";
import { IconTopRight } from "@/components/ui/IconKriz/IconTopRight";

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const color = Colors[colorScheme || "light"].tint;
  const { width } = useWindowDimensions();
  const columns = width >= 768 ? 3 : 2;
  const [selectedTag, setSelectedTag] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

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

  const widgets = [
    {
      id: "1",
      title: "Grocery lists",
      tag: "Lists",
      color: "gradientPink",
      iconLeft: WidgetIcons.food,
      iconRight: WidgetIcons.note,
    },
    {
      id: "2",
      title: "Books 2025",
      tag: "Books",
      color: "pink",
      iconLeft: WidgetIcons.book,
      iconRight: WidgetIcons.note,
    },
    {
      id: "3",
      title: "Café’s 2025",
      tag: "Cafés",
      color: "violet",
      iconLeft: WidgetIcons.coffee,
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

  const filteredWidgets = useMemo(() => {
    const lowerQuery = searchQuery.toLowerCase();

    return widgets.filter((widget) => {
      const matchesTag = selectedTag === "All" || widget.tag === selectedTag;
      const matchesTitle = widget.title.toLowerCase().includes(lowerQuery);
      return matchesTag && matchesTitle;
    });
  }, [widgets, selectedTag, searchQuery]);

  return (
    <SafeAreaView>
      <ThemedView>
        <IconTopRight>
          <Image
            source={require("@/assets/images/kriz.png")}
            style={{ width: 30, height: 32 }}
          />
        </IconTopRight>
        <ThemedText fontSize="xl" fontWeight="bold">
          Home
        </ThemedText>

        {widgets.length === 0 ? (
          <EmptyHome />
        ) : (
          <>
            <SearchBar
              placeholder="Search"
              onSearch={(query) => setSearchQuery(query)}
            />

            <TagList
              tags={["All", "Books", "Cafés", "Lists", "To-Dos"]}
              onSelect={(tag) => setSelectedTag(tag)}
            />

            {filteredWidgets.length > 0 ? (
              <>
                <ThemedText fontSize="regular" fontWeight="regular">
                  Recent
                </ThemedText>

                <FlatList
                  data={filteredWidgets}
                  keyExtractor={(item) => item.id}
                  numColumns={columns}
                  columnWrapperStyle={{
                    justifyContent: "space-between",
                    marginBottom: 16,
                  }}
                  renderItem={({ item }) => (
                    <Widget
                      title={item.title}
                      label={item.tag}
                      iconLeft={item.iconLeft}
                      iconRight={item.iconRight}
                      color={item.color}
                      onPress={() => console.log("Pressed:", item.title)}
                    />
                  )}
                />
              </>
            ) : (
              <ThemedText
                fontSize="regular"
                fontWeight="regular"
                style={{ textAlign: "center", marginTop: 25 }}
              >
                No entries for "{searchQuery}"
              </ThemedText>
            )}
          </>
        )}
      </ThemedView>
    </SafeAreaView>
  );
}
