import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  item: {
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    marginHorizontal: 5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "gray",
  },
  selectedItem: {
    borderColor: "blue",
    borderWidth: 2,
  },
  colorCircle: {
    width: 32,
    height: 32,
    borderRadius: 4,
    marginTop: 5,
  },
  label: {
    fontSize: 12,
    marginTop: 4,
  },
});
