import React, { createContext, useContext, ReactNode } from "react";
import Toast from "react-native-toast-message";

type SnackbarType = "success" | "error" | "info";

interface SnackbarContextType {
  showSnackbar: (message: string, type?: SnackbarType) => void;
}

const SnackbarContext = createContext<SnackbarContextType | undefined>(
  undefined,
);

export const useSnackbar = () => {
  const context = useContext(SnackbarContext);
  if (!context) {
    throw new Error("useSnackbar must be used within a SnackbarProvider");
  }
  return context;
};

interface Props {
  children: ReactNode;
}

export const SnackbarProvider: React.FC<Props> = ({ children }) => {
  const showSnackbar = (message: string, type: SnackbarType = "info") => {
    Toast.show({
      type,
      text1: message,
      position: "bottom",
      visibilityTime: 3000,
    });
  };

  return (
    <SnackbarContext.Provider value={{ showSnackbar }}>
      {children}
      <Toast />
    </SnackbarContext.Provider>
  );
};
