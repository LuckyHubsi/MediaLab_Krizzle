import { ItemTemplateDTO } from "@/dto/ItemTemplateDTO";
import { ItemTemplateModel } from "@/models/ItemTemplateModel";
import {
  insertItemTemplate,
  selectItemTemplateByTemplateIDQuery,
} from "@/queries/ItemTemplateQuery";
import { DatabaseError } from "@/utils/DatabaseError";
import { ItemTemplateMapper } from "@/utils/mapper/ItemTemplateMapper";
import {
  executeQuery,
  executeTransaction,
  fetchFirst,
  getLastInsertId,
} from "@/utils/QueryHelper";
import * as SQLite from "expo-sqlite";

/**
 * Inserts a new item template into the database and returns its ID.
 *
 * @param {ItemTemplateDTO} itemTemplateDTO - The DTO representing the item template to insert.
 * @param {SQLite.SQLiteDatabase} [txn] - Optional SQLite transaction object when its called inside a transaction.
 * @returns {Promise<number>} A promise that resolves to the inserted item template's ID.
 * @throws {DatabaseError} If the insert fails.
 */
const insertItemTemplateAndReturnID = async (
  itemTemplateDTO: ItemTemplateDTO,
  txn?: SQLite.SQLiteDatabase,
): Promise<number> => {
  try {
    const templateID: number | null = await executeTransaction<number>(
      async () => {
        await executeQuery(
          insertItemTemplate,
          [itemTemplateDTO.template_name],
          txn,
        );

        // get inserted page ID
        const lastInsertedID = await getLastInsertId(txn);
        return lastInsertedID;
      },
    );
    return templateID;
  } catch (error) {
    throw new DatabaseError("Failed to insert item template");
  }
};

/**
 * Retrieves a template by its id.
 *
 * @param {number} templateID - The ID of the template.
 * @param {SQLite.SQLiteDatabase} [txn] - Optional SQLite transaction object when its called inside a transaction.
 * @returns {Promise<ItemTemplateDTO>} A promise that resolves to an ItemTemplateDTO.
 * @throws {DatabaseError} If the fetch fails.
 */
const getTemplate = async (
  templateID: number,
  txn?: SQLite.SQLiteDatabase,
): Promise<ItemTemplateDTO> => {
  try {
    const template = await fetchFirst<ItemTemplateModel>(
      selectItemTemplateByTemplateIDQuery,
      [templateID],
      txn,
    );
    console.log(template);
    if (template) {
      return ItemTemplateMapper.toDTO(template);
    } else {
      throw new DatabaseError("Failed to fetch template.");
    }
  } catch (error) {
    throw new DatabaseError("Failed to fetch item template");
  }
};

export { insertItemTemplateAndReturnID, getTemplate };
