import { BaseRepository } from "../interfaces/BaseRepository.interface";
import * as SQLite from "expo-sqlite";

export class BaseRepositoryImpl implements BaseRepository {
  private db: SQLite.SQLiteDatabase | null = null;

  /**
   * Initializes and retrieves the SQLite database connection.
   *
   * @returns {Promise<SQLite.SQLiteDatabase>} A promise that resolves to the SQLite database instance.
   */
  private async getDb(): Promise<SQLite.SQLiteDatabase> {
    if (!this.db) {
      this.db = await SQLite.openDatabaseAsync("krizzle_local.db");
      await this.executeQuery("PRAGMA foreign_keys = ON;");
    }
    return this.db;
  }

  /**
   * Executes an SQL query with optional parameters.
   *
   * @param {string} query - The SQL query to execute.
   * @param {any[]} [params=[]] - The parameters for the query (optional).
   * @returns {Promise<SQLite.SQLiteRunResult>} A promise that resolves when the query is executed.
   */
  async executeQuery(
    query: string,
    params: any[] = [],
    txn?: SQLite.SQLiteDatabase,
  ) {
    const db = txn ?? (await this.getDb()); // Use txn if available, otherwise normal db
    try {
      return db.runAsync(query, params);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Fetches the first result from an SQL query.
   *
   * @template T - The expected return type of the fetched data.
   * @param {string} query - The SQL query to execute.
   * @param {any[]} [params=[]] - The parameters for the query (optional).
   * @returns {Promise<T | null>} A promise that resolves to the first row of the query result, or null if no data is found.
   */
  async fetchFirst<T>(
    query: string,
    params: any[] = [],
    txn?: SQLite.SQLiteDatabase,
  ): Promise<T | null> {
    const db = txn ?? (await this.getDb());
    try {
      const result = await db.getFirstAsync<T>(query, params);
      return result;
    } catch (error) {
      console.error("Error fetching first item:", error);
      throw error;
    }
  }

  /**
   * Fetches all results from an SQL query.
   *
   * @template T - The expected return type of the fetched data.
   * @param {string} query - The SQL query to execute.
   * @param {any[]} [params=[]] - The parameters for the query (optional).
   * @returns {Promise<T[]>} A promise that resolves to an array of results, or an empty array if an error occurs.
   */
  async fetchAll<T>(
    query: string,
    params: any[] = [],
    txn?: SQLite.SQLiteDatabase,
  ): Promise<T[]> {
    const db = txn ?? (await this.getDb());
    try {
      const result = await db.getAllAsync<T>(query, params);
      return result;
    } catch (error) {
      console.error("Error fetching all items:", error);
      throw error;
    }
  }

  /**
   * Executes a function within a database transaction.
   * The transaction is automatically rolled back if an error occurs.
   *
   * @template T - The return type of the function.
   * @param {(txn: SQLite.SQLiteDatabase) => Promise<T>} fn - The function to execute within the transaction.
   * @returns {Promise<T>} A promise that resolves to the return value of the function.
   * @throws {Error} If the transaction fails and rolls back.
   *
   */
  async executeTransaction<T>(
    fn: (txn: SQLite.SQLiteDatabase) => Promise<T>,
  ): Promise<T> {
    const db = await this.getDb();
    const inTransaction: boolean = await db.isInTransactionAsync();

    if (inTransaction) {
      return fn(db);
    } else {
      return new Promise<T>((resolve, reject) => {
        db.withExclusiveTransactionAsync(async (txn) => {
          try {
            const result = await fn(txn);
            resolve(result);
          } catch (error) {
            console.error("Transaction error, rolling back:", error);
            reject(error);
            throw error;
          }
        });
      });
    }
  }

  /**
   * Gets the last inserted row ID
   *
   * @returns {Promise<number>} The ID of the last inserted row or null if not available
   *
   * @throws {DatabaseError} If the fetch fails.
   */
  async getLastInsertId(txn?: SQLite.SQLiteDatabase): Promise<number> {
    try {
      const insertedID = await this.fetchFirst<{ id: number }>(
        "SELECT last_insert_rowid() as id",
        [],
        txn,
      );
      if (insertedID) return insertedID.id;
      else throw new Error();
    } catch (error) {
      throw error;
    }
  }
}

export const baseRepository = new BaseRepositoryImpl();
