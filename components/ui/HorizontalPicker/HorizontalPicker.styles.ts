import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  item: {
    padding: 0,
    marginRight: 14,
    borderRadius: 33,
    borderWidth: 2,
    borderColor: "white",
  },
  selectedItem: {
    borderColor: "blue",
    borderWidth: 2,
    borderRadius: 33,
  },
  colorCircle: {
    width: 29,
    height: 29,
    borderRadius: 29,
  },
  label: {
    fontSize: 12,
    marginTop: 4,
  },
});
