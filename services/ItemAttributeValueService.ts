// ItemAttributeValueService.ts
import { ItemAttributeValueDTO } from '@/dto/ItemAttributeValueDTO';
import { ItemAttributeValueModel } from '@/models/ItemAttributeValueModel';
import { 
    itemAttributeValueSelectByItemIdQuery,
    insertItemAttributeValue as insertItemAttributeValueQuery,
    updateItemAttributeValue
} from '@/queries/ItemAttributeValueQuery';
import { 
    fetchAll, 
    fetchFirst, 
    executeQuery,
    getLastInsertId
} from '@/utils/QueryHelper';
import { ItemAttributeValueMapper } from '@/utils/mapper/ItemAttributeValueMapper';
import { getAttributeById } from './AttributeService';
import { AttributeValidator } from '@/utils/AttributeValidator';

/**
 * Retrieves all attribute values for a specific item.
 * 
 * @param {number} itemId - The ID of the item.
 * @returns {Promise<ItemAttributeValueDTO[]>} A promise that resolves to an array of ItemAttributeValueDTO objects.
 */
const getItemAttributeValuesByItemId = async (itemId: number): Promise<ItemAttributeValueDTO[]> => {
    const rawData = await fetchAll<ItemAttributeValueModel>(itemAttributeValueSelectByItemIdQuery, [itemId]);
    const values = rawData.map(row => ItemAttributeValueMapper.toDTO(row));
    
    // For each value, get its associated attribute
    return await Promise.all(values.map(async (value) => {
        const attribute = await getAttributeById(value.attributeID);
        if (attribute) {
            value.attribute = attribute;
        }
        return value;
    }));
};

/**
 * Inserts a new item attribute value into the database and returns its ID.
 * 
 * @param {ItemAttributeValueDTO} valueDTO - The DTO representing the item attribute value to insert.
 * @returns {Promise<number | null>} A promise that resolves to the inserted value's ID, or null if the insertion fails.
 */
const insertItemAttributeValueAndReturnID = async (valueDTO: ItemAttributeValueDTO): Promise<number | null> => {
    try {
        // Get the attribute to validate the value
        const attribute = await getAttributeById(valueDTO.attributeID);
        if (attribute) {
            // Validate the value based on the attribute type
            const validatedValue = AttributeValidator.validateValue(
                valueDTO.value, 
                attribute.attributeType
            );
            
            valueDTO.value = validatedValue !== null ? validatedValue : '';
        }
        
        const valueModel = ItemAttributeValueMapper.toModel(valueDTO);

        await executeQuery(insertItemAttributeValueQuery, [
            valueModel.itemID,
            valueModel.attributeID,
            valueModel.value
        ]);

        // get inserted value ID
        const result = await getLastInsertId();

        if (result) {
            console.log("Inserted Item Attribute Value ID:", result);
            return result;
        } else {
            console.error("Failed to fetch inserted item attribute value ID");
            return null;
        }
    } catch (error) {
        console.error("Error inserting item attribute value:", error);
        return null;
    }
};

/**
 * Updates an existing item attribute value in the database.
 * 
 * @param {ItemAttributeValueDTO} valueDTO - The DTO representing the item attribute value to update.
 * @returns {Promise<boolean>} A promise that resolves to true if the update succeeds, false otherwise.
 */
const updateItemAttributeValueById = async (valueDTO: ItemAttributeValueDTO): Promise<boolean> => {
    try {
        if (!valueDTO.valueID) {
            console.error("Item Attribute Value ID is required for update");
            return false;
        }

        // Get the attribute to validate the value
        const attribute = await getAttributeById(valueDTO.attributeID);
        if (attribute) {
            // Validate the value based on the attribute type
            const validatedValue = AttributeValidator.validateValue(
                valueDTO.value, 
                attribute.attributeType
            );
            
            valueDTO.value = validatedValue !== null ? validatedValue : '';
        }
        
        const valueModel = ItemAttributeValueMapper.toModel(valueDTO);

        await executeQuery(updateItemAttributeValue, [
            valueModel.itemID,
            valueModel.attributeID,
            valueModel.value,
            valueModel.valueID
        ]);

        return true;
    } catch (error) {
        console.error("Error updating item attribute value:", error);
        return false;
    }
};

export {
    getItemAttributeValuesByItemId,
    insertItemAttributeValueAndReturnID,
    updateItemAttributeValueById
}