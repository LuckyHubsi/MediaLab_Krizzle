import { AttributeDTO, isValidAttributeType } from "@/dto/AttributeDTO";
import { AttributeType } from "@/utils/enums/AttributeType";
import { insertAttributeQuery } from "@/queries/AttributeQuery";
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
      attributeDTO.itemTemplateID,
      attributeDTO.attributeLabel,
      attributeDTO.attributeType,
      attributeDTO.preview ? 1 : 0,
    ]);
  } catch (error) {
    console.error("Error inserting attribute:", error);
  }
};

export { insertAttribute };
