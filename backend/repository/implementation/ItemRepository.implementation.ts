import { RepositoryError } from "@/backend/util/error/RepositoryError";
import { ItemRepository } from "../interfaces/ItemRepository.interface";
import { BaseRepositoryImpl } from "./BaseRepository.implementation";
import {
  Item,
  ItemAttributeValue,
  PreviewItem,
} from "@/backend/domain/entity/Item";
import {
  deleteItemAttributeValuesQuery,
  deleteItemQuery,
  insertDateValueQuery,
  insertItemQuery,
  insertMultiselectValueQuery,
  insertRatingValueQuery,
  insertTextValueQuery,
  itemSelectByIdQuery,
  selectItemPreviewValuesQuery,
  updateDateValueQuery,
  updateItemQuery,
  updateMultiselectValueQuery,
  updateRatingValueQuery,
  updateTextValueQuery,
} from "../query/ItemQuery";
import { ItemMapper } from "@/backend/util/mapper/ItemMapper";
import { CategoryID } from "@/backend/domain/entity/CollectionCategory";
import * as SQLite from "expo-sqlite";
import {
  ItemID,
  PageID,
  itemID,
  pageID,
  AttributeID,
} from "@/backend/domain/common/IDs";
import { ItemModel, ItemPreviewValueModel } from "../model/ItemModel";
import { Attribute } from "@/backend/domain/common/Attribute";

/**
 * Implementation of the ItemRepository interface using SQL queries.
 *
 * Handles the following operations:
 * - Fetching an item.
 * - Inserting an item and its values.
 * - Updating an item and its values.
 * - Deleting an item and its values.
 */
export class ItemRepositoryImpl
  extends BaseRepositoryImpl
  implements ItemRepository
{
  /**
   * Fetches an item and its values.
   *
   * @param itemId - The ID of the item to be fetched.
   * @returns A Promise resolving to an `Item` domain entity.
   * @throws RepositoryError if the query fails.
   */
  async getItemByID(itemId: ItemID): Promise<Item> {
    try {
      const item = await this.fetchFirst<ItemModel>(itemSelectByIdQuery, [
        itemId,
      ]);
      if (item) {
        return ItemMapper.toEntity(item);
      } else {
        throw new RepositoryError("Failed to fetch item.");
      }
    } catch (error) {
      throw new RepositoryError("Failed to fetch item.");
    }
  }

  /**
   * Fetches an item and its values.
   *
   * @param pageId - The ID of the page for which the items should be fetched.
   * @param attributes - An array of Attributes to help with mapping the items to domain entities.
   * @param txn - The DB instance the operation should be executed on if a transaction is ongoing.
   * @returns A Promise resolving to an array of `PreviewItem` domain entities.
   * @throws RepositoryError if the query fails.
   */
  async getItemsByID(
    pageId: PageID,
    attributes: Attribute[],
    txn?: SQLite.SQLiteDatabase,
  ): Promise<PreviewItem[]> {
    try {
      const items = await this.fetchAll<ItemPreviewValueModel>(
        selectItemPreviewValuesQuery,
        [pageId],
        txn,
      );
      return ItemMapper.toPreviewEntities(items, attributes);
    } catch (error) {
      throw new RepositoryError("Failed to fetch items.");
    }
  }

  /**
   * Insert a new item and returns its ID.
   *
   * @param pageId - The `PageID` of the page the item belongs to.
   * @param categoryId - The `CategoryID` of the category the item was assigned to.
   * @param txn - The DB instance the operation should be executed on if a transaction is ongoing.
   * @returns A Promise resolving to a ItemID.
   * @throws RepositoryError if the query fails.
   */
  async insertItemAndReturnID(
    pageId: PageID,
    categoryId: CategoryID,
    txn?: SQLite.SQLiteDatabase,
  ): Promise<ItemID> {
    try {
      const itemId = await this.executeTransaction(async (transaction) => {
        await this.executeQuery(
          insertItemQuery,
          [pageId, categoryId],
          txn ?? transaction,
        );

        const lastInsertedID = await this.getLastInsertId(txn ?? transaction);
        return lastInsertedID;
      });
      return itemID.parse(itemId);
    } catch (error) {
      throw new RepositoryError("Failed to insert item.");
    }
  }

  /**
   * Insert a new text value for an item.
   *
   * @param itemAttributeValue - The `ItemAttributeValue` containing the value and attributeID to be saved.
   * @param itemId - The `ItemID` of the item the value belongs to.
   * @param txn - The DB instance the operation should be executed on if a transaction is ongoing.
   * @returns A Promise resolving to void.
   * @throws RepositoryError if the query fails.
   */
  async insertTextValue(
    itemAttributeValue: ItemAttributeValue,
    itemId: ItemID,
    txn?: SQLite.SQLiteDatabase,
  ): Promise<void> {
    try {
      if ("valueString" in itemAttributeValue)
        await this.executeQuery(
          insertTextValueQuery,
          [
            itemId,
            itemAttributeValue.attributeID,
            itemAttributeValue.valueString,
          ],
          txn,
        );
    } catch (error) {
      throw new RepositoryError("Failed to insert text value.");
    }
  }

  /**
   * Insert a new date value for an item.
   *
   * @param itemAttributeValue - The `ItemAttributeValue` containing the value and attributeID to be saved.
   * @param itemId - The `ItemID` of the item the value belongs to.
   * @param txn - The DB instance the operation should be executed on if a transaction is ongoing.
   * @returns A Promise resolving to void.
   * @throws RepositoryError if the query fails.
   */
  async insertDateValue(
    itemAttributeValue: ItemAttributeValue,
    itemId: ItemID,
    txn?: SQLite.SQLiteDatabase,
  ): Promise<void> {
    try {
      if ("valueString" in itemAttributeValue)
        await this.executeQuery(
          insertDateValueQuery,
          [
            itemId,
            itemAttributeValue.attributeID,
            itemAttributeValue.valueString,
          ],
          txn,
        );
    } catch (error) {
      throw new RepositoryError("Failed to insert date value.");
    }
  }

  /**
   * Insert a new rating value for an item.
   *
   * @param itemAttributeValue - The `ItemAttributeValue` containing the value and attributeID to be saved.
   * @param itemId - The `ItemID` of the item the value belongs to.
   * @param txn - The DB instance the operation should be executed on if a transaction is ongoing.
   * @returns A Promise resolving to void.
   * @throws RepositoryError if the query fails.
   */
  async insertRatingValue(
    itemAttributeValue: ItemAttributeValue,
    itemId: ItemID,
    txn?: SQLite.SQLiteDatabase,
  ): Promise<void> {
    try {
      if ("valueNumber" in itemAttributeValue)
        await this.executeQuery(
          insertRatingValueQuery,
          [
            itemId,
            itemAttributeValue.attributeID,
            itemAttributeValue.valueNumber,
          ],
          txn,
        );
    } catch (error) {
      throw new RepositoryError("Failed to insert rating value.");
    }
  }

  /**
   * Insert a new multiselect value for an item.
   *
   * @param itemAttributeValue - The `ItemAttributeValue` containing the value and attributeID to be saved.
   * @param itemId - The `ItemID` of the item the value belongs to.
   * @param txn - The DB instance the operation should be executed on if a transaction is ongoing.
   * @returns A Promise resolving to void.
   * @throws RepositoryError if the query fails.
   */
  async insertMultiselectValue(
    itemAttributeValue: ItemAttributeValue,
    itemId: ItemID,
    txn?: SQLite.SQLiteDatabase,
  ): Promise<void> {
    try {
      if ("valueMultiselect" in itemAttributeValue)
        await this.executeQuery(
          insertMultiselectValueQuery,
          [
            itemId,
            itemAttributeValue.attributeID,
            JSON.stringify(itemAttributeValue.valueMultiselect),
          ],
          txn,
        );
    } catch (error) {
      throw new RepositoryError("Failed to insert multi-select value.");
    }
  }

  /**
   * Deletes an item.
   *
   * @param itemId - The `ItemID` of the item to be deleted.
   * @param txn - The DB instance the operation should be executed on if a transaction is ongoing.
   * @returns A Promise resolving to `PageID` (the page it belonged to).
   * @throws RepositoryError if the query fails.
   */
  async deleteItem(
    itemId: ItemID,
    txn?: SQLite.SQLiteDatabase,
  ): Promise<PageID> {
    try {
      const result = await this.fetchFirst<{ pageID: number }>(
        deleteItemQuery,
        [itemId],
        txn,
      );
      return pageID.parse(result?.pageID);
    } catch (error) {
      throw new RepositoryError("Failed to delete item.");
    }
  }

  /**
   * Deletes values of an item.
   *
   * @param itemId - The `ItemID` of the item for which the values should be deleted.
   * @param txn - The DB instance the operation should be executed on if a transaction is ongoing.
   * @returns A Promise resolving to void.
   * @throws RepositoryError if the query fails.
   */
  async deleteItemValues(
    itemId: ItemID,
    txn?: SQLite.SQLiteDatabase,
  ): Promise<void> {
    try {
      await this.executeQuery(
        deleteItemAttributeValuesQuery,
        [itemId, itemId, itemId, itemId],
        txn,
      );
    } catch (error) {
      throw new RepositoryError("Failed to delete item value.");
    }
  }

  /**
   * Updates an item.
   *
   * @param itemId - The `ItemID` of the item to be updated.
   * @param categoryId - The `CategoryID` of the category the item was assigned to.
   * @param txn - The DB instance the operation should be executed on if a transaction is ongoing.
   * @returns A Promise resolving to void.
   * @throws RepositoryError if the query fails.
   */
  async updateItem(
    itemId: ItemID,
    categoryId: CategoryID,
    txn?: SQLite.SQLiteDatabase,
  ): Promise<void> {
    try {
      await this.executeQuery(updateItemQuery, [categoryId, itemId], txn);
    } catch (error) {
      throw new RepositoryError("Failed to update collection item.");
    }
  }

  /**
   * Updates a text value for an item.
   *
   * @param itemId - The `ItemID` of the item the value belongs to.
   * @param attributeId - The `AttributeID` of the attribute the value belongs to.
   * @param value - The updated value or null if removed.
   * @param txn - The DB instance the operation should be executed on if a transaction is ongoing.
   * @returns A Promise resolving to void.
   * @throws RepositoryError if the query fails.
   */
  async updateTextValue(
    itemId: ItemID,
    attributeId: AttributeID,
    value: string | null,
    txn?: SQLite.SQLiteDatabase,
  ): Promise<void> {
    try {
      await this.executeQuery(
        updateTextValueQuery,
        [value, itemId, attributeId],
        txn,
      );
    } catch (error) {
      throw new RepositoryError("Failed to update text value.");
    }
  }

  /**
   * Updates a date value for an item.
   *
   * @param itemId - The `ItemID` of the item the value belongs to.
   * @param attributeId - The `AttributeID` of the attribute the value belongs to.
   * @param value - The updated value or null is removed.
   * @param txn - The DB instance the operation should be executed on if a transaction is ongoing.
   * @returns A Promise resolving to void.
   * @throws RepositoryError if the query fails.
   */
  async updateDateValue(
    itemId: ItemID,
    attributeId: AttributeID,
    value: string | null,
    txn?: SQLite.SQLiteDatabase,
  ): Promise<void> {
    try {
      await this.executeQuery(
        updateDateValueQuery,
        [value, itemId, attributeId],
        txn,
      );
    } catch (error) {
      throw new RepositoryError("Failed to update text value.");
    }
  }

  /**
   * Updates a rating value for an item.
   *
   * @param itemId - The `ItemID` of the item the value belongs to.
   * @param attributeId - The `AttributeID` of the attribute the value belongs to.
   * @param value - The updated value or null if removed.
   * @param txn - The DB instance the operation should be executed on if a transaction is ongoing.
   * @returns A Promise resolving to void.
   * @throws RepositoryError if the query fails.
   */
  async updateRatingValue(
    itemId: ItemID,
    attributeId: AttributeID,
    value: number | null,
    txn?: SQLite.SQLiteDatabase,
  ): Promise<void> {
    try {
      await this.executeQuery(
        updateRatingValueQuery,
        [value, itemId, attributeId],
        txn,
      );
    } catch (error) {
      throw new RepositoryError("Failed to update text value.");
    }
  }

  /**
   * Updates a multislect value for an item.
   *
   * @param itemId - The `ItemID` of the item the value belongs to.
   * @param attributeId - The `AttributeID` of the attribute the value belongs to.
   * @param value - The updated value or null if removed.
   * @param txn - The DB instance the operation should be executed on if a transaction is ongoing.
   * @returns A Promise resolving to void.
   * @throws RepositoryError if the query fails.
   */
  async updateMultiselectValue(
    itemId: ItemID,
    attributeId: AttributeID,
    value: string | null,
    txn?: SQLite.SQLiteDatabase,
  ): Promise<void> {
    try {
      await this.executeQuery(
        updateMultiselectValueQuery,
        [value, itemId, attributeId],
        txn,
      );
    } catch (error) {
      throw new RepositoryError("Failed to update text value.");
    }
  }
}

// Singleton instance of the ItemRepository implementation.
export const itemRepository = new ItemRepositoryImpl();
