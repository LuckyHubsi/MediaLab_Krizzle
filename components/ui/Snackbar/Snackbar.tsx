import React, { createContext, useContext, ReactNode } from "react";
import Toast from "react-native-toast-message";
import { ToastContainer } from "./Snackbar.styles";
import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

type SnackbarType = "success" | "error" | "info";
type SnackbarPosition = "top" | "bottom";

/**
 * Component for rendering a linkbox for the Menu page with an icon and label, which navigates to a specified route when pressed.
 *
 * @param message (required) - The text message to display in the snackbar.
 * @param position - The position of the snackbar on the screen, either "top" or "bottom".
 * @param type - The type of snackbar, which determines its style. Can be "success", "error", or "info".
 */

interface SnackbarContextType {
  showSnackbar: (
    message: string,
    position?: SnackbarPosition,
    type?: SnackbarType,
  ) => void;
}

const SnackbarContext = createContext<SnackbarContextType | undefined>(
  undefined,
);

export const useSnackbar = () => {
  const context = useContext(SnackbarContext);
  if (!context)
    throw new Error("useSnackbar must be used within a SnackbarProvider");
  return context;
};

interface Props {
  children: ReactNode;
}

export const SnackbarProvider: React.FC<Props> = ({ children }) => {
  const showSnackbar = (
    message: string,
    position: SnackbarPosition = "bottom",
    type: SnackbarType = "info",
  ) => {
    Toast.show({
      type,
      text1: message,
      position,
      visibilityTime: 3000,
    });
  };

  const toastConfig = {
    success: ({ text1 }: any) => (
      <ToastContainer background={Colors.positive}>
        <MaterialIcons name="check-circle" size={22} color={Colors.black} />
        <ThemedText style={{ flex: 1 }} colorVariant="black">
          {text1}
        </ThemedText>
      </ToastContainer>
    ),
    error: ({ text1 }: any) => (
      <ToastContainer background={Colors.negative}>
        <MaterialIcons name="error" size={22} color={Colors.black} />
        <ThemedText style={{ flex: 1 }} colorVariant="black">
          {text1}
        </ThemedText>
      </ToastContainer>
    ),
    info: ({ text1 }: any) => (
      <ToastContainer background={Colors.primary}>
        <MaterialIcons name="error" size={22} color={Colors.black} />
        <ThemedText style={{ flex: 1 }} colorVariant="black">
          {text1}
        </ThemedText>
      </ToastContainer>
    ),
  };

  return (
    <SnackbarContext.Provider value={{ showSnackbar }}>
      {children}
      <Toast config={toastConfig} />
    </SnackbarContext.Provider>
  );
};
