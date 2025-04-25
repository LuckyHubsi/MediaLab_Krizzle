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
import { useColorScheme } from "@/hooks/useColorScheme";

interface DateFieldProps {
  title?: string;
  editable?: boolean;
}

const DateField: FC<DateFieldProps> = ({ title, editable = true }) => {
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const showDatePicker = () => setDatePickerVisibility(true);
  const hideDatePicker = () => setDatePickerVisibility(false);

  const handleConfirm = (date: Date) => {
    setSelectedDate(date);
    hideDatePicker();
  };

  const colorScheme = useColorScheme();

  return (
    <DateFieldContainer>
      <ThemedText fontWeight="regular">{title}</ThemedText>

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
          />
          <DateText placeholder={!selectedDate} colorScheme={colorScheme}>
            {selectedDate ? format(selectedDate, "dd.MM.yyyy") : "dd.mm.yyyy"}
          </DateText>
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
