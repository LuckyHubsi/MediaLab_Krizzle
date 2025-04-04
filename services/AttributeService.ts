import { AttributeDTO, isValidAttributeType } from '@/dto/AttributeDTO';
import { AttributeType } from '@/utils/Enums';
import { AttributeModel } from '@/models/AttributeModel';
import { 
    attributeSelectByIdQuery,
    attributeSelectByTemplateIdQuery,
    insertAttribute
} from '@/queries/AttributeQuery';
import { 
    fetchAll, 
    fetchFirst, 
    executeQuery,
    getLastInsertId
} from '@/utils/QueryHelper';
import { AttributeMapper } from '@/utils/mapper/AttributeMapper';

/**
 * Retrieves a single attribute by its ID.
 * 
 * @param {number} id - The ID of the attribute to retrieve.
 * @returns {Promise<AttributeDTO | null>} A promise that resolves to an AttributeDTO object or null if not found.
 */
const getAttributeById = async (id: number): Promise<AttributeDTO | null> => {
    const result = await fetchFirst<AttributeModel>(attributeSelectByIdQuery, [id]);
    return result ? AttributeMapper.toDTO(result) : null;
};

/**
 * Retrieves all attributes associated with a specific item template.
 * 
 * @param {number} templateId - The ID of the item template.
 * @returns {Promise<AttributeDTO[]>} A promise that resolves to an array of AttributeDTO objects.
 */
const getAttributesByTemplateId = async (templateId: number): Promise<AttributeDTO[]> => {
    const rawData = await fetchAll<AttributeModel>(attributeSelectByTemplateIdQuery, [templateId]);
    return rawData.map(row => AttributeMapper.toDTO(row));
};

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
        
        const attributeModel = AttributeMapper.toModel(attributeDTO);

        await executeQuery(insertAttribute, [
            attributeModel.itemTemplateID,
            attributeModel.attributeLabel,
            attributeModel.attributeType,
            attributeModel.preview,
            attributeModel.options
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
    getAttributeById,
    getAttributesByTemplateId,
    insertAttributeAndReturnID
}

// separate queries for each type