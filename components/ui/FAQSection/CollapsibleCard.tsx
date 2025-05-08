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
import { Image } from "react-native";

interface CollapsibleCardProps {
  faqTitle: string;
  faqContent: string;
  faqQuestion?: string;
  faqExampleHeading?: string;
  faqExampleImage?: string;
  imageHeight?: number;
}

const CollapsibleCard: React.FC<CollapsibleCardProps> = ({
  faqTitle,
  faqContent,
  faqQuestion,
  faqExampleHeading,
  faqExampleImage,
  imageHeight,
}) => {
  const [expanded, setExpanded] = useState(false);
  const colorScheme = useActiveColorScheme();

  return (
    <GradientBorder>
      <CollapsibleCardContainer
        colorScheme={colorScheme}
        onPress={() => setExpanded(!expanded)}
      >
        <CardHeader onPress={() => setExpanded(!expanded)}>
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
          <CollapsibleCardContent>
            <GradientTopBorder />
            <ThemedText style={{ marginBottom: 12 }}>{faqContent}</ThemedText>
            {faqExampleHeading && (
              <>
                <GradientTopBorder />
                <ThemedText
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
                style={{ width: "100%", height: imageHeight }}
              />
            )}
          </CollapsibleCardContent>
        )}
      </CollapsibleCardContainer>
    </GradientBorder>
  );
};

export default CollapsibleCard;
