import * as FileSystem from "expo-file-system";
import { Alert } from "react-native";
import { reloadAsync } from "expo-updates";

const DB_NAME = "krizzle_local.db";
const DB_PATH = `${FileSystem.documentDirectory}SQLite/${DB_NAME}`;

/**
 * Resets the local SQLite database by deleting the database file and reloading the app. For development purposes only.
 *
 * @returns {Promise<void>} A promise that resolves when the database reset process is complete.
 */
export async function resetDatabase() {
  try {
    // check if database file exists
    const dbInfo = await FileSystem.getInfoAsync(DB_PATH);
    if (dbInfo.exists) {
      // delete database file
      await FileSystem.deleteAsync(DB_PATH);
      Alert.alert(
        "Database Reset",
        "The database has been reset. Restarting the app...",
      );

      // reload app to reinitialize database
      await reloadAsync();
    } else {
      Alert.alert("Database Not Found", "The database file does not exist.");
    }
  } catch (error) {
    console.error("Error resetting database:", error);
    Alert.alert("Error", "Failed to reset the database.");
  }
}
