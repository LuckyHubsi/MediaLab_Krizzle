import { AttributeDTO, isValidAttributeType } from '@/dto/AttributeDTO';
import { AttributeType } from '@/utils/enums/AttributeType';
import { insertAttribute } from '@/queries/AttributeQuery';
import { executeQuery, getLastInsertId } from '@/utils/QueryHelper';

/**
 * Inserts a new attribute into the database and returns its ID.
 * 
 * @param {AttributeDTO} attributeDTO - The DTO representing the attribute to insert.
 * @returns {Promise<number | null>} A promise that resolves to the inserted attribute's ID, or null if the insertion fails.
 */
const insertAttributeAndReturnID = async (attributeDTO: AttributeDTO): Promise<number | null> => {
    try {
        // Validate attribute type or use default
        if (!isValidAttributeType(attributeDTO.attributeType)) {
            attributeDTO.attributeType = AttributeType.Text;
        }

        await executeQuery(insertAttribute, [
            attributeDTO.itemTemplateID,
            attributeDTO.attributeLabel,
            attributeDTO.attributeType,
            attributeDTO.preview ? 1 : 0
        ]);

        // get inserted attribute ID
        const result = await getLastInsertId();

        if (result) {
            console.log("Inserted Attribute ID:", result);
            return result;
        } else {
            console.error("Failed to fetch inserted attribute ID");
            return null;
        }
    } catch (error) {
        console.error("Error inserting attribute:", error);
        return null;
    }
};

export {
    insertAttributeAndReturnID
}