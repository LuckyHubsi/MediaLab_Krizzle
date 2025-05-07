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

interface CollapsibleCardProps {
  faqTitle: string;
  faqContent: string;
}

const CollapsibleCard: React.FC<CollapsibleCardProps> = ({
  faqTitle,
  faqContent,
}) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <GradientBorder>
      <CollapsibleCardContainer>
        <CardHeader onPress={() => setExpanded(!expanded)}>
          <ThemedText fontWeight="bold">{faqTitle}</ThemedText>
          <MaterialIcons
            name={expanded ? "keyboard-arrow-up" : "keyboard-arrow-down"}
            size={20}
            color={Colors.grey50}
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
