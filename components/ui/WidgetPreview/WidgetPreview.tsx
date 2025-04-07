import React from "react";
import { View } from "react-native";
import {
  Container,
  Row,
  PreviewText,
  IconWrapper,
  TitleText,
  TagPill,
  ContentWrapper,
} from "./WidgetPreview.styles";
import { MaterialIcons } from "@expo/vector-icons";

interface WidgetProps {
  backgroundColor: string;
  showPreviewLabel?: boolean;
  selectedIcon?: keyof typeof MaterialIcons.glyphMap;
  typeIcon: keyof typeof MaterialIcons.glyphMap; // "note" or "folder"
  title?: string;
  tag?: string;
}

export const WidgetPreview: React.FC<WidgetProps> = ({
  backgroundColor,
  showPreviewLabel = false,
  selectedIcon,
  typeIcon,
  title = "Title",
  tag,
}) => {
  return (
    <Container backgroundColor={backgroundColor}>
      <Row>
        {showPreviewLabel && <PreviewText>Preview</PreviewText>}
        <View style={{ flexDirection: "row", gap: 8 }}>
          <IconWrapper>
            {selectedIcon && (
              <MaterialIcons name={selectedIcon} size={20} color="white" />
            )}
          </IconWrapper>
          <IconWrapper>
            <MaterialIcons name={typeIcon} size={20} color="white" />
          </IconWrapper>
        </View>
      </Row>

      <ContentWrapper>
        <TitleText>{title}</TitleText>
        {tag && <TagPill>{tag}</TagPill>}
      </ContentWrapper>
    </Container>
  );
};
