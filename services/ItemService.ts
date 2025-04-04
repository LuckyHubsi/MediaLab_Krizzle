// ItemService.ts
import { ItemDTO } from '@/dto/ItemDTO';
import { ItemAttributeValueDTO } from '@/dto/ItemAttributeValueDTO';
import { ItemModel } from '@/models/ItemModel';
import { ItemAttributeValueModel } from '@/models/ItemAttributeValueModel';
import { 
    itemSelectByIdQuery,
    itemSelectByCollectionIdQuery,
    insertItem,
    updateItem,
    deleteItem
} from '@/queries/ItemQuery';
import { 
    itemAttributeValueSelectByItemIdQuery,
    insertItemAttributeValue as insertItemAttributeValueQuery
} from '@/queries/ItemAttributeValueQuery';
import { 
    fetchAll, 
    fetchFirst, 
    executeQuery, 
    executeTransaction,
    getLastInsertId
} from '@/utils/QueryHelper';
import { ItemMapper } from '@/utils/mapper/ItemMapper';
import { ItemAttributeValueMapper } from '@/utils/mapper/ItemAttributeValueMapper';
import { getAttributesByTemplateId } from './AttributeService';
import { getCollectionById } from './CollectionService';
import { getAttributeById } from './AttributeService';
import { AttributeValidator } from '@/utils/AttributeValidator';

/**
 * Retrieves a single item by its ID.
 * 
 * @param {number} id - The ID of the item to retrieve.
 * @returns {Promise<ItemDTO | null>} A promise that resolves to an ItemDTO object or null if not found.
 */
const getItemById = async (id: number): Promise<ItemDTO | null> => {
    const result = await fetchFirst<ItemModel>(itemSelectByIdQuery, [id]);
    return result ? ItemMapper.toDTO(result) : null;
};

/**
 * Retrieves a single item by its ID with all its attribute values.
 * 
 * @param {number} id - The ID of the item to retrieve.
 * @returns {Promise<ItemDTO | null>} A promise that resolves to an ItemDTO object with attribute values or null if not found.
 */
const getItemWithAttributesById = async (id: number): Promise<ItemDTO | null> => {
    const item = await getItemById(id);
    
    if (!item) {
        return null;
    }
    
    // Get the attribute values for this item
    const attributeValues = await getAttributeValuesByItemId(id);
    item.attributeValues = attributeValues;
    
    return item;
};

/**
 * Retrieves all items associated with a specific collection.
 * 
 * @param {number} collectionId - The ID of the collection.
 * @returns {Promise<ItemDTO[]>} A promise that resolves to an array of ItemDTO objects.
 */
const getItemsByCollectionId = async (collectionId: number): Promise<ItemDTO[]> => {
    const rawData = await fetchAll<ItemModel>(itemSelectByCollectionIdQuery, [collectionId]);
    return rawData.map(row => ItemMapper.toDTO(row));
};

/**
 * Retrieves all items associated with a specific collection and includes their attribute values.
 * 
 * @param {number} collectionId - The ID of the collection.
 * @returns {Promise<ItemDTO[]>} A promise that resolves to an array of ItemDTO objects with attribute values.
 */
const getItemsWithAttributesByCollectionId = async (collectionId: number): Promise<ItemDTO[]> => {
    const items = await getItemsByCollectionId(collectionId);
    
    // For each item, get its attribute values
    const itemsWithAttributes = await Promise.all(items.map(async (item) => {
        if (item.itemID) {
            const attributeValues = await getAttributeValuesByItemId(item.itemID);
            item.attributeValues = attributeValues;
        }
        return item;
    }));
    
    return itemsWithAttributes;
};

/**
 * Retrieves all attribute values for a specific item.
 * 
 * @param {number} itemId - The ID of the item.
 * @returns {Promise<ItemAttributeValueDTO[]>} A promise that resolves to an array of ItemAttributeValueDTO objects.
 */
const getAttributeValuesByItemId = async (itemId: number): Promise<ItemAttributeValueDTO[]> => {
    const rawAttributeValues = await fetchAll<ItemAttributeValueModel>(itemAttributeValueSelectByItemIdQuery, [itemId]);
    
    // Map the raw data to DTOs
    const attributeValues = rawAttributeValues.map(row => ItemAttributeValueMapper.toDTO(row as ItemAttributeValueModel));
    
    // For each attribute value, get the associated attribute details
    return await Promise.all(attributeValues.map(async (av) => {
        const attribute = await getAttributeById(av.attributeID);
        if (attribute) {
            av.attribute = attribute;
        }
        return av;
    }));
};

/**
 * Creates a new item based on a collection's item template and returns the new item ID.
 * 
 * @param {number} collectionId - The ID of the collection.
 * @param {string|null} category - Optional category for the item.
 * @returns {Promise<number | null>} A promise that resolves to the created item's ID, or null if creation fails.
 */
const createItemFromTemplate = async (collectionId: number, category: string | null = null): Promise<number | null> => {
    try {
        // Get the collection to find its template
        const collection = await getCollectionById(collectionId);
        if (!collection) {
            console.error("Collection not found");
            return null;
        }

        // Create a new item with empty values
        const newItem: ItemDTO = {
            collectionID: collectionId,
            pageID: collection.pageID,
            category: category
        };

        // Insert the item and get its ID
        const itemId = await insertItemAndReturnID(newItem);
        if (!itemId) {
            console.error("Failed to insert item");
            return null;
        }

        // Get all attributes for the template
        const attributes = await getAttributesByTemplateId(collection.itemTemplateID);
        
        // Create empty attribute values for each attribute, with appropriate defaults based on type
        if (attributes.length > 0) {
            const attributeValues: ItemAttributeValueDTO[] = attributes.map(attr => {
                // Set appropriate default values based on attribute type
                let defaultValue = '';
                
                switch (attr.attributeType) {
                    case 'Rating':
                        defaultValue = '0'; // Default rating of 0
                        break;
                    case 'Date':
                        defaultValue = ''; // Empty date
                        break;
                    case 'Multiselect':
                        defaultValue = '[]'; // Empty JSON array for multiselect (we might do it differently, I'unno)
                        break;
                    case 'Text':
                    default:
                        defaultValue = ''; // Empty text
                        break;
                }
                
                return {
                    itemID: itemId,
                    attributeID: attr.attributeID!,
                    value: defaultValue
                };
            });

            // Insert all attribute values
            for (const av of attributeValues) {
                await insertItemAttributeValueAndReturnID(av);
            }
        }

        return itemId;
    } catch (error) {
        console.error("Error creating item from template:", error);
        return null;
    }
};

/**
 * Inserts a new item into the database and returns its ID.
 * 
 * @param {ItemDTO} itemDTO - The DTO representing the item to insert.
 * @returns {Promise<number | null>} A promise that resolves to the inserted item's ID, or null if the insertion fails.
 */
const insertItemAndReturnID = async (itemDTO: ItemDTO): Promise<number | null> => {
    try {
        const itemModel = ItemMapper.toModel(itemDTO);

        await executeQuery(insertItem, [
            itemModel.collectionID,
            itemModel.pageID,
            itemModel.category
        ]);

        // get inserted item ID
        const result = await getLastInsertId();

        if (result) {
            console.log("Inserted Item ID:", result);
            return result;
        } else {
            console.error("Failed to fetch inserted item ID");
            return null;
        }
    } catch (error) {
        console.error("Error inserting item:", error);
        return null;
    }
};

/**
 * Inserts a new attribute value for an item.
 * 
 * @param {ItemAttributeValueDTO} valueDTO - The DTO representing the attribute value to insert.
 * @returns {Promise<number | null>} A promise that resolves to the inserted value's ID, or null if the insertion fails.
 */
const insertItemAttributeValueAndReturnID = async (valueDTO: ItemAttributeValueDTO): Promise<number | null> => {
    try {
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
 * Updates an existing item and its attribute values in the database.
 * 
 * @param {ItemDTO} itemDTO - The DTO representing the item to update.
 * @returns {Promise<boolean>} A promise that resolves to true if the update succeeds, false otherwise.
 */
const updateItemWithAttributes = async (itemDTO: ItemDTO): Promise<boolean> => {
    try {
        if (!itemDTO.itemID) {
            console.error("Item ID is required for update");
            return false;
        }

        // Use a transaction to ensure all operations succeed or fail together
        return await executeTransaction(async () => {
            // Update the item basic info
            const itemModel = ItemMapper.toModel(itemDTO);
            await executeQuery(updateItem, [
                itemModel.collectionID,
                itemModel.pageID,
                itemModel.category,
                itemModel.itemID
            ]);

            // Update attribute values if provided
            if (itemDTO.attributeValues && itemDTO.attributeValues.length > 0) {
                for (const av of itemDTO.attributeValues) {
                    // Get the attribute to determine its type for validation
                    const attribute = await getAttributeById(av.attributeID);
                    
                    if (attribute) {
                        // Validate the value based on attribute type
                        const validatedValue = AttributeValidator.validateValue(
                            av.value, 
                            attribute.attributeType
                        );
                        
                        if (av.valueID) {
                            // Update existing attribute value
                            await executeQuery(
                                'UPDATE item_attribute_values SET value = ? WHERE valueID = ?',
                                [validatedValue !== null ? validatedValue : '', av.valueID]
                            );
                        } else {
                            // Insert new attribute value
                            await insertItemAttributeValueAndReturnID({
                                ...av,
                                value: validatedValue !== null ? validatedValue : ''
                            });
                        }
                    } else {
                        // If attribute not found, use the value as is
                        if (av.valueID) {
                            await executeQuery(
                                'UPDATE item_attribute_values SET value = ? WHERE valueID = ?',
                                [av.value, av.valueID]
                            );
                        } else {
                            await insertItemAttributeValueAndReturnID(av);
                        }
                    }
                }
            }

            return true;
        });
    } catch (error) {
        console.error("Error updating item with attributes:", error);
        return false;
    }
};

/**
 * Updates an existing item in the database.
 * 
 * @param {ItemDTO} itemDTO - The DTO representing the item to update.
 * @returns {Promise<boolean>} A promise that resolves to true if the update succeeds, false otherwise.
 */
const updateItemById = async (itemDTO: ItemDTO): Promise<boolean> => {
    try {
        if (!itemDTO.itemID) {
            console.error("Item ID is required for update");
            return false;
        }

        const itemModel = ItemMapper.toModel(itemDTO);

        await executeQuery(updateItem, [
            itemModel.collectionID,
            itemModel.pageID,
            itemModel.category,
            itemModel.itemID
        ]);

        return true;
    } catch (error) {
        console.error("Error updating item:", error);
        return false;
    }
};

export {
    getItemById,
    getItemWithAttributesById,
    getItemsByCollectionId,
    getItemsWithAttributesByCollectionId,
    createItemFromTemplate,
    insertItemAndReturnID,
    insertItemAttributeValueAndReturnID,
    updateItemById,
    updateItemWithAttributes,
    getAttributeValuesByItemId
}