import React from "react";
import { TouchableOpacity } from "react-native";
import {
  StyledHeader,
  BackIcon,
  IconContainer,
  Icon,
  TitleContainer,
} from "./CustomStyledHeader.styles";
import { ThemedText } from "@/components/ThemedText";
import { useNavigation, useRouter } from "expo-router";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useActiveColorScheme } from "@/context/ThemeContext";
import { Colors } from "@/constants/Colors";

/**
 * Compontent for a custom styled header with various functionalities.
 * It includes a back button, title, optional subtitle, and icons for additional actions.
 * @param title (required) - The title of the header.
 * @param subtitle - Optional subtitle for the header.
 * @param iconName - Optional icon name for the first icon (left).
 * @param iconName2 - Optional icon name for the second icon (right).
 * @param onIconPress - Optional Callback function for the first icon press (left).
 * @param onIconMenuPress - Optional Callback function for the second icon press (right).
 * @param backBehavior - Optional behavior for the back button, can be "goHome", "goArchive", "goSettings", "goCollection", or "goBackWithParams".
 * @param otherBackBehavior - Optional function to execute on back press before the default behavior.
 * @param param - Optional parameter to pass when navigating to a specific route.
 * @param routing - Optional routing parameter to pass when navigating to a specific route.
 * @param leftIconName - Optional icon name for the left icon.
 * @param isTransparent - Optional boolean to determine if the header should be transparent.
 * @param borderRadiusTop - Optional number to set the top border radius of the header.
 */

interface HeaderProps {
  title: string;
  subtitle?: string;
  iconName?: keyof typeof MaterialIcons.glyphMap;
  iconName2?: keyof typeof MaterialIcons.glyphMap;
  onIconPress?: () => void;
  onIconMenuPress?: () => void;
  backBehavior?: string;
  otherBackBehavior?: () => void;
  param?: string;
  routing?: string;
  leftIconName?: keyof typeof MaterialIcons.glyphMap;
  isTransparent?: boolean;
  borderRadiusTop?: number;
  headerRef?: any;
}

export const CustomStyledHeader: React.FC<HeaderProps> = ({
  title,
  subtitle,
  iconName,
  iconName2,
  onIconPress,
  onIconMenuPress,
  backBehavior,
  otherBackBehavior,
  param,
  routing,
  leftIconName,
  isTransparent,
  borderRadiusTop,
  headerRef,
}) => {
  const router = useRouter();
  const colorScheme = useActiveColorScheme();
  const navigation = useNavigation();

  /**
   * Function to handle the back button press.
   * It executes the specified back behavior or navigates to a default route based on the backBehavior prop.
   */
  const handleBackPress = () => {
    if (otherBackBehavior) {
      otherBackBehavior();
    }

    switch (backBehavior) {
      case "goHome":
        router.replace("/");
        break;
      case "goArchive":
        router.replace("/archivePage");
        break;
      case "goSettings":
        router.replace("/settings");
        break;
      case "goCollection":
        router.replace({
          pathname: "/collectionPage",
          params: { pageId: param, routing: routing },
        });
        break;
      case "goBackWithParams":
        router.back();
        router.setParams({ lastCreatedTag: param });
        break;
      default:
        navigation.goBack();
    }
  };

  const getAccessibilityHint = () => {
    switch (backBehavior) {
      case "goHome":
        return "Goes back to the Home Page";
      case "goArchive":
        return "Goes back to the Archive Page";
      case "goSettings":
        return "Goes back to the Menu Page";
      case "goCollection":
        return "Goes back to the Collection Page";
      default:
        return "Goes back to the previous Page";
    }
  };

  return (
    <StyledHeader
      colorScheme={colorScheme}
      isTransparent={isTransparent}
      borderRadiusTop={borderRadiusTop}
    >
      <TouchableOpacity
        onPress={handleBackPress}
        accessibilityRole="button"
        accessibilityLabel={`Back. Currently on page ${title} ${subtitle ? `in list ${subtitle}` : ""}`}
        accessibilityHint={getAccessibilityHint()}
        ref={headerRef}
        style={{
          flexDirection: "row",
          alignItems: "center",
          flex: 1,
          minHeight: 48,
        }}
      >
        <BackIcon
          name="chevron-back-outline"
          colorScheme={colorScheme}
          isTransparent={isTransparent}
        />

        <TitleContainer>
          <ThemedText
            isTransparent={isTransparent}
            fontSize="xl"
            fontWeight="semibold"
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {title}
          </ThemedText>
          {subtitle ? (
            <ThemedText
              isTransparent={isTransparent}
              fontSize="s"
              fontWeight="light"
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {subtitle}
            </ThemedText>
          ) : null}
        </TitleContainer>
      </TouchableOpacity>
      {leftIconName && (
        <MaterialIcons
          name={leftIconName}
          size={24}
          color={Colors[colorScheme].text}
          style={{
            marginRight: 8,
            backgroundColor: Colors[colorScheme].searchBarBackground,
            borderRadius: 8,
            padding: 2,
          }}
          accessibilityRole="none"
          accessibilityLabel={`Widget Icon ${leftIconName}`}
          accessibilityHint="Opens a modal for actions available on this page"
        />
      )}
      {/* Optional right icon */}
      <IconContainer>
        {iconName && onIconPress && (
          <Icon
            onPress={onIconPress}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="Page Menu"
            accessibilityHint="Opens a modal for actions available on this page"
          >
            <MaterialIcons
              name={iconName}
              size={24}
              color={colorScheme === "light" ? Colors.black : Colors.white}
            />
          </Icon>
        )}
        {iconName2 && onIconMenuPress && (
          <Icon onPress={onIconMenuPress}>
            <MaterialIcons
              name={iconName2}
              size={24}
              color={
                isTransparent
                  ? Colors.white
                  : colorScheme === "light"
                    ? Colors.black
                    : Colors.white
              }
            />
          </Icon>
        )}
      </IconContainer>
    </StyledHeader>
  );
};
