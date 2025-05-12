import { Item, ItemAttributeValue, ItemID } from "@/backend/domain/entity/Item";
import { BaseRepository } from "./BaseRepository.interface";
import { PageID } from "@/backend/domain/entity/GeneralPage";
import { CategoryID } from "@/backend/domain/entity/CollectionCategory";
import * as common from "../../domain/common/types";
import { z } from "zod";
import * as SQLite from "expo-sqlite";

export interface ItemRepository extends BaseRepository {
  getItemByID(itemId: ItemID): Promise<Item>;
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
  deleteItem(itemId: ItemID, txn?: SQLite.SQLiteDatabase): Promise<PageID>;
  deleteItemValues(itemId: ItemID, txn?: SQLite.SQLiteDatabase): Promise<void>;
}
