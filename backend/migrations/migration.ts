import { SQLiteDatabase } from "expo-sqlite";

export const SCHEMA_VERSION = 4; // add 1 to this when adding new migrations

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
      } catch (error) {
        console.log(error);
        throw error;
      }
    });
    await db.withExclusiveTransactionAsync(async (txn) => {
      try {
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
      } catch (error) {
        console.log(error);
        throw error;
      }
    });
    await db.withExclusiveTransactionAsync(async (txn) => {
      try {
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
      } catch (error) {
        console.log(error);
        throw error;
      }
    });
    await db.withExclusiveTransactionAsync(async (txn) => {
      try {
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
      } catch (error) {
        console.log(error);
        throw error;
      }
    });
    await db.withExclusiveTransactionAsync(async (txn) => {
      try {
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
      } catch (error) {
        console.log(error);
        throw error;
      }
    });
    await db.withExclusiveTransactionAsync(async (txn) => {
      try {
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
      } catch (error) {
        console.log(error);
        throw error;
      }
    });
    await db.withExclusiveTransactionAsync(async (txn) => {
      try {
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
      } catch (error) {
        console.log(error);
        throw error;
      }
    });
    await db.withExclusiveTransactionAsync(async (txn) => {
      try {
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
      } catch (error) {
        console.log(error);
        throw error;
      }
    });
    await db.withExclusiveTransactionAsync(async (txn) => {
      try {
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
          let allNull = true;

          // options is string[] from grouped rows for the same attributeID
          for (const val of value) {
            if (val === null || val === "null") {
              continue; // track that value was null, skip processing it
            }

            allNull = false;

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

          // final value to insert: `null` if all were null, otherwise stringified array
          const finalVal = allNull ? null : JSON.stringify(mergedValues);

          await txn.runAsync(
            `INSERT INTO multiselect_values (itemID, attributeID, value) VALUES (?, ?, ?)`,
            [itemID, attributeID, finalVal],
          );
        }
        // _____________________________________________________________________
      } catch (error) {
        console.log(error);
        throw error;
      }
    });
    await db.withExclusiveTransactionAsync(async (txn) => {
      try {
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
  2: async (db) => {
    await db.withExclusiveTransactionAsync(async (txn) => {
      try {
        // disable FKs temporarily
        await txn.execAsync(`
          -- disable foreign key constraints temporarily
          PRAGMA foreign_keys = OFF;
        `);
        // _____________________________________________________________________
      } catch (error) {
        console.log(error);
        throw error;
      }
    });
    await db.withExclusiveTransactionAsync(async (txn) => {
      try {
        // NOTE
        // check if table 'note' exists - create new one if not/migrate if it does
        const noteCheck = await txn.getFirstAsync<{ name: string }>(
          `SELECT name FROM sqlite_master WHERE type='table' AND name='note';`,
        );
        if (noteCheck) {
          await txn.execAsync(`
            ALTER TABLE note RENAME TO old_note;
        
            CREATE TABLE "note" (
              "noteID"	INTEGER NOT NULL,
              "note_content"	TEXT,
              "pageID"	INTEGER NOT NULL,
              PRIMARY KEY("noteID" AUTOINCREMENT),
              FOREIGN KEY("pageID") REFERENCES "general_page_data"("pageID") ON DELETE CASCADE
            );
        
            INSERT INTO note (noteID, note_content, pageID)
            SELECT noteID, note_content, pageID FROM old_note;
        
            DROP TABLE IF EXISTS old_note;
          `);
        }
        // _____________________________________________________________________
      } catch (error) {
        console.log(error);
        throw error;
      }
    });
    await db.withExclusiveTransactionAsync(async (txn) => {
      try {
        // ITEM TEMPLATE
        // check if table 'item_template' exists - create new one if not/migrate if it does
        const item_templateCheck = await txn.getFirstAsync<{
          name: string;
        }>(
          `SELECT name FROM sqlite_master WHERE type='table' AND name='item_template';`,
        );
        if (item_templateCheck) {
          await txn.execAsync(`
            ALTER TABLE item_template RENAME TO old_item_template;
        
            CREATE TABLE "item_template" (
              "item_templateID"	INTEGER NOT NULL,
              "title"	TEXT NOT NULL,
              PRIMARY KEY("item_templateID" AUTOINCREMENT)
            );
        
            INSERT INTO item_template (item_templateID, title)
            SELECT item_templateID, title FROM old_item_template;
        
            DROP TABLE IF EXISTS old_item_template;
          `);
        }
        // _____________________________________________________________________
      } catch (error) {
        console.log(error);
        throw error;
      }
    });
    await db.withExclusiveTransactionAsync(async (txn) => {
      try {
        // COLLECTION
        // check if table 'collection' exists - create new one if not/migrate if it does
        const collectionCheck = await txn.getFirstAsync<{ name: string }>(
          `SELECT name FROM sqlite_master WHERE type='table' AND name='collection';`,
        );
        if (collectionCheck) {
          await txn.execAsync(`
            ALTER TABLE collection RENAME TO old_collection;
        
            CREATE TABLE "collection" (
              "collectionID"	INTEGER NOT NULL,
              "item_templateID"	INTEGER NOT NULL,
              "pageID"	INTEGER NOT NULL,
              PRIMARY KEY("collectionID" AUTOINCREMENT),
              FOREIGN KEY("item_templateID") REFERENCES "item_template"("item_templateID") ON DELETE CASCADE,
              FOREIGN KEY("pageID") REFERENCES "general_page_data"("pageID") ON DELETE CASCADE
            );
        
            INSERT INTO collection (collectionID, item_templateID, pageID)
            SELECT collectionID, item_templateID, pageID FROM old_collection;
        
            DROP TABLE IF EXISTS old_collection;
          `);
        }
        // _____________________________________________________________________
      } catch (error) {
        console.log(error);
        throw error;
      }
    });
    await db.withExclusiveTransactionAsync(async (txn) => {
      try {
        // COLLECTION CATEGORY
        // check if table 'collection_category' exists - create new one if not/migrate if it does
        const collection_categoryCheck = await txn.getFirstAsync<{
          name: string;
        }>(
          `SELECT name FROM sqlite_master WHERE type='table' AND name='collection_category';`,
        );
        if (collection_categoryCheck) {
          await txn.execAsync(`
            ALTER TABLE collection_category RENAME TO old_collection_category;
        
            CREATE TABLE "collection_category" (
              "collection_categoryID"	INTEGER NOT NULL,
              "collectionID"	INTEGER NOT NULL,
              "category_name"	TEXT,
              PRIMARY KEY("collection_categoryID" AUTOINCREMENT),
              FOREIGN KEY("collectionID") REFERENCES "collection"("collectionID") ON DELETE CASCADE
            );
        
            INSERT INTO collection_category (collection_categoryID, collectionID, category_name)
            SELECT collection_categoryID, collectionID, category_name FROM old_collection_category;
        
            DROP TABLE IF EXISTS old_collection_category;
          `);
        }
        // _____________________________________________________________________
      } catch (error) {
        console.log(error);
        throw error;
      }
    });
    await db.withExclusiveTransactionAsync(async (txn) => {
      try {
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
      } catch (error) {
        console.log(error);
        throw error;
      }
    });
    await db.withExclusiveTransactionAsync(async (txn) => {
      try {
        // ITEM
        // check if table 'item' exists - create new one if not/migrate if it does
        const itemCheck = await txn.getFirstAsync<{
          name: string;
        }>(
          `SELECT name FROM sqlite_master WHERE type='table' AND name='item';`,
        );
        if (itemCheck) {
          await txn.execAsync(`
            ALTER TABLE item RENAME TO old_item;
        
            CREATE TABLE "item" (
              "itemID"	INTEGER NOT NULL,
              "pageID"	INTEGER NOT NULL,
              "categoryID"	INTEGER,
              PRIMARY KEY("itemID" AUTOINCREMENT),
              FOREIGN KEY("categoryID") REFERENCES "collection_category"("collection_categoryID") ON DELETE CASCADE,
              FOREIGN KEY("pageID") REFERENCES "general_page_data"("pageID") ON DELETE CASCADE
            );
        
            INSERT INTO item (itemID, pageID, categoryID)
            SELECT itemID, pageID, categoryID FROM old_item;
        
            DROP TABLE IF EXISTS old_item;
          `);
        }
        // _____________________________________________________________________
      } catch (error) {
        console.log(error);
        throw error;
      }
    });
    await db.withExclusiveTransactionAsync(async (txn) => {
      try {
        // TEXT VALUE
        // check if table 'text_value' exists - create new one if not/migrate if it does
        const textValueCheck = await txn.getFirstAsync<{ name: string }>(
          `SELECT name FROM sqlite_master WHERE type='table' AND name='text_value';`,
        );
        if (textValueCheck) {
          await txn.execAsync(`
            ALTER TABLE text_value RENAME TO old_text_value;
        
            CREATE TABLE text_value (
              text_valueID INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
              itemID INTEGER NOT NULL,
              attributeID INTEGER NOT NULL,
              value TEXT,
              FOREIGN KEY(attributeID) REFERENCES attribute(attributeID) ON DELETE CASCADE,
              FOREIGN KEY(itemID) REFERENCES item(itemID) ON DELETE CASCADE
            );
        
            INSERT INTO text_value (text_valueID, itemID, attributeID, value)
            SELECT text_valueID, itemID, attributeID, value FROM old_text_value;
        
            DROP TABLE IF EXISTS old_text_value;
          `);
        }
        // _____________________________________________________________________
      } catch (error) {
        console.log(error);
        throw error;
      }
    });
    await db.withExclusiveTransactionAsync(async (txn) => {
      try {
        // DATE VALUE
        // check if table 'date_value' exists - create new one if not/migrate if it does
        const dateValueCheck = await txn.getFirstAsync<{ name: string }>(
          `SELECT name FROM sqlite_master WHERE type='table' AND name='date_value';`,
        );
        if (dateValueCheck) {
          await txn.execAsync(`
            ALTER TABLE date_value RENAME TO old_date_value;
        
            CREATE TABLE date_value (
              date_valueID INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
              itemID INTEGER NOT NULL,
              attributeID INTEGER NOT NULL,
              value TEXT,
              FOREIGN KEY(attributeID) REFERENCES attribute(attributeID) ON DELETE CASCADE,
              FOREIGN KEY(itemID) REFERENCES item(itemID) ON DELETE CASCADE
            );
        
            INSERT INTO date_value (date_valueID, itemID, attributeID, value)
            SELECT date_valueID, itemID, attributeID, value FROM old_date_value;
        
            DROP TABLE IF EXISTS old_date_value;
          `);
        }
        // _____________________________________________________________________
      } catch (error) {
        console.log(error);
        throw error;
      }
    });
    await db.withExclusiveTransactionAsync(async (txn) => {
      try {
        // RATING VALUE
        // check if table 'rating_value' exists - create new one if not/migrate if it does
        const ratingValueCheck = await txn.getFirstAsync<{ name: string }>(
          `SELECT name FROM sqlite_master WHERE type='table' AND name='rating_value';`,
        );
        if (ratingValueCheck) {
          await txn.execAsync(`
            ALTER TABLE rating_value RENAME TO old_rating_value;
        
            CREATE TABLE rating_value (
              rating_valueID INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
              itemID INTEGER NOT NULL,
              attributeID INTEGER NOT NULL,
              value INTEGER,
              FOREIGN KEY(attributeID) REFERENCES attribute(attributeID) ON DELETE CASCADE,
              FOREIGN KEY(itemID) REFERENCES item(itemID) ON DELETE CASCADE
            );
        
            INSERT INTO rating_value (rating_valueID, itemID, attributeID, value)
            SELECT rating_valueID, itemID, attributeID, value FROM old_rating_value;
        
            DROP TABLE IF EXISTS old_rating_value;
          `);
        }
        // _____________________________________________________________________
      } catch (error) {
        console.log(error);
        throw error;
      }
    });
    await db.withExclusiveTransactionAsync(async (txn) => {
      try {
        // RATING SYMBOL
        // check if table 'rating_symbol' exists - create new one if not/migrate if it does
        const ratingSymbolCheck = await txn.getFirstAsync<{ name: string }>(
          `SELECT name FROM sqlite_master WHERE type='table' AND name='rating_symbol';`,
        );
        if (ratingSymbolCheck) {
          await txn.execAsync(`
            ALTER TABLE rating_symbol RENAME TO old_rating_symbol;
        
            CREATE TABLE "rating_symbol" (
              "rating_symbolID"	INTEGER NOT NULL,
              "attributeID"	INTEGER NOT NULL,
              "symbol"	TEXT,
              PRIMARY KEY("rating_symbolID" AUTOINCREMENT),
              FOREIGN KEY("attributeID") REFERENCES "attribute"("attributeID") ON DELETE CASCADE
            );
        
            INSERT INTO rating_symbol (rating_symbolID, attributeID, symbol)
            SELECT rating_symbolID, attributeID, symbol FROM old_rating_symbol;
        
            DROP TABLE IF EXISTS old_rating_symbol;
          `);
        }
        // _____________________________________________________________________
      } catch (error) {
        console.log(error);
        throw error;
      }
    });
    await db.withExclusiveTransactionAsync(async (txn) => {
      try {
        // IMAGE VALUE
        // check if table 'image_value' exists - create new one if not/migrate if it does
        const imageValueCheck = await txn.getFirstAsync<{ name: string }>(
          `SELECT name FROM sqlite_master WHERE type='table' AND name='image_value';`,
        );
        if (imageValueCheck) {
          await txn.execAsync(`
            ALTER TABLE image_value RENAME TO old_image_value;
        
            CREATE TABLE image_value (
              image_valueID INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
              itemID INTEGER NOT NULL,
              attributeID INTEGER NOT NULL,
              value TEXT,
              FOREIGN KEY(attributeID) REFERENCES attribute(attributeID) ON DELETE CASCADE,
              FOREIGN KEY(itemID) REFERENCES item(itemID) ON DELETE CASCADE
            );
        
            INSERT INTO image_value (image_valueID, itemID, attributeID, value)
            SELECT image_valueID, itemID, attributeID, value FROM old_image_value;
        
            DROP TABLE IF EXISTS old_image_value;
          `);
        }
        // _____________________________________________________________________
      } catch (error) {
        console.log(error);
        throw error;
      }
    });
    await db.withExclusiveTransactionAsync(async (txn) => {
      try {
        // LINK VALUE
        // check if table 'link_value' exists - create new one if not/migrate if it does
        const linkValueCheck = await txn.getFirstAsync<{ name: string }>(
          `SELECT name FROM sqlite_master WHERE type='table' AND name='link_value';`,
        );
        if (linkValueCheck) {
          await txn.execAsync(`
            ALTER TABLE link_value RENAME TO old_link_value;
        
            CREATE TABLE link_value (
              link_valueID INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
              itemID INTEGER NOT NULL,
              attributeID INTEGER NOT NULL,
              value TEXT,
              display_text TEXT,
              FOREIGN KEY(attributeID) REFERENCES attribute(attributeID) ON DELETE CASCADE,
              FOREIGN KEY(itemID) REFERENCES item(itemID) ON DELETE CASCADE
            );
        
            INSERT INTO link_value (link_valueID, itemID, attributeID, value, display_text)
            SELECT link_valueID, itemID, attributeID, value, display_text FROM old_link_value;
        
            DROP TABLE IF EXISTS old_link_value;
          `);
        }
        // _____________________________________________________________________
      } catch (error) {
        console.log(error);
        throw error;
      }
    });
    await db.withExclusiveTransactionAsync(async (txn) => {
      try {
        // MULTISELECT VALUES
        // check if table 'multiselect_values' exists - create new one if not/migrate if it does
        const multiselectValueCheck = await txn.getFirstAsync<{ name: string }>(
          `SELECT name FROM sqlite_master WHERE type='table' AND name='multiselect_values';`,
        );
        if (multiselectValueCheck) {
          await txn.execAsync(`
            ALTER TABLE multiselect_values RENAME TO old_multiselect_values;
        
            CREATE TABLE "multiselect_values" (
              "multiselect_valueID"	INTEGER NOT NULL,
              "itemID"	INTEGER NOT NULL,
              "attributeID"	INTEGER NOT NULL,
              "value"	TEXT,
              PRIMARY KEY("multiselect_valueID" AUTOINCREMENT),
              FOREIGN KEY("attributeID") REFERENCES "attribute"("attributeID") ON DELETE CASCADE,
              FOREIGN KEY("itemID") REFERENCES "item"("itemID") ON DELETE CASCADE
            );
        
            INSERT INTO multiselect_values (multiselect_valueID, itemID, attributeID, value)
            SELECT multiselect_valueID, itemID, attributeID, value FROM old_multiselect_values;
        
            DROP TABLE IF EXISTS old_multiselect_values;
          `);
        }
        // _____________________________________________________________________
      } catch (error) {
        console.log(error);
        throw error;
      }
    });
    await db.withExclusiveTransactionAsync(async (txn) => {
      try {
        // MULTISELECT OPTION
        // check if table 'multiselect_options' exists - create new one if not/migrate if it does
        const multiselectOptionCheck = await txn.getFirstAsync<{
          name: string;
        }>(
          `SELECT name FROM sqlite_master WHERE type='table' AND name='multiselect_options';`,
        );
        if (multiselectOptionCheck) {
          await txn.execAsync(`
            ALTER TABLE multiselect_options RENAME TO old_multiselect_options;
        
            CREATE TABLE "multiselect_options" (
              "multiselectID"	INTEGER NOT NULL,
              "attributeID"	INTEGER NOT NULL,
              "options"	TEXT NOT NULL,
              PRIMARY KEY("multiselectID" AUTOINCREMENT),
              FOREIGN KEY("attributeID") REFERENCES "attribute"("attributeID") ON DELETE CASCADE
            );
        
            INSERT INTO multiselect_options (multiselectID, attributeID, options)
            SELECT multiselectID, attributeID, options FROM old_multiselect_options;
        
            DROP TABLE IF EXISTS old_multiselect_options;
          `);
        }
        // _____________________________________________________________________
      } catch (error) {
        console.log(error);
        throw error;
      }
    });
    await db.withExclusiveTransactionAsync(async (txn) => {
      try {
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
  3: async (db) => {
    await db.withExclusiveTransactionAsync(async (txn) => {
      try {
        // disable FKs temporarily
        await txn.execAsync(`
          -- disable foreign key constraints temporarily
          PRAGMA foreign_keys = OFF;
        `);
        // _____________________________________________________________________
      } catch (error) {
        console.log(error);
        throw error;
      }
    });
    await db.withExclusiveTransactionAsync(async (txn) => {
      try {
        // GENERAL PAGE
        // color changes
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

        const pagesWithColorLightBlue = await txn.getAllAsync<{
          pageID: number;
        }>(`SELECT pageID FROM general_page_data WHERE page_color = '#7DB5EA'`);
        pagesWithInvalidHex.push(pagesWithColorLightBlue);

        const pagesWithColorBlueGrey = await txn.getAllAsync<{
          pageID: number;
        }>(`SELECT pageID FROM general_page_data WHERE page_color = '#82A9CC'`);
        pagesWithInvalidHex.push(pagesWithColorBlueGrey);

        const pagesWithColorDefaultBlue = await txn.getAllAsync<{
          pageID: number;
        }>(`SELECT pageID FROM general_page_data WHERE page_color = '#4599E8'`);
        pagesWithInvalidHex.push(pagesWithColorDefaultBlue);

        for (const pageGroup of pagesWithInvalidHex) {
          for (const page of pageGroup) {
            await txn.runAsync(
              `UPDATE general_page_data SET page_color = '#176BBA' WHERE pageID = ?`,
              [page.pageID],
            );
          }
        }

        const pagesWithInvalidColorDarkBlue = [];
        const pagesWithColorDarkBlue = await txn.getAllAsync<{
          pageID: number;
        }>(`SELECT pageID FROM general_page_data WHERE page_color = '#1D7ED7'`);
        pagesWithInvalidColorDarkBlue.push(pagesWithColorDarkBlue);

        for (const pageGroup of pagesWithInvalidColorDarkBlue) {
          for (const page of pageGroup) {
            await txn.runAsync(
              `UPDATE general_page_data SET page_color = '#26418F' WHERE pageID = ?`,
              [page.pageID],
            );
          }
        }

        const pagesWithInvalidColorViolet = [];
        const pagesWithColorViolet = await txn.getAllAsync<{
          pageID: number;
        }>(`SELECT pageID FROM general_page_data WHERE page_color = '#8559ED'`);
        pagesWithInvalidColorViolet.push(pagesWithColorViolet);

        for (const pageGroup of pagesWithInvalidColorViolet) {
          for (const page of pageGroup) {
            await txn.runAsync(
              `UPDATE general_page_data SET page_color = '#764dd7' WHERE pageID = ?`,
              [page.pageID],
            );
          }
        }

        const pagesWithInvalidColorRose = [];
        const pagesWithColorRose = await txn.getAllAsync<{
          pageID: number;
        }>(`SELECT pageID FROM general_page_data WHERE page_color = '#ED59C8'`);
        pagesWithInvalidColorRose.push(pagesWithColorRose);

        for (const pageGroup of pagesWithInvalidColorRose) {
          for (const page of pageGroup) {
            await txn.runAsync(
              `UPDATE general_page_data SET page_color = '#D50B77' WHERE pageID = ?`,
              [page.pageID],
            );
          }
        }

        const pagesWithInvalidColorDarkRed = [];
        const pagesWithColorDarkRed = await txn.getAllAsync<{
          pageID: number;
        }>(`SELECT pageID FROM general_page_data WHERE page_color = '#E71341'`);
        pagesWithInvalidColorDarkRed.push(pagesWithColorDarkRed);

        for (const pageGroup of pagesWithInvalidColorDarkRed) {
          for (const page of pageGroup) {
            await txn.runAsync(
              `UPDATE general_page_data SET page_color = '#D4113B' WHERE pageID = ?`,
              [page.pageID],
            );
          }
        }

        const pagesWithInvalidColorRed = [];
        const pagesWithColorRed = await txn.getAllAsync<{
          pageID: number;
        }>(`SELECT pageID FROM general_page_data WHERE page_color = '#FF5667'`);
        pagesWithInvalidColorRed.push(pagesWithColorRed);

        for (const pageGroup of pagesWithInvalidColorRed) {
          for (const page of pageGroup) {
            await txn.runAsync(
              `UPDATE general_page_data SET page_color = '#E60F24' WHERE pageID = ?`,
              [page.pageID],
            );
          }
        }

        const pagesWithInvalidColorSage = [];
        const pagesWithColorSage = await txn.getAllAsync<{
          pageID: number;
        }>(`SELECT pageID FROM general_page_data WHERE page_color = '#49976B'`);
        pagesWithInvalidColorSage.push(pagesWithColorSage);

        for (const pageGroup of pagesWithInvalidColorSage) {
          for (const page of pageGroup) {
            await txn.runAsync(
              `UPDATE general_page_data SET page_color = '#3F835C' WHERE pageID = ?`,
              [page.pageID],
            );
          }
        }

        const pagesWithInvalidColorGradientPink = [];
        const pagesWithColorGradientPink = await txn.getAllAsync<{
          pageID: number;
        }>(
          `SELECT pageID FROM general_page_data WHERE page_color = '["#F46D6F", "#B81CA3"]'`,
        );
        pagesWithInvalidColorGradientPink.push(pagesWithColorGradientPink);

        for (const pageGroup of pagesWithInvalidColorGradientPink) {
          for (const page of pageGroup) {
            await txn.runAsync(
              `UPDATE general_page_data SET page_color = '["#B81CA3", "#F46D6F"]' WHERE pageID = ?`,
              [page.pageID],
            );
          }
        }

        const pagesWithInvalidColorGradientBlue = [];
        const pagesWithColorGradientBlue = await txn.getAllAsync<{
          pageID: number;
        }>(
          `SELECT pageID FROM general_page_data WHERE page_color = '"#583FE7"'`,
        );
        pagesWithInvalidColorGradientBlue.push(pagesWithColorGradientBlue);

        for (const pageGroup of pagesWithInvalidColorGradientBlue) {
          for (const page of pageGroup) {
            await txn.runAsync(
              `UPDATE general_page_data SET page_color = '["#583FE7", "#5BA6EC"]' WHERE pageID = ?`,
              [page.pageID],
            );
          }
        }

        const allPages = await txn.getAllAsync<{
          pageID: number;
          page_color: string;
        }>(`SELECT pageID, page_color FROM general_page_data`);

        const gradientRedPages = allPages.filter((page) =>
          page.page_color.includes("#FA995D"),
        );

        for (const page of gradientRedPages) {
          await txn.runAsync(
            `UPDATE general_page_data SET page_color = ? WHERE pageID = ?`,
            ["#E92529", page.pageID],
          );
        }

        const gradientGreenPages = allPages.filter((page) =>
          page.page_color.includes("#1CA870"),
        );

        for (const page of gradientGreenPages) {
          await txn.runAsync(
            `UPDATE general_page_data SET page_color = ? WHERE pageID = ?`,
            ["#157E54", page.pageID],
          );
        }
        // _____________________________________________________________________
      } catch (error) {
        console.log(error);
        throw error;
      }
    });
    await db.withExclusiveTransactionAsync(async (txn) => {
      try {
        // IMAGE VALUE
        // check if table 'image_value' exists - create new one if not/migrate if it does
        const imageValueCheck = await txn.getFirstAsync<{ name: string }>(
          `SELECT name FROM sqlite_master WHERE type='table' AND name='image_value';`,
        );
        if (imageValueCheck) {
          await txn.execAsync(`
            ALTER TABLE image_value RENAME TO old_image_value;

            CREATE TABLE image_value (
              image_valueID INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
              itemID INTEGER NOT NULL,
              attributeID INTEGER NOT NULL,
              value TEXT,
              alt_text TEXT,
              FOREIGN KEY(attributeID) REFERENCES attribute(attributeID) ON DELETE CASCADE,
              FOREIGN KEY(itemID) REFERENCES item(itemID) ON DELETE CASCADE
            );

            INSERT INTO image_value (image_valueID, itemID, attributeID, value, alt_text)
            SELECT image_valueID, itemID, attributeID, value, NULL FROM old_image_value;

            DROP TABLE IF EXISTS old_image_value;
          `);
        }
        // _____________________________________________________________________
      } catch (error) {
        console.log(error);
        throw error;
      }
    });
    await db.withExclusiveTransactionAsync(async (txn) => {
      try {
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
  4: async (db) => {
    // REDO THE IMAGE_VALUE BCS THE DB IN ASSETS WAS MISSING THE ALT_TEXT COLUMN
    await db.withExclusiveTransactionAsync(async (txn) => {
      try {
        // disable FKs temporarily
        await txn.execAsync(`
          -- disable foreign key constraints temporarily
          PRAGMA foreign_keys = OFF;
        `);
        // _____________________________________________________________________
      } catch (error) {
        console.log(error);
        throw error;
      }
    });
    await db.withExclusiveTransactionAsync(async (txn) => {
      try {
        // IMAGE VALUE
        // check if table 'image_value' exists - create new one if not/migrate if it does
        const imageValueCheck = await txn.getFirstAsync<{ name: string }>(
          `SELECT name FROM sqlite_master WHERE type='table' AND name='image_value';`,
        );
        if (imageValueCheck) {
          await txn.execAsync(`
            ALTER TABLE image_value RENAME TO old_image_value;

            CREATE TABLE image_value (
              image_valueID INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
              itemID INTEGER NOT NULL,
              attributeID INTEGER NOT NULL,
              value TEXT,
              alt_text TEXT,
              FOREIGN KEY(attributeID) REFERENCES attribute(attributeID) ON DELETE CASCADE,
              FOREIGN KEY(itemID) REFERENCES item(itemID) ON DELETE CASCADE
            );

            INSERT INTO image_value (image_valueID, itemID, attributeID, value, alt_text)
            SELECT image_valueID, itemID, attributeID, value, NULL FROM old_image_value;

            DROP TABLE IF EXISTS old_image_value;
          `);
        }
        // _____________________________________________________________________
      } catch (error) {
        console.log(error);
        throw error;
      }
    });
    await db.withExclusiveTransactionAsync(async (txn) => {
      try {
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
