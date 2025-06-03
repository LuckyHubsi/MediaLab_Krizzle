import * as FileSystem from "expo-file-system";
import { Alert } from "react-native";
import { reloadAsync } from "expo-updates";
import { failure, Result, success } from "@/shared/result/Result";
import { ServiceErrorType } from "@/shared/error/ServiceError";
import { ResetErrorMessages } from "@/shared/error/ErrorMessages";

const DB_NAME = "krizzle_local.db";
const DB_PATH = `${FileSystem.documentDirectory}SQLite/${DB_NAME}`;

/**
 * Resets the local SQLite database by deleting the database file and reloading the app. For development purposes only.
 *
 * @returns {Promise<Result<boolean, ServiceErrorType>>} A promise that resolves to a result either containing true if the
 * database reset process is complete or a ServiceTypeError if it fails.
 */
export async function resetDatabase(): Promise<
  Result<boolean, ServiceErrorType>
> {
  try {
    // check if database file exists
    const dbInfo = await FileSystem.getInfoAsync(DB_PATH);
    if (dbInfo.exists) {
      // delete database file
      await FileSystem.deleteAsync(DB_PATH);

      // reload app to reinitialize database
      await reloadAsync();
    } else {
      return failure({
        type: "Data Error",
        message: ResetErrorMessages.fail,
      });
    }

    return success(true);
  } catch (error) {
    console.error("Error resetting database:", error);
    return failure({
      type: "Data Error",
      message: ResetErrorMessages.fail,
    });
  }
}
