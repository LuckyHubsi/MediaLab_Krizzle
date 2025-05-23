import { SQLiteDatabase } from "expo-sqlite";

export const SCHEMA_VERSION = 1; // add 1 to this when adding new migrations

// migration functions to go from version n to n+1
export const migrations: {
  [version: number]: (db: SQLiteDatabase) => Promise<void>;
} = {
  1: async (db) => {
    await db.withExclusiveTransactionAsync(async (txn) => {
      try {
        // disable FKs temporarily
        await txn.execAsync(`
          -- disable foreign key constraints temporarily
          PRAGMA foreign_keys = OFF;
        `);
        // _____________________________________________________________________

        // FOLDER
        // check if table 'folder' exists - create new one if not/migrate if it does
        const folderCheck = await txn.getFirstAsync<{ name: string }>(
          `SELECT name FROM sqlite_master WHERE type='table' AND name='folder';`,
        );
        if (!folderCheck) {
          await txn.execAsync(`
            CREATE TABLE folder (
              folderID INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
              folder_name TEXT NOT NULL
            );
          `);
        } else {
          await txn.execAsync(`
            -- step 1: backup old table by renaming
            ALTER TABLE folder RENAME TO old_folder;

            -- step 2: create new schema
            CREATE TABLE folder (
              folderID INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
              folder_name TEXT NOT NULL
            );
            
            -- step 3: restore data
            INSERT INTO folder(folderID, folder_name)
            SELECT folderID, folder_name FROM old_folder;

            -- step 4: drop old tables
            DROP TABLE IF EXISTS old_folder;
          `);
        }
        // _____________________________________________________________________

        // TAG
        // check if table 'tag' exists - create new one if not/migrate if it does
        const tagTableCheck = await txn.getFirstAsync<{ name: string }>(
          `SELECT name FROM sqlite_master WHERE type='table' AND name='tag';`,
        );
        if (!tagTableCheck) {
          await txn.execAsync(`
            CREATE TABLE tag (
              tagID INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
              tag_label TEXT NOT NULL
            )
          `);
        } else {
          await txn.execAsync(`
            -- step 1: backup old table by renaming
            ALTER TABLE tag RENAME TO old_tag;

            -- step 2: create new schema
            CREATE TABLE tag (
              tagID INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
              tag_label TEXT NOT NULL
            );
            
            -- step 3: restore data
            INSERT INTO tag(tagID, tag_label)
            SELECT tagID, tag_label FROM old_tag;

            -- step 4: drop old tables
            DROP TABLE IF EXISTS old_tag;
            `);
        }
        // _____________________________________________________________________

        // MULTISELECT OPTIONS & VALUES
        // load and put the options in a Record
        const fetchedMultiOptions = await txn.getAllAsync<{
          attributeID: number;
          options: string;
        }>(`SELECT * FROM multiselect_options;`);

        const groupedOptions: Record<number, string[]> = {};
        for (const row of fetchedMultiOptions) {
          const { attributeID, options } = row;
          if (!groupedOptions[attributeID]) groupedOptions[attributeID] = [];
          groupedOptions[attributeID].push(options);
        }

        // load and put the values in a Record
        const fetchedMultiValues = await txn.getAllAsync<{
          itemID: number;
          attributeID: number;
          value: string;
        }>(`SELECT * FROM multiselect_values;`);

        const groupedValues: Record<string, string[]> = {};
        for (const row of fetchedMultiValues) {
          const key = `${row.itemID}:${row.attributeID}`;
          if (!groupedValues[key]) groupedValues[key] = [];
          groupedValues[key].push(row.value);
        }

        // drop the old tables
        await txn.execAsync(`
          DROP TABLE IF EXISTS multiselect_options;
          DROP TABLE IF EXISTS multiselect_values;
        `);

        // recreate new tables
        await txn.execAsync(`
          CREATE TABLE multiselect_options (
            multiselectID INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
            attributeID INTEGER NOT NULL,
            options TEXT NOT NULL,
            FOREIGN KEY(attributeID) REFERENCES attribute(attributeID) ON DELETE CASCADE
          );
          CREATE TABLE multiselect_values (
            multiselect_valueID INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
            itemID INTEGER NOT NULL,
            attributeID INTEGER NOT NULL,
            value TEXT,
            FOREIGN KEY(attributeID) REFERENCES attribute(attributeID) ON DELETE CASCADE,
            FOREIGN KEY(itemID) REFERENCES item(itemID) ON DELETE CASCADE
          );
        `);

        // insert transformed options
        for (const [attributeID, options] of Object.entries(groupedOptions)) {
          let mergedOptions: string[] = [];

          // options is string[] from grouped rows for the same attributeID
          for (const opt of options) {
            try {
              const parsed = JSON.parse(opt);

              if (Array.isArray(parsed)) {
                // if parsed is already array, merge it
                mergedOptions = mergedOptions.concat(parsed);
              } else if (typeof parsed === "string") {
                // if parsed is a single string, push it
                mergedOptions.push(parsed);
              } else {
                // fallback: push stringified version
                mergedOptions.push(opt);
              }
            } catch {
              // if JSON.parse fails, opt is plain string, push as single item
              mergedOptions.push(opt);
            }
          }

          // remove duplicates if needed
          mergedOptions = Array.from(new Set(mergedOptions));

          // stringify the merged options array
          const newOpt = JSON.stringify(mergedOptions);

          await txn.runAsync(
            `INSERT INTO multiselect_options (attributeID, options) VALUES (?, ?)`,
            [Number(attributeID), newOpt],
          );
        }

        // insert transformed values
        for (const [key, value] of Object.entries(groupedValues)) {
          const [itemIDStr, attributeIDStr] = key.split(":");
          const itemID = Number(itemIDStr);
          const attributeID = Number(attributeIDStr);

          let mergedValues: string[] = [];

          // options is string[] from grouped rows for the same attributeID
          for (const val of value) {
            try {
              const parsed = JSON.parse(val);

              if (Array.isArray(parsed)) {
                // if parsed is already array, merge it
                mergedValues = mergedValues.concat(parsed);
              } else if (typeof parsed === "string") {
                // if parsed is a single string, push it
                mergedValues.push(parsed);
              } else {
                // fallback: push stringified version
                mergedValues.push(val);
              }
            } catch {
              // if JSON.parse fails, opt is plain string, push as single item
              mergedValues.push(val);
            }
          }

          // remove duplicates if needed
          mergedValues = Array.from(new Set(mergedValues));

          // stringify the merged values array
          const newVal = JSON.stringify(mergedValues);

          await txn.runAsync(
            `INSERT INTO multiselect_values (itemID, attributeID, value) VALUES (?, ?, ?)`,
            [itemID, attributeID, newVal],
          );
        }
        // _____________________________________________________________________

        // reenable FKs
        await txn.execAsync(`
          PRAGMA foreign_keys = ON;
          `);
      } catch (error) {
        console.log(error);
        throw error;
      }
    });
  },
};
