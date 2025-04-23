import { ItemTemplateDTO } from "@/dto/ItemTemplateDTO";
import { insertItemTemplate } from "@/queries/ItemTemplateQuery";
import { DatabaseError } from "@/utils/DatabaseError";
import {
  executeQuery,
  executeTransaction,
  getLastInsertId,
} from "@/utils/QueryHelper";

/**
 * Inserts a new item template into the database and returns its ID.
 *
 * @param {ItemTemplateDTO} itemTemplateDTO - The DTO representing the item template to insert.
 * @returns {Promise<number | null>} A promise that resolves to the inserted item template's ID, or null if the insertion fails.
 *
 * @throws {DatabaseError} If the insert fails.
 */
const insertItemTemplateAndReturnID = async (
  itemTemplateDTO: ItemTemplateDTO,
): Promise<number> => {
  try {
    const templateID: number | null = await executeTransaction<number>(
      async () => {
        await executeQuery(insertItemTemplate, [itemTemplateDTO.template_name]);

        // get inserted page ID
        const lastInsertedID = await getLastInsertId();
        return lastInsertedID;
      },
    );
    return templateID;
  } catch (error) {
    throw new DatabaseError("Failed to insert item template");
  }
};

export { insertItemTemplateAndReturnID };
