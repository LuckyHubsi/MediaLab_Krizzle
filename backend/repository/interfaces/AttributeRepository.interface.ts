import { NewAttribute } from "@/backend/domain/common/Attribute";
import { BaseRepository } from "./BaseRepository.interface";
import * as SQLite from "expo-sqlite";
import { AttributeID, ItemTemplateID } from "@/backend/domain/common/IDs";

/**
 * AttributeRepository defines CRUD operations for `Attribute` entities.
 *
 * Extends the base repository interface for common infrastructure.
 */
export interface AttributeRepository extends BaseRepository {
  insertAttribute(
    newAttribute: NewAttribute,
    templateID: ItemTemplateID,
    txn?: SQLite.SQLiteDatabase,
  ): Promise<AttributeID>;

  insertMultiselectOptions(
    options: string[],
    attributeID: AttributeID,
    txn?: SQLite.SQLiteDatabase,
  ): Promise<void>;

  insertRatingSymbol(
    symbol: string,
    attributeID: AttributeID,
    txn?: SQLite.SQLiteDatabase,
  ): Promise<void>;
}
