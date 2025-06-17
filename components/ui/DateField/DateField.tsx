import React, { FC, useState } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { format } from "date-fns";
import {
  DateFieldContainer,
  DateInputContainer,
  DateText,
  StyledPressable,
} from "./DateField.styles";
import { ThemedText } from "@/components/ThemedText";
import { useActiveColorScheme } from "@/context/ThemeContext";
import { Colors } from "@/constants/Colors";

interface DateFieldProps {
  title?: string;
  editable?: boolean;
  value?: Date | null;
  onChange?: (date: Date | null) => void;
}

const DateField: FC<DateFieldProps> = ({
  title,
  editable = true,
  value,
  onChange,
}) => {
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const showDatePicker = () => setDatePickerVisibility(true);
  const hideDatePicker = () => setDatePickerVisibility(false);

  const handleConfirm = (date: Date) => {
    onChange?.(date);
    hideDatePicker();
  };

  const colorScheme = useActiveColorScheme();

  return (
    <DateFieldContainer>
      <ThemedText
        fontWeight="regular"
        accessibilityLabel={`label ${title}`}
        nativeID={title}
      >
        {title}
      </ThemedText>

      <StyledPressable
        onPress={editable ? showDatePicker : undefined}
        style={
          editable
            ? ({ pressed }: { pressed: boolean }) => ({
                backgroundColor: pressed ? "#ddd" : "transparent",
                borderRadius: 16,
              })
            : undefined
        }
      >
        <DateInputContainer colorScheme={colorScheme}>
          <MaterialIcons
            name="calendar-today"
            size={20}
            color={colorScheme === "light" ? "#333" : "#ccc"}
            accessible={false}
          />
          <DateText
            placeholder={!value}
            colorScheme={colorScheme}
            accessible={true}
            accessibilityLabel={`Pick date for ${title}. Currently ${value ? format(value, "dd.MM.yyyy") : "no date"} picked`}
            accessibilityLabelledBy={title}
          >
            {value ? format(value, "dd.MM.yyyy") : "dd.mm.yyyy"}
          </DateText>
          {value && editable && (
            <MaterialIcons
              name="close"
              size={18}
              color={Colors[colorScheme].negative}
              onPress={() => onChange?.(null)}
              style={{ marginLeft: 8 }}
              accessible={true}
              accessibilityLabel={`Remove picked date for ${title}`}
              accessibilityRole="button"
            />
          )}
        </DateInputContainer>
      </StyledPressable>

      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      />
    </DateFieldContainer>
  );
};

export default DateField;
