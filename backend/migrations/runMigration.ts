import { SQLiteDatabase } from "expo-sqlite";
import { SCHEMA_VERSION, migrations } from "./migration";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SCHEMA_KEY = "DB_SCHEMA_VERSION";

/**
 * Runs pending database migrations in order based on stored schema version.
 */
export const runMigrations = async (db: SQLiteDatabase): Promise<void> => {
  const currentVersion = await getStoredSchemaVersion();

  for (let version = currentVersion + 1; version <= SCHEMA_VERSION; version++) {
    const migrate = migrations[version];
    if (migrate) {
      console.log(`Running migration for version ${version}`);
      await migrate(db);
    }
  }
  // await setStoredSchemaVersion(0); // use this to reset the schema for testing
  await setStoredSchemaVersion(SCHEMA_VERSION);
};

/**
 * Retrieves the current version of the DB schema in AsyncStorage.
 */
export const getStoredSchemaVersion = async (): Promise<number> => {
  const version = await AsyncStorage.getItem(SCHEMA_KEY);
  return version ? parseInt(version, 10) : 0;
};

/**
 * Sets the current version of the DB schema in AsyncStorage.
 */
export const setStoredSchemaVersion = async (
  version: number,
): Promise<void> => {
  await AsyncStorage.setItem(SCHEMA_KEY, version.toString());
};
