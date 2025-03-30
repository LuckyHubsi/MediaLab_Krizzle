import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    // backgroundColor: "rgba(0, 0, 0, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: 300,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    marginTop: 300,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    alignItems: "center",
  },
  modalOption: {
    fontSize: 18,
    padding: 10,
  },
});
