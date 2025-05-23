import { SQLiteDatabase } from "expo-sqlite";

export const SCHEMA_VERSION = 1; // add 1 to this when adding new migrations

// migration functions to go from version n to n+1
export const migrations: {
  [version: number]: (db: SQLiteDatabase) => Promise<void>;
} = {
  1: async (db) => {},
};
