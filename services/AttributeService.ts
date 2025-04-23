import { AttributeDTO, isValidAttributeType } from "@/dto/AttributeDTO";
import { AttributeType } from "@/utils/enums/AttributeType";
import {
  insertAttributeQuery,
  insertMultiselectOptionsQuery,
} from "@/queries/AttributeQuery";
import { executeQuery, getLastInsertId } from "@/utils/QueryHelper";

/**
 * Inserts a new attribute into the database and returns its ID.
 *
 * @param {AttributeDTO} attributeDTO - The DTO representing the attribute to insert.
 * @returns {Promise<void>} A promise that resolves to void.
 */
const insertAttribute = async (attributeDTO: AttributeDTO): Promise<void> => {
  try {
    // Validate attribute type or use default
    if (!isValidAttributeType(attributeDTO.attributeType)) {
      attributeDTO.attributeType = AttributeType.Text;
    }

    await executeQuery(insertAttributeQuery, [
      attributeDTO.attributeLabel,
      attributeDTO.attributeType,
      attributeDTO.preview ? 1 : 0,
      attributeDTO.itemTemplateID,
    ]);
  } catch (error) {
    console.error("Error inserting attribute:", error);
  }
};

const insertMultiselectOptions = async (
  option: string,
  attributeID: number,
): Promise<void> => {
  try {
    await executeQuery(insertMultiselectOptionsQuery, [option, attributeID]);
  } catch (error) {
    console.log(error);
  }
};

export { insertAttribute, insertMultiselectOptions };
