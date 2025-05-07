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
import CollapsibleCard from "./CollapsibleCard";

const FAQSection = () => {
  return (
    <CollapsibleCard
      faqTitle="Frequently Asked Questions"
      faqContent="Here are some common questions and answers to help you get started."
    />
  );
};

export default FAQSection;
