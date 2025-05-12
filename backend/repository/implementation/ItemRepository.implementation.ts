import { RepositoryError } from "@/backend/util/error/RepositoryError";
import { ItemRepository } from "../interfaces/ItemRepository.interface";
import { BaseRepositoryImpl } from "./BaseRepository.implementation";
import {
  Item,
  ItemAttributeValue,
  itemID,
  ItemID,
} from "@/backend/domain/entity/Item";
import { ItemModel } from "@/models/ItemModel";
import {
  deleteItemAttributeValuesQuery,
  deleteItemQuery,
  insertDateValueQuery,
  insertItemQuery,
  insertMultiselectValueQuery,
  insertRatingValueQuery,
  insertTextValueQuery,
  itemSelectByIdQuery,
} from "../query/ItemQuery";
import { ItemMapper } from "@/backend/util/mapper/ItemMapper";
import { pageID, PageID } from "@/backend/domain/entity/GeneralPage";
import { CategoryID } from "@/backend/domain/entity/CollectionCategory";
import * as SQLite from "expo-sqlite";

export class ItemRepositoryImpl
  extends BaseRepositoryImpl
  implements ItemRepository
{
  async getItemByID(itemId: ItemID): Promise<Item> {
    try {
      const item = await super.fetchFirst<ItemModel>(itemSelectByIdQuery, [
        itemId,
      ]);
      if (item) {
        console.log("ITEM MODEL", JSON.stringify(item, null, 2));
        return ItemMapper.toEntity(item);
      } else {
        throw new RepositoryError("Failed to fetch item.");
      }
    } catch (error) {
      throw new RepositoryError("Failed to fetch item.");
    }
  }

  async insertItemAndReturnID(
    pageId: PageID,
    categoryId: CategoryID,
    txn?: SQLite.SQLiteDatabase,
  ): Promise<ItemID> {
    try {
      const itemId = await super.executeTransaction(async (txn) => {
        await super.executeQuery(insertItemQuery, [pageId, categoryId], txn);

        const lastInsertedID = await super.getLastInsertId(txn);
        return lastInsertedID;
      });
      return itemID.parse(itemId);
    } catch (error) {
      throw new RepositoryError("Failed to insert item.");
    }
  }

  async insertTextValue(
    itemAttributeValue: ItemAttributeValue,
    itemId: ItemID,
    txn?: SQLite.SQLiteDatabase,
  ): Promise<void> {
    try {
      if ("valueString" in itemAttributeValue)
        await super.executeQuery(
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

  async insertDateValue(
    itemAttributeValue: ItemAttributeValue,
    itemId: ItemID,
    txn?: SQLite.SQLiteDatabase,
  ): Promise<void> {
    try {
      if ("valueString" in itemAttributeValue)
        await super.executeQuery(
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

  async insertRatingValue(
    itemAttributeValue: ItemAttributeValue,
    itemId: ItemID,
    txn?: SQLite.SQLiteDatabase,
  ): Promise<void> {
    try {
      if ("valueNumber" in itemAttributeValue)
        await super.executeQuery(
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

  async insertMultiselectValue(
    itemAttributeValue: ItemAttributeValue,
    itemId: ItemID,
    txn?: SQLite.SQLiteDatabase,
  ): Promise<void> {
    try {
      if ("valueMultiselect" in itemAttributeValue)
        await super.executeQuery(
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

  async deleteItem(
    itemId: ItemID,
    txn?: SQLite.SQLiteDatabase,
  ): Promise<PageID> {
    try {
      const result = await super.fetchFirst<{ pageID: number }>(
        deleteItemQuery,
        [itemId],
        txn,
      );
      return pageID.parse(result?.pageID);
    } catch (error) {
      throw new RepositoryError("Failed to delete item.");
    }
  }

  async deleteItemValues(
    itemId: ItemID,
    txn?: SQLite.SQLiteDatabase,
  ): Promise<void> {
    try {
      await super.executeQuery(
        deleteItemAttributeValuesQuery,
        [itemId, itemId, itemId, itemId],
        txn,
      );
    } catch (error) {
      throw new RepositoryError("Failed to delete item value.");
    }
  }
}

export const itemRepository = new ItemRepositoryImpl();
