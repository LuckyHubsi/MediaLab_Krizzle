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

        // GENERAL PAGE
        const generalPageDataCheck = await txn.getFirstAsync<{ name: string }>(
          `SELECT name FROM sqlite_master WHERE type='table' AND name='general_page_data';`,
        );
        if (generalPageDataCheck) {
          await txn.execAsync(`
            -- step 1: backup old table by renaming
            ALTER TABLE general_page_data RENAME TO old_general_page_data;

            -- step 2: create new schema
            CREATE TABLE general_page_data (
              pageID INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
              page_type TEXT NOT NULL CHECK(page_type IN ('note', 'collection')),
              page_title TEXT NOT NULL,
              page_icon TEXT,
              page_color TEXT,
              date_created TEXT NOT NULL,
              date_modified TEXT NOT NULL,
              archived INTEGER NOT NULL DEFAULT 0 CHECK(archived IN (0, 1)),
              pinned INTEGER NOT NULL DEFAULT 0 CHECK(pinned IN (0, 1)),
              tagID INTEGER,
              parent_folderID INTEGER,
              FOREIGN KEY(parent_folderID) REFERENCES folder(folderID) ON DELETE CASCADE,
              FOREIGN KEY(tagID) REFERENCES tag(tagID) ON DELETE SET NULL
            );
            
            -- step 3: restore data (parent_folderID will be NULL for existing records)
            INSERT INTO general_page_data(pageID, page_type, page_title, page_icon, page_color, date_created, date_modified, archived, pinned, tagID, parent_folderID)
            SELECT pageID, page_type, page_title, page_icon, page_color, date_created, date_modified, archived, pinned, tagID, NULL FROM old_general_page_data;
            -- step 4: drop old tables
            DROP TABLE IF EXISTS old_general_page_data;
          `);
        }
        const pagesWithInvalidHex = [];
        const pagesWithColorBlue = await txn.getAllAsync<{ pageID: number }>(
          `SELECT pageID FROM general_page_data WHERE page_color = 'blue'`,
        );
        pagesWithInvalidHex.push(pagesWithColorBlue);

        const pagesWithColorWhite = await txn.getAllAsync<{ pageID: number }>(
          `SELECT pageID FROM general_page_data WHERE page_color = '#ffffff'`,
        );
        pagesWithInvalidHex.push(pagesWithColorWhite);

        const pagesWithColorBlack = await txn.getAllAsync<{ pageID: number }>(
          `SELECT pageID FROM general_page_data WHERE page_color = '#111111'`,
        );
        pagesWithInvalidHex.push(pagesWithColorBlack);

        const pagesWithColorLightGrey = await txn.getAllAsync<{
          pageID: number;
        }>(`SELECT pageID FROM general_page_data WHERE page_color = '#ABABAB'`);
        pagesWithInvalidHex.push(pagesWithColorLightGrey);

        for (const pageGroup of pagesWithInvalidHex) {
          for (const page of pageGroup) {
            await txn.runAsync(
              `UPDATE general_page_data SET page_color = '#4599E8' WHERE pageID = ?`,
              [page.pageID],
            );
          }
        }
        // _____________________________________________________________________

        // ATTRIBUTE
        const attributeCheck = await txn.getFirstAsync<{ name: string }>(
          `SELECT name FROM sqlite_master WHERE type='table' AND name='attribute';`,
        );
        if (attributeCheck) {
          await txn.execAsync(`
            -- step 1: backup old table by renaming
            ALTER TABLE attribute RENAME TO old_attribute;

            -- step 2: create new schema with updated type constraint
            CREATE TABLE attribute (
              attributeID INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
              item_templateID INTEGER NOT NULL,
              attribute_label TEXT NOT NULL,
              type TEXT NOT NULL CHECK(type IN ('text', 'rating', 'date', 'multi-select', 'image', 'link')),
              preview INTEGER NOT NULL DEFAULT 0 CHECK(preview IN (0, 1)),
              FOREIGN KEY(item_templateID) REFERENCES item_template(item_templateID) ON DELETE CASCADE
            );
            
            -- step 3: restore data
            INSERT INTO attribute(attributeID, item_templateID, attribute_label, type, preview)
            SELECT attributeID, item_templateID, attribute_label, type, preview FROM old_attribute;

            -- step 4: drop old tables
            DROP TABLE IF EXISTS old_attribute;
          `);
        }
        // _____________________________________________________________________

        // ITEM
        const itemCheck = await txn.getFirstAsync<{ name: string }>(
          `SELECT name FROM sqlite_master WHERE type='table' AND name='item';`,
        );
        if (itemCheck) {
          const firstCategory = await txn.getFirstAsync<{
            collection_categoryID: number;
            category_name: string;
          }>(`SELECT * FROM collection_category`);
          const items = await txn.getAllAsync<{
            itemID: number;
            pageID: number;
            categoryID: number;
          }>(`SELECT * FROM item`);
          console.log("items", items);
          await txn.execAsync(`
            DROP TABLE IF EXISTS item;

            -- step 2: create new schema with categoryID NOT NULL
            CREATE TABLE item (
              itemID INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
              pageID INTEGER NOT NULL,
              categoryID INTEGER NOT NULL,
              FOREIGN KEY(categoryID) REFERENCES collection_category(collection_categoryID) ON DELETE CASCADE,
              FOREIGN KEY(pageID) REFERENCES general_page_data(pageID) ON DELETE CASCADE
            );
          `);

          for (const item of items) {
            if (item.categoryID !== null) {
              await txn.runAsync(
                `INSERT INTO item(itemID, pageID, categoryID) VALUES (?, ?, ?)`,
                [item.itemID, item.pageID, item.categoryID],
              );
            } else {
              if (firstCategory !== null) {
                await txn.runAsync(
                  `INSERT INTO item(itemID, pageID, categoryID) VALUES (?, ?, ?)`,
                  [
                    item.itemID,
                    item.pageID,
                    firstCategory.collection_categoryID,
                  ],
                );
              }
            }
          }
        }
        // _____________________________________________________________________

        // IMAGE_VALUE
        const imageValueCheck = await txn.getFirstAsync<{ name: string }>(
          `SELECT name FROM sqlite_master WHERE type='table' AND name='image_value';`,
        );
        if (!imageValueCheck) {
          await txn.execAsync(`
            CREATE TABLE image_value (
              image_valueID INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
              itemID INTEGER NOT NULL,
              attributeID INTEGER NOT NULL,
              value TEXT,
              FOREIGN KEY(attributeID) REFERENCES attribute(attributeID) ON DELETE CASCADE,
              FOREIGN KEY(itemID) REFERENCES item(itemID) ON DELETE CASCADE
            );
          `);
        }
        // _____________________________________________________________________

        // LINK_VALUE
        const linkValueCheck = await txn.getFirstAsync<{ name: string }>(
          `SELECT name FROM sqlite_master WHERE type='table' AND name='link_value';`,
        );
        if (!linkValueCheck) {
          await txn.execAsync(`
            CREATE TABLE link_value (
              link_valueID INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
              itemID INTEGER NOT NULL,
              attributeID INTEGER NOT NULL,
              value TEXT,
              display_text TEXT,
              FOREIGN KEY(attributeID) REFERENCES attribute(attributeID) ON DELETE CASCADE,
              FOREIGN KEY(itemID) REFERENCES item(itemID) ON DELETE CASCADE
            );
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
