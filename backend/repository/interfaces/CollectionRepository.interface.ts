import { Collection, NewCollection } from "@/backend/domain/entity/Collection";
import { BaseRepository } from "./BaseRepository.interface";
import * as SQLite from "expo-sqlite";
import {
  CollectionID,
  ItemTemplateID,
  PageID,
} from "@/backend/domain/common/IDs";

/**
 * CollectionRepository defines CRUD operations for `Collection` entities.
 *
 * Extends the base repository interface for common infrastructure.
 */
export interface CollectionRepository extends BaseRepository {
  getCollection(pageId: PageID): Promise<Collection>;
  insertCollection(
    pageId: PageID,
    templateID: ItemTemplateID,
    txn?: SQLite.SQLiteDatabase,
  ): Promise<CollectionID>;
}
