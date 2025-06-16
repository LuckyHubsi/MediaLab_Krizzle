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
              ? "Double tap to collapse the answer."
              : "Double tap to expand and read the answer."
          }
          accessibilityState={accessibilityState}
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
