import * as SQLite from "expo-sqlite";

let db: SQLite.SQLiteDatabase | null = null;

/**
 * Initializes and retrieves the SQLite database connection.
 *
 * @returns {Promise<SQLite.SQLiteDatabase>} A promise that resolves to the SQLite database instance.
 */
const getDb = async () => {
  if (!db) {
    db = await SQLite.openDatabaseAsync("krizzle_local.db");
  }
  return db;
};

/**
 * Executes an SQL query with optional parameters.
 *
 * @param {string} query - The SQL query to execute.
 * @param {any[]} [params=[]] - The parameters for the query (optional).
 * @returns {Promise<SQLite.RunResult>} A promise that resolves when the query is executed.
 */
const executeQuery = async (query: string, params: any[] = []) => {
  const db = await getDb();
  return db.runAsync(query, params);
};

/**
 * Fetches the first result from an SQL query.
 *
 * @template T - The expected return type of the fetched data.
 * @param {string} query - The SQL query to execute.
 * @param {any[]} [params=[]] - The parameters for the query (optional).
 * @returns {Promise<T | null>} A promise that resolves to the first row of the query result, or null if no data is found.
 */
const fetchFirst = async <T>(
  query: string,
  params: any[] = [],
): Promise<T | null> => {
  const db = await getDb();
  try {
    const result = db.getFirstAsync<T>(query, params);
    return result;
  } catch (error) {
    console.error("Error fetching first item:", error);
    return null;
  }
};

/**
 * Fetches all results from an SQL query.
 *
 * @template T - The expected return type of the fetched data.
 * @param {string} query - The SQL query to execute.
 * @param {any[]} [params=[]] - The parameters for the query (optional).
 * @returns {Promise<T[]>} A promise that resolves to an array of results, or an empty array if an error occurs.
 */
const fetchAll = async <T>(query: string, params: any[] = []): Promise<T[]> => {
  const db = await getDb();
  try {
    const result = await db.getAllAsync<T>(query, params);
    return result;
  } catch (error) {
    console.error("Error fetching all items:", error);
    return [];
  }
};

/**
 * Executes a function within a database transaction.
 * The transaction is automatically rolled back if an error occurs.
 *
 * @template T - The return type of the function
 * @param {() => Promise<T>} fn - The function to execute within the transaction
 * @returns {Promise<T>} - Promise resolving to the return value of the function
 */
const executeTransaction = async <T>(fn: () => Promise<T>): Promise<T> => {
  const db = await getDb();

  try {
    // Begin transaction
    await db.runAsync("BEGIN TRANSACTION");

    // Execute the function
    const result = await fn();

    // Commit transaction
    await db.runAsync("COMMIT");

    return result;
  } catch (error) {
    // Roll back on error
    console.error("Transaction error, rolling back:", error);
    await db.runAsync("ROLLBACK");
    throw error;
  }
};

/**
 * Gets the last inserted row ID
 *
 * @returns {Promise<number | null>} The ID of the last inserted row or null if not available
 */
const getLastInsertId = async (): Promise<number | null> => {
  const result = await fetchFirst<{ id: number }>(
    "SELECT last_insert_rowid() as id",
  );
  return result?.id || null;
};

export {
  executeQuery,
  fetchAll,
  fetchFirst,
  executeTransaction,
  getLastInsertId,
};
