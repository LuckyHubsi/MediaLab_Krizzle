import {
  ItemTemplate,
  NewItemTemplate,
} from "@/backend/domain/entity/ItemTemplate";
import { BaseRepository } from "./BaseRepository.interface";
import * as SQLite from "expo-sqlite";
import { ItemTemplateID } from "@/backend/domain/common/IDs";

/**
 * ItemTemplateRepository defines CRUD operations for `ItemTemplate` entities.
 *
 * Extends the base repository interface for common infrastructure.
 */
export interface ItemTemplateRepository extends BaseRepository {
  getItemTemplateById(itemTemplateID: ItemTemplateID): Promise<ItemTemplate>;

  insertTemplateAndReturnID(
    itemTemplate: NewItemTemplate,
    txn?: SQLite.SQLiteDatabase,
  ): Promise<ItemTemplateID>;
}
