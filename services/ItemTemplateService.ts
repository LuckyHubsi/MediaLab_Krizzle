import { ItemTemplateDTO } from "@/dto/ItemTemplateDTO";
import { insertItemTemplate } from "@/queries/ItemTemplateQuery";
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
 */
const insertItemTemplateAndReturnID = async (
  itemTemplateDTO: ItemTemplateDTO,
): Promise<number | null> => {
  try {
    const templateID: number | null = await executeTransaction<number | null>(
      async () => {
        await executeQuery(insertItemTemplate, [itemTemplateDTO.template_name]);

        // get inserted page ID
        const lastInsertedID = await getLastInsertId();
        return lastInsertedID;
      },
    );

    if (templateID) {
      return templateID;
    } else {
      console.error("Failed to fetch inserted item template ID");
      return null;
    }
  } catch (error) {
    console.error("Error inserting item template:", error);
    return null;
  }
};

export { insertItemTemplateAndReturnID };
