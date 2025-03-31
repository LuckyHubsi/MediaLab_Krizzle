import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
    position: "absolute",
    bottom: 0,
    left: 20,
    right: 20,
  },
  button: {
    flex: 1,
    paddingVertical: 16,
    alignItems: "center",
    borderRadius: 33,
  },
  discardButton: {
    backgroundColor: "red",
  },
  discardText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  nextButton: {
    backgroundColor: "#007AFF",
  },
  nextText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
