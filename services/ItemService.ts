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
 * Inserts a new item and its attribute values into the database and returns the item ID.
 *
 * @param {ItemDTO} itemDTO - The DTO representing the item to insert.
 * @returns {Promise<number>} A promise that resolves to the inserted item's ID, or null if the insertion fails.
 *
 * @throws {DatabaseError} When transaction fails.
 */
const insertItemAndReturnID = async (itemDTO: ItemDTO): Promise<number> => {
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
              insertItemAttributeValue(insertDateValueQuery, value);
              break;
            case AttributeType.Rating:
              insertItemAttributeValue(insertTextValueQuery, value);
              break;
            case AttributeType.Multiselect:
              insertItemAttributeValue(insertMultiselectValueQuery, value);
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
): Promise<void> => {
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
      const stringifiedValues = JSON.stringify(valueDTO.valueMultiselect);
      await executeQuery(query, [
        valueDTO.itemID,
        valueDTO.attributeID,
        stringifiedValues,
      ]);
    }
  } catch (error) {
    console.error("Error updating item:", error);
    throw new DatabaseError("Failed to insert item value");
  }
};

export {
  getItemById,
  getItemsByCollectionId,
  insertItemAndReturnID,
  insertItemAttributeValue,
};
