import * as SQLite from "expo-sqlite";

export interface BaseRepository {
  executeQuery: (
    query: string,
    params?: any[],
  ) => Promise<SQLite.SQLiteRunResult>;

  fetchFirst: <T>(query: string, params?: any[]) => Promise<T | null>;

  fetchAll: <T>(query: string, params?: any[]) => Promise<T[]>;

  executeTransaction: <T>(
    fn: (txn: SQLite.SQLiteDatabase) => Promise<T>,
  ) => Promise<T>;

  getLastInsertId: () => Promise<number>;
}
