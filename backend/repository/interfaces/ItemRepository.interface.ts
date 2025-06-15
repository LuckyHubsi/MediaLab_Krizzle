import {
  Item,
  ItemAttributeValue,
  PreviewItem,
} from "@/backend/domain/entity/Item";
import { BaseRepository } from "./BaseRepository.interface";
import { CategoryID } from "@/backend/domain/entity/CollectionCategory";
import * as SQLite from "expo-sqlite";
import { AttributeID, ItemID, PageID } from "@/backend/domain/common/IDs";
import { Attribute } from "@/backend/domain/common/Attribute";

/**
 * ItemRepository defines CRUD operations for `Item` and `ItemAttributeValue` entities.
 *
 * Extends the base repository interface for common infrastructure.
 */
export interface ItemRepository extends BaseRepository {
  getItemByID(itemId: ItemID): Promise<Item>;
  getItemsByID(
    pageId: PageID,
    attributes: Attribute[],
    txn?: SQLite.SQLiteDatabase,
  ): Promise<PreviewItem[]>;
  insertItemAndReturnID(
    pageId: PageID,
    categoryId: CategoryID,
  ): Promise<ItemID>;
  insertTextValue(
    itemAttributeValue: ItemAttributeValue,
    itemId: ItemID,
    txn?: SQLite.SQLiteDatabase,
  ): Promise<void>;
  insertDateValue(
    itemAttributeValue: ItemAttributeValue,
    itemId: ItemID,
    txn?: SQLite.SQLiteDatabase,
  ): Promise<void>;
  insertRatingValue(
    itemAttributeValue: ItemAttributeValue,
    itemId: ItemID,
    txn?: SQLite.SQLiteDatabase,
  ): Promise<void>;
  insertMultiselectValue(
    itemAttributeValue: ItemAttributeValue,
    itemId: ItemID,
    txn?: SQLite.SQLiteDatabase,
  ): Promise<void>;
  insertImageValue(
    itemAttributeValue: ItemAttributeValue,
    itemId: ItemID,
    txn?: SQLite.SQLiteDatabase,
  ): Promise<void>;
  insertLinkValue(
    itemAttributeValue: ItemAttributeValue,
    itemId: ItemID,
    txn?: SQLite.SQLiteDatabase,
  ): Promise<void>;
  deleteItem(itemId: ItemID, txn?: SQLite.SQLiteDatabase): Promise<PageID>;
  deleteItemValues(itemId: ItemID, txn?: SQLite.SQLiteDatabase): Promise<void>;
  updateItem(
    itemId: ItemID,
    categoryId: CategoryID,
    txn?: SQLite.SQLiteDatabase,
  ): Promise<void>;
  updateTextValue(
    itemId: ItemID,
    attributeID: AttributeID,
    value: string | null,
    txn?: SQLite.SQLiteDatabase,
  ): Promise<void>;
  updateDateValue(
    itemId: ItemID,
    attributeID: AttributeID,
    value: string | null,
    txn?: SQLite.SQLiteDatabase,
  ): Promise<void>;
  updateRatingValue(
    itemId: ItemID,
    attributeID: AttributeID,
    value: number | null,
    txn?: SQLite.SQLiteDatabase,
  ): Promise<void>;
  updateMultiselectValue(
    itemId: ItemID,
    attributeID: AttributeID,
    value: string | null,
    txn?: SQLite.SQLiteDatabase,
  ): Promise<void>;
  updateImageValue(
    itemId: ItemID,
    attributeID: AttributeID,
    value: string | null,
    txn?: SQLite.SQLiteDatabase,
  ): Promise<void>;
  updateLinkValue(
    itemId: ItemID,
    attributeID: AttributeID,
    value: string | null,
    displayText: string | null,
    txn?: SQLite.SQLiteDatabase,
  ): Promise<void>;
  getItemIDs(pageId: PageID): Promise<ItemID[]>;
  getmageValuesByPageID(
    pageId: PageID,
    txn?: SQLite.SQLiteDatabase,
  ): Promise<string[]>;
  getMultiselectValues(
    itemID: ItemID,
    attributeID: AttributeID,
    txn?: SQLite.SQLiteDatabase,
  ): Promise<string[] | null>;
}
