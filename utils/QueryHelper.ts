import * as SQLite from 'expo-sqlite';

let db: SQLite.SQLiteDatabase | null = null;

const getDb = async () => {
  if (!db) {
    db = await SQLite.openDatabaseAsync('krizzle_local.db');
  }
  return db;
};

const executeQuery = async (query: string, params: any[] = []) => {
    const db = await getDb();
    return db.runAsync(query, params);
};
  
const fetchFirst = async <T>(query: string, params: any[] = []): Promise<T | null> => {
    const db = await getDb();
    try {
        const result = db.getFirstAsync<T>(query, params);
        return result;
    } catch (error) {
        console.error("Error fetching first item:", error);
        return null;
    }
};
  
export {
    executeQuery,
    fetchAll
}