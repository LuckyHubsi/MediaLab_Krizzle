import { ItemAttributeValueDTO } from "@/dto/ItemAttributeValueDTO";
import { ItemDTO } from "@/dto/ItemDTO";
import { ItemsDTO } from "@/dto/ItemsDTO";
import { ItemModel } from "@/models/ItemModel";
import { ItemsModel } from "@/models/ItemsModel";
import { insertRatingSymbolQuery } from "@/queries/AttributeQuery";
import { updateDateModifiedByPageIDQuery } from "@/queries/GeneralPageQuery";
import {
  itemSelectByIdQuery,
  insertItemQuery,
  insertTextValueQuery,
  insertDateValueQuery,
  insertMultiselectValueQuery,
  insertRatingValueQuery,
  itemSelectByPageIdQuery,
} from "@/queries/ItemQuery";
import { DatabaseError } from "@/utils/DatabaseError";
import { AttributeType } from "@/utils/enums/AttributeType";
import { ItemMapper } from "@/utils/mapper/ItemMapper";
import { ItemsMapper } from "@/utils/mapper/ItemsMapper";
import {
  fetchAll,
  fetchFirst,
  executeQuery,
  executeTransaction,
  getLastInsertId,
} from "@/utils/QueryHelper";
import * as SQLite from "expo-sqlite";

/**
 * Retrieves a single item by its ID.
 *
 * @param {number} id - The ID of the item to retrieve.
 * @returns {Promise<ItemDTO | null>} A promise that resolves to an ItemDTO object or null if not found.
 */
const getItemById = async (id: number): Promise<ItemDTO> => {
  try {
    // get raw result using the query
    const rawResult = await fetchFirst<ItemModel>(itemSelectByIdQuery, [id]);

    if (rawResult) {
      // Check if attributes are already a JSON string
      const parsedAttributes =
        typeof rawResult.attributes === "string"
          ? JSON.parse(rawResult.attributes)
          : rawResult.attributes;

      const parsedModel = {
        ...rawResult,
        attributes: parsedAttributes,
      };

      const dto = ItemMapper.toDTO(parsedModel);
      return dto;
    } else {
      throw new DatabaseError("Error retrieving item by ID");
    }
  } catch (error) {
    throw new DatabaseError("Error retrieving item by ID");
  }
};

/**
 * Retrieves all items associated with a specific collection.
 *
 * @param {number} pageID - The ID of the page the item belongs to .
 * @returns {Promise<ItemsDTO[]>} A promise that resolves to an ItemsDTO.
 * @throws {DatabaseError} If fetch fails.
 */
const getItemsByPageId = async (pageID: number): Promise<ItemsDTO> => {
  try {
    const rawResults = await fetchAll<ItemsModel>(itemSelectByPageIdQuery, [
      pageID,
    ]);

    return ItemsMapper.toDTO(rawResults);
  } catch (error) {
    console.error("Error retrieving items by page ID:", error);
    throw new DatabaseError("Error retrieving items by page id");
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
    const itemID = await executeTransaction<number>(async (txn) => {
      await executeQuery(
        insertItemQuery,
        [itemDTO.pageID, itemDTO.categoryID],
        txn,
      );
      const lastInsertedID = await getLastInsertId(txn);

      if (itemDTO.attributeValues) {
        itemDTO.attributeValues.forEach((value) => {
          value.itemID = lastInsertedID;
          switch (value.type) {
            case AttributeType.Text:
              insertItemAttributeValue(insertTextValueQuery, value, txn);
              break;
            case AttributeType.Date:
              insertItemAttributeValue(insertDateValueQuery, value, txn);
              break;
            case AttributeType.Rating:
              insertItemAttributeValue(insertRatingValueQuery, value, txn);
              break;
            case AttributeType.Multiselect:
              insertItemAttributeValue(insertMultiselectValueQuery, value, txn);
              break;
            default:
              break;
          }
        });
      }

      await executeQuery(
        updateDateModifiedByPageIDQuery,
        [new Date().toISOString(), itemDTO.pageID],
        txn,
      );

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
  txn?: SQLite.SQLiteDatabase,
): Promise<void> => {
  try {
    if ("valueNumber" in valueDTO) {
      await executeQuery(
        query,
        [valueDTO.itemID, valueDTO.attributeID, valueDTO.valueNumber],
        txn,
      );
    } else if ("valueString" in valueDTO) {
      await executeQuery(
        query,
        [valueDTO.itemID, valueDTO.attributeID, valueDTO.valueString],
        txn,
      );
    } else if ("valueMultiselect" in valueDTO) {
      const stringifiedValues = JSON.stringify(valueDTO.valueMultiselect);
      await executeQuery(
        query,
        [valueDTO.itemID, valueDTO.attributeID, stringifiedValues],
        txn,
      );
    }
  } catch (error) {
    throw new DatabaseError("Failed to insert item value");
  }
};

export {
  getItemById,
  getItemsByPageId,
  insertItemAndReturnID,
  insertItemAttributeValue,
};
