import {
  Platform,
  StatusBar,
  View,
  FlatList,
  AccessibilityInfo,
  findNodeHandle,
  ScrollView,
} from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ui/ThemedView/ThemedView";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";
import { SafeAreaView } from "react-native-safe-area-context";
import SearchBar from "@/components/ui/SearchBar/SearchBar";
import Widget from "@/components/ui/Widget/Widget";
import { MaterialIcons } from "@expo/vector-icons";
import { useWindowDimensions } from "react-native";
import { EmptyHome } from "@/components/emptyHome/emptyHome";
import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
} from "react";
import { IconTopRight } from "@/components/ui/IconTopRight/IconTopRight";
import { useFocusEffect } from "@react-navigation/native";
import DeleteModal from "@/components/Modals/DeleteModal/DeleteModal";
import { GeneralPageDTO } from "@/shared/dto/GeneralPageDTO";
import { useRouter } from "expo-router";
import QuickActionModal from "@/components/Modals/QuickActionModal/QuickActionModal";
import { PageType } from "@/shared/enum/PageType";
import { GeneralPageState } from "@/shared/enum/GeneralPageState";
import { CustomStyledHeader } from "@/components/ui/CustomStyledHeader/CustomStyledHeader";
import { useServices } from "@/context/ServiceContext";
import { EnrichedError } from "@/shared/error/ServiceError";
import { ErrorPopup } from "@/components/Modals/ErrorModal/ErrorModal";
import { useSnackbar } from "@/components/ui/Snackbar/Snackbar";

/**
 * ArchiveScreen component displays archived widgets (notes and collections).
 */

/**
 * Returns a Material icon component with the specified name, size, and color.
 */
export const getMaterialIcon = (name: string, size = 22, color = "black") => {
  return <MaterialIcons name={name as any} size={size} color={color} />;
};

/**
 * Returns the appropriate icon for a given page type.
 */
export const getIconForPageType = (type: string) => {
  switch (type) {
    case "note":
      return getMaterialIcon("sticky-note-2");
    case "collection":
      return getMaterialIcon("collections-bookmark");
    default:
      return undefined;
  }
};

export default function ArchiveScreen() {
  const { generalPageService } = useServices();
  const colorScheme = useColorScheme();
  const { width } = useWindowDimensions();
  const columns = width >= 768 ? 3 : 2;
  const router = useRouter();

  interface ArchivedWidget {
    id: string;
    title: string;
    tag: string;
    page_icon?: string;
    page_type: PageType;
    color?: string;
    archived: boolean;
    [key: string]: any;
  }

  const [shouldReload, setShouldReload] = useState<boolean>(false);
  const [widgets, setWidgets] = useState<ArchivedWidget[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedWidget, setSelectedWidget] = useState<ArchivedWidget | null>(
    null,
  );

  const { showSnackbar } = useSnackbar();

  const [errors, setErrors] = useState<EnrichedError[]>([]);
  const [showError, setShowError] = useState(false);

  // for screenreader compatibility
  const [announceKey, setAnnounceKey] = useState(0);
  const [shouldAnnounceEmpty, setShouldAnnounceEmpty] = useState(false);
  const headerRef = useRef<View | null>(null);

  const getColorKeyFromValue = (
    value: string,
  ): keyof typeof Colors.widget | undefined => {
    const colorKeys = Object.keys(Colors.widget);

    return colorKeys.find((key) => {
      const currentColor = Colors.widget[key as keyof typeof Colors.widget];
      return (
        value === key || // if the value is already the color key like "rose"
        (typeof currentColor === "string" && currentColor === value) || // hex match
        (Array.isArray(currentColor) && currentColor.includes(value)) // match inside gradients
      );
    }) as keyof typeof Colors.widget | undefined;
  };

  /**
   * Maps an array of GeneralPageDTO objects to an array of enriched Widget objects (with added properties).
   * @param data - Array of GeneralPageDTO objects or null.
   */
  const mapToEnrichedWidgets = (
    data: GeneralPageDTO[] | null,
  ): ArchivedWidget[] => {
    if (data == null) {
      return [];
    } else {
      const enrichedWidgets: ArchivedWidget[] = (data || []).map((widget) => ({
        id: String(widget.pageID),
        title: widget.page_title,
        tag: widget.tag?.tag_label || "Uncategorized",
        color:
          getColorKeyFromValue(widget.page_color || Colors.primary) ??
          Colors.primary,
        page_type: widget.page_type,
        icon: widget.page_icon ? getMaterialIcon(widget.page_icon) : undefined,
        archived: widget.archived,
      }));
      return enrichedWidgets;
    }
  };

  // Load archived widgets when the screen is focused
  useFocusEffect(
    useCallback(() => {
      const fetchWidgets = async () => {
        try {
          const archiveResult = await generalPageService.getAllGeneralPageData(
            GeneralPageState.Archived,
          );

          if (archiveResult.success) {
            const enrichedWidgets: ArchivedWidget[] = mapToEnrichedWidgets(
              archiveResult.value,
            );
            setWidgets(enrichedWidgets);

            // remove all prior errors from the archived widgets source if service call succeeded
            setErrors((prev) =>
              prev.filter((error) => error.source !== "widgets:archived"),
            );
          } else {
            // set all errors to the previous errors plus add the new error
            // define the id and the source and set its read status to false
            setErrors((prev) => [
              ...prev,
              {
                ...archiveResult.error,
                hasBeenRead: false,
                id: `${Date.now()}-${Math.random()}`,
                source: "widgets:archived",
              },
            ]);
            setShowError(true);
          }
        } catch (error) {
          console.error("Error loading widgets:", error);
        }
      };

      setShouldReload(false);
      fetchWidgets();

      // sets the screenreader focus to the header after mount
      const timeout = setTimeout(() => {
        const node = findNodeHandle(headerRef.current);
        if (node) {
          AccessibilityInfo.setAccessibilityFocus(node);
        }
      }, 100);

      return () => clearTimeout(timeout);
    }, [shouldReload]),
  );

  // Filter widgets based on the search query
  const filteredWidgets = useMemo(() => {
    const lowerQuery = searchQuery.toLowerCase();
    return widgets.filter((widget) =>
      widget.title.toLowerCase().includes(lowerQuery),
    );
  }, [widgets, searchQuery]);

  useEffect(() => {
    if (widgets.length === 0) {
      const timeout = setTimeout(() => {
        setShouldAnnounceEmpty(true);
      }, 500); // allow screen to settle, screenreader to be ready

      return () => clearTimeout(timeout);
    } else {
      setShouldAnnounceEmpty(false);
    }
  }, [widgets]);

  // Navigate to the page associated with the widget
  const goToPage = (widget: ArchivedWidget) => {
    const path =
      widget.page_type === PageType.Note ? "/notePage" : "/collectionPage";

    router.push({
      pathname: path,
      params: {
        pageId: widget.id,
        title: widget.title,
        routing: "goArchive",
      },
    });
  };

  // update key to force re-render when searchQuery or results change to have screenreader announce results of search
  useEffect(() => {
    setAnnounceKey((prev) => prev + 1);
  }, [searchQuery, filteredWidgets.length]);

  /**
   * Components used:
   *
   * - CustomStyledHeader: A custom header component with a title and back navigation.
   * - ThemedView: A themed view component for consistent styling.
   * - SearchBar: A search bar component for filtering widgets by title.
   * - Widget: A component representing each widget with title, label, icon, and color.
   * - EmptyHome: A component displayed when there are no archived widgets.
   * - QuickActionModal: A modal for quick actions on the selected widget (restore or delete).
   * - DeleteModal: A modal for confirming the deletion of a widget.
   * - ErrorPopup: A popup for displaying errors related to widget operations.
   * - ThemedText: A themed text component for displaying messages.
   */
  return (
    <>
      <SafeAreaView>
        <View>
          <CustomStyledHeader
            title="Archive"
            backBehavior="goSettings"
            headerRef={headerRef}
          />
        </View>
        <ThemedView>
          {widgets.length === 0 ? (
            <>
              {shouldAnnounceEmpty && (
                <ThemedText
                  accessible={true}
                  accessibilityRole="text"
                  accessibilityLiveRegion="polite"
                  style={{
                    height: 0,
                    width: 0,
                    opacity: 0,
                    position: "absolute",
                  }}
                >
                  Archive is empty
                </ThemedText>
              )}
              <EmptyHome text="Archive is empty" showButton={false} />
            </>
          ) : (
            <>
              <SearchBar
                placeholder="Search for widget title"
                onSearch={(query) => setSearchQuery(query)}
              />
              <ThemedText
                key={`announce-${announceKey}`}
                accessible={true}
                accessibilityLiveRegion="polite"
                style={{
                  position: "absolute",
                  height: 0,
                  width: 0,
                  opacity: 0,
                }}
              >
                {searchQuery
                  ? filteredWidgets.length > 0
                    ? `${filteredWidgets.length} result${filteredWidgets.length > 1 ? "s" : ""} found for ${searchQuery}`
                    : `No entries found for ${searchQuery}`
                  : ""}
              </ThemedText>

              {filteredWidgets.length > 0 ? (
                <>
                  <FlatList
                    contentContainerStyle={{ paddingBottom: 200 }} // if you want spacing at bottom
                    data={filteredWidgets}
                    keyExtractor={(item) => item.id}
                    showsVerticalScrollIndicator={false}
                    numColumns={columns}
                    columnWrapperStyle={{
                      justifyContent: "space-between",
                      marginBottom: 16,
                    }}
                    renderItem={({ item, index }) => (
                      <Widget
                        title={item.title}
                        label={item.tag}
                        icon={item.icon}
                        color={item.color as keyof typeof Colors.widget}
                        pageType={item.page_type}
                        onPress={() => {
                          goToPage(item);
                        }}
                        onLongPress={() => {
                          setSelectedWidget(item);
                          setShowModal(true);
                        }}
                        index={index + 1}
                        widgetCount={filteredWidgets.length}
                        state="archive"
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
                  {!searchQuery
                    ? "No entries found."
                    : `No entries for "${searchQuery}"`}
                </ThemedText>
              )}
            </>
          )}
        </ThemedView>
      </SafeAreaView>
      <QuickActionModal
        visible={showModal}
        onClose={() => setShowModal(false)}
        items={[
          {
            label: "Restore",
            icon: "restore",
            onPress: async () => {
              if (selectedWidget) {
                const archiveResult =
                  await generalPageService.togglePageArchive(
                    Number(selectedWidget.id),
                    selectedWidget.archived,
                  );
                if (archiveResult.success) {
                  setShouldReload(true);

                  // remove all prior errors from the archived widgets source if service call succeeded
                  setErrors((prev) =>
                    prev.filter((error) => error.source !== "archiving"),
                  );

                  AccessibilityInfo.announceForAccessibility(
                    "Successfully restored widget",
                  );
                } else {
                  // set all errors to the previous errors plus add the new error
                  // define the id and the source and set its read status to false
                  setErrors((prev) => [
                    ...prev,
                    {
                      ...archiveResult.error,
                      hasBeenRead: false,
                      id: `${Date.now()}-${Math.random()}`,
                      source: "archiving",
                    },
                  ]);
                  setShowError(true);
                  showSnackbar(
                    `Failed to move ${selectedWidget.page_type === "note" ? "Note" : "Collection"} back to Home.`,
                    "bottom",
                    "error",
                  );
                }
              }
            },
          },
          {
            label: "Delete",
            icon: "delete",
            onPress: () => {
              setShowModal(false);
              if (Platform.OS === "ios") {
                setTimeout(() => {
                  setShowDeleteModal(true);
                }, 300);
              } else {
                setShowDeleteModal(true);
              }
            },
            danger: true,
          },
        ]}
      />
      <DeleteModal
        visible={showDeleteModal}
        title={selectedWidget?.title}
        onCancel={() => setShowDeleteModal(false)}
        onConfirm={async () => {
          if (selectedWidget) {
            try {
              const widgetIdAsNumber = Number(selectedWidget.id);
              const deleteResult =
                await generalPageService.deleteGeneralPage(widgetIdAsNumber);

              if (deleteResult.success) {
                setShouldReload(true);

                // remove all prior errors from the widget delete source if service call succeeded
                setErrors((prev) =>
                  prev.filter((error) => error.source !== "widget:delete"),
                );
                AccessibilityInfo.announceForAccessibility(
                  "Successfully deleted widget",
                );
              } else {
                // set all errors to the previous errors plus add the new error
                // define the id and the source and set its read status to false
                setErrors((prev) => [
                  ...prev,
                  {
                    ...deleteResult.error,
                    hasBeenRead: false,
                    id: `${Date.now()}-${Math.random()}`,
                    source: "widget:delete",
                  },
                ]);

                setShowError(true);
                showSnackbar(
                  `Failed to delete ${selectedWidget.page_type === "note" ? "Note" : "Collection"}.`,
                  "bottom",
                  "error",
                );
              }
              setSelectedWidget(null);
              setShowDeleteModal(false);
            } catch (error) {
              console.error("Error deleting page:", error);
            }
          }
        }}
        onClose={() => setShowDeleteModal(false)}
      />

      <ErrorPopup
        visible={showError && errors.some((e) => !e.hasBeenRead)}
        errors={errors.filter((e) => !e.hasBeenRead) || []}
        onClose={(updatedErrors) => {
          const updatedIds = updatedErrors.map((e) => e.id);
          const newCombined = errors.map((e) =>
            updatedIds.includes(e.id) ? { ...e, hasBeenRead: true } : e,
          );
          setErrors(newCombined);
          setShowError(false);
        }}
      />
    </>
  );
}
