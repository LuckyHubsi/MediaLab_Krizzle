import { ThemedText } from "@/components/ThemedText";
import { useState } from "react";
import {
  CollapsibleCardContainer,
  CardHeader,
  CollapsibleCardContent,
  GradientBorder,
  GradientTopBorder,
} from "./FAQSection.styles";
import { Colors } from "@/constants/Colors";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useActiveColorScheme } from "@/context/ThemeContext";
import { Image, View, AccessibilityState } from "react-native";

/**
 * Component for displaying a collapsible FAQ card.
 * It includes a question, answer, and optional example image.
 * @param faqTitle (required) - The title of the FAQ.
 * @param faqContent (required) - The content of the FAQ answer.
 * @param faqQuestion - Optional question text to display before the title.
 * @param faqExampleHeading - Optional heading for the example section.
 * @param faqExampleImage - Optional image to display as an example.
 * @param imageHeight - Optional height for the example image.
 */

interface CollapsibleCardProps {
  faqTitle: string;
  faqContent: string;
  faqQuestion?: string;
  faqExampleHeading?: string;
  faqExampleImage?: string;
  faqExampleImageAlt?: string;
  imageHeight?: number;
  itemNumber: number;
}

const CollapsibleCard: React.FC<CollapsibleCardProps> = ({
  faqTitle,
  faqContent,
  faqQuestion,
  faqExampleHeading,
  faqExampleImage,
  faqExampleImageAlt,
  imageHeight,
  itemNumber,
}) => {
  const [expanded, setExpanded] = useState(false);
  const colorScheme = useActiveColorScheme();

  // for screenreader compatibility
  const accessibilityState: AccessibilityState = { expanded };
  const numberofQuestions = 8; // change the number when adding a new FAQ card

  return (
    <GradientBorder>
      <CollapsibleCardContainer
        colorScheme={colorScheme}
        onPress={() => setExpanded(!expanded)}
      >
        <CardHeader
          onPress={() => setExpanded(!expanded)}
          accessibilityRole="button"
          accessibilityLabel={`Question ${itemNumber} out of ${numberofQuestions}: ${faqQuestion} ${faqTitle}`}
          accessibilityHint={
            expanded
              ? "Activate to collapse the answer."
              : "Activate to expand and read the answer."
          }
          accessibilityState={accessibilityState}
          style={{ minHeight: 48 }}
        >
          <ThemedText fontWeight="bold">
            {faqQuestion}
            <ThemedText colorVariant="primary" fontWeight="bold">
              {faqTitle}
            </ThemedText>
            ?
          </ThemedText>
          <MaterialIcons
            name={expanded ? "keyboard-arrow-up" : "keyboard-arrow-down"}
            size={20}
            color={colorScheme === "light" ? Colors.grey100 : Colors.grey50}
          />
        </CardHeader>

        {expanded && (
          <CollapsibleCardContent accessible={true}>
            <GradientTopBorder />
            <ThemedText style={{ marginBottom: 12 }}>{faqContent}</ThemedText>

            {faqExampleHeading && (
              <>
                <GradientTopBorder />
                <ThemedText
                  accessible={true}
                  accessibilityRole="header"
                  accessibilityLabel={`Section for ${faqExampleHeading}`}
                  fontWeight="bold"
                  style={{
                    textAlign: "center",
                    marginBottom: faqExampleImage ? 12 : 0,
                  }}
                >
                  {faqExampleHeading}
                </ThemedText>
              </>
            )}
            {faqExampleImage && (
              <Image
                source={faqExampleImage as any}
                style={{
                  width: "100%",
                  height: imageHeight,
                  resizeMode: "contain",
                }}
                accessibilityRole="image"
                accessibilityLabel={`Example Illustration`}
                accessibilityHint={
                  `Depicts ${faqExampleImageAlt}` || "Example image"
                }
              />
            )}
          </CollapsibleCardContent>
        )}
      </CollapsibleCardContainer>
    </GradientBorder>
  );
};

export default CollapsibleCard;
