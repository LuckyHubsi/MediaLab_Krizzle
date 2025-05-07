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

interface CollapsibleCardProps {
  faqTitle: string;
  faqContent: string;
  faqQuestion?: string;
}

const CollapsibleCard: React.FC<CollapsibleCardProps> = ({
  faqTitle,
  faqContent,
  faqQuestion,
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
            <ThemedText>{faqContent}</ThemedText>
          </CollapsibleCardContent>
        )}
      </CollapsibleCardContainer>
    </GradientBorder>
  );
};

export default CollapsibleCard;
