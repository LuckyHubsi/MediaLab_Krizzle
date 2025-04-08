import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import styles from "./BottomButtons.styles";

interface BottomButtonsProps {
  titleLeftButton: string;
  titleRightButton: string;
  onDiscard: () => void;
  onNext: () => void;
}

const BottomButtons: React.FC<BottomButtonsProps> = ({
  titleLeftButton,
  titleRightButton,
  onDiscard,
  onNext,
}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.button, styles.discardButton]}
        onPress={onDiscard}
      >
        <Text style={styles.discardText}>{titleLeftButton}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.nextButton]}
        onPress={onNext}
      >
        <Text style={styles.nextText}>{titleRightButton}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default BottomButtons;
