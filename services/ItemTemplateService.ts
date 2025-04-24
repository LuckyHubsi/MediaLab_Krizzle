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

const getTemplate = async (templateID: number) => {
  try {
    const template = await fetchFirst<any>(
      selectItemTemplateByTemplateIDQuery,
      [templateID],
    );
    console.log(template);
  } catch (error) {
    throw new DatabaseError("failed to fetch item template");
  }
};

export { insertItemTemplateAndReturnID, getTemplate };
