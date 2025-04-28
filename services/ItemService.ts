import { ItemAttributeValueDTO } from "@/dto/ItemAttributeValueDTO";
import { ItemDTO } from "@/dto/ItemDTO";
import { ItemModel } from "@/models/ItemModel";
// import { ItemAttributeValueModel } from '@/models/ItemAttributeValueModel';
import {
  itemSelectByIdQuery,
  itemSelectByCollectionIdQuery,
  insertItemQuery,
  updateItem,
  insertTextValueQuery,
  insertDateValueQuery,
  insertMultiselectValueQuery,
} from "@/queries/ItemQuery";
import { ItemMapper } from "@/utils/mapper/ItemMapper";
import {
  fetchAll,
  fetchFirst,
  executeQuery,
  executeTransaction,
  getLastInsertId,
} from "@/utils/QueryHelper";

/**
 * Retrieves a single item by its ID.
 *
 * @param {number} id - The ID of the item to retrieve.
 * @returns {Promise<ItemDTO | null>} A promise that resolves to an ItemDTO object or null if not found.
 */
const getItemById = async (id: number): Promise<ItemDTO | null> => {
  try {
    const query = itemSelectByIdQuery(id);

    // define interface for raw result
    interface RawItemResult {
      itemID: number;
      collectionID: number;
      category: string | null;
      attributeValues: string;
    }

    // get raw result using the query
    const rawResult = await fetchFirst<RawItemResult>(query, [id]);

    if (!rawResult) {
      return null;
    }

    // parse the attributeValues JSON string into an array
    const parsedValues = JSON.parse(rawResult.attributeValues);

    const result: ItemModel = {
      itemID: rawResult.itemID,
      collectionID: rawResult.collectionID,
      category: rawResult.category,
      values: parsedValues,
    };

    return ItemMapper.toDTO(result);
  } catch (error) {
    console.error("Error retrieving item by ID:", error);
    throw error;
  }
};

/**
 * Retrieves all items associated with a specific collection.
 *
 * @param {number} collectionId - The ID of the collection.
 * @returns {Promise<ItemDTO[]>} A promise that resolves to an array of ItemDTO objects.
 */
const getItemsByCollectionId = async (
  collectionId: number,
): Promise<ItemDTO[]> => {
  try {
    const query = itemSelectByCollectionIdQuery(collectionId);

    // define interface for raw result
    interface RawItemResult {
      itemID: number;
      collectionID: number;
      category: string | null;
      attributeValues: string;
    }

    // get raw result using the query
    const rawResults = await fetchAll<RawItemResult>(query, [collectionId]);

    if (!rawResults) {
      return [];
    }

    // change to correct format
    const items = rawResults.map((rawResult) => {
      const parsedValues = JSON.parse(rawResult.attributeValues);

      const result: ItemModel = {
        itemID: rawResult.itemID,
        collectionID: rawResult.collectionID,
        category: rawResult.category,
        values: parsedValues,
      };

      return ItemMapper.toDTO(result);
    });

    return items;
  } catch (error) {
    console.error("Error retrieving items by collection ID:", error);
    throw error;
  }
};

/**
 * Creates a new item based on a collection's item template and returns the new item ID.
 * params: itemID, collectionID, attributeValueDTO[] (attributeID, attribute_label, value, attribute_type)
 * @returns {Promise<number | null>} A promise that resolves to the created item's ID, or null if creation fails.
 */
const createItemFromTemplate = async (): Promise<number | null> => {
  try {
    // insert a new item with correct collectionID and category
    // get lastInsertID

    // get all attributes
    let attributes: any[] = [];

    // Create empty attribute values for each attribute, with appropriate defaults based on type
    if (attributes.length > 0) {
      attributes.map((attr) => {
        // Set appropriate default values based on attribute type
        let defaultValue = "";

        switch (attr.attributeType) {
          case "rating":
            defaultValue = "0"; // assign default value if no valid value passed
            // insert into rating table
            break;
          case "date":
            defaultValue = ""; // assign default value if no valid value passed
            // insert into date table
            break;
          case "multi-select":
            defaultValue = "[]"; // assign default value if no valid value passed
            // insert into multiselect table
            break;
          case "text":
            defaultValue = ""; // assign default value if no valid value passed
            // insert into text  table
            break;
          default:
            defaultValue = ""; // Empty text
            break;
        }
      });
    }

    return null;
  } catch (error) {
    console.error("Error creating item from template:", error);
    return null;
  }
};

/**
 * Inserts a new item into the database and returns its ID.
 *
 * @param {ItemDTO} itemDTO - The DTO representing the item to insert.
 * @returns {Promise<number>} A promise that resolves to the inserted item's ID, or null if the insertion fails.
 *
 * @throws {DatabaseError} When transaction fails.
 */
const insertItemAndReturnID = async (itemDTO: ItemDTO): Promise<void> => {
  try {
    console.log("ITEM DTO", itemDTO);
    const itemID = await executeTransaction<number>(async () => {
      await executeQuery(insertItemQuery, [itemDTO.pageID, itemDTO.categoryID]);
      const lastInsertedID = await getLastInsertId();

      if (itemDTO.attributeValues) {
        itemDTO.attributeValues.forEach((value) => {
          value.itemID = lastInsertedID;
          switch (value.type) {
            case AttributeType.Text:
              insertItemAttributeValue(insertTextValueQuery, value);
              break;
            case AttributeType.Date:
              insertItemAttributeValue(insertTextValueQuery, value);
              break;
            case AttributeType.Rating:
              insertItemAttributeValue(insertTextValueQuery, value);
              break;
            case AttributeType.Multiselect:
              insertItemAttributeValue(insertTextValueQuery, value);
              break;
            default:
              break;
          }
        });
      }

      return lastInsertedID;
    });

    if (itemID) {
      return itemID;
    } else {
      throw new DatabaseError("Failed to insert collection item.");
    }
  } catch (error) {
    throw new DatabaseError("Failed to insert collection item.");
  }
};

/**
 * Inserts a new attribute value for an item.
 *
 * @param {ItemAttributeValueDTO} valueDTO - The DTO representing the attribute value to insert.
 * @returns {Promise<number | null>} A promise that resolves to the inserted value's ID, or null if the insertion fails.
 */
const insertItemAttributeValue = async (
  query: string,
  valueDTO: ItemAttributeValueDTO,
): Promise<number | null> => {
  try {
    if ("valueNumber" in valueDTO) {
      await executeQuery(query, [
        valueDTO.itemID,
        valueDTO.attributeID,
        valueDTO.valueNumber,
      ]);
    } else if ("valueString" in valueDTO) {
      await executeQuery(query, [
        valueDTO.itemID,
        valueDTO.attributeID,
        valueDTO.valueString,
      ]);
    } else if ("valueMultiselect" in valueDTO) {
      for (const valueMultiselect in valueDTO.valueMultiselect) {
        await executeQuery(query, [
          valueDTO.itemID,
          valueDTO.attributeID,
          valueDTO.valueMultiselect,
        ]);
      }
    }

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
    await executeTransaction(async () => {
      // Update the item basic info
      // TODO: only do i fnecessary
      await executeQuery(updateItem, [itemDTO.category, itemDTO.itemID]);

      // Update attribute values if provided
      if (itemDTO.attributeValues && itemDTO.attributeValues.length > 0) {
        for (const av of itemDTO.attributeValues) {
          // get the attribute to determine its type for validation
          // validate the value based on attribute type
          // update the existing value
        }
      }
    });
    return true;
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

    await executeQuery(updateItem, [itemDTO.category, itemDTO.itemID]);

    return true;
  } catch (error) {
    console.error("Error updating item:", error);
    return false;
  }
};

export {
  getItemById,
  getItemsByCollectionId,
  createItemFromTemplate,
  insertItemAndReturnID,
  insertItemAttributeValue,
  updateItemById,
  updateItemWithAttributes,
};
