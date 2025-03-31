import * as SQLite from 'expo-sqlite';

let db: SQLite.SQLiteDatabase | null = null;

const getDb = async () => {
  if (!db) {
    db = await SQLite.openDatabaseAsync('krizzle_local.db');
  }
  return db;
};

