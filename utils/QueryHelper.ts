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

export { executeQuery, fetchAll, fetchFirst };
