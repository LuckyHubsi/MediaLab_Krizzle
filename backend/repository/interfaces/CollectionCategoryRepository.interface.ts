import * as SQLite from "expo-sqlite";
import { BaseRepository } from "./BaseRepository.interface";
import {
  CategoryID,
  CollectionCategory,
  NewCollectionCategory,
} from "@/backend/domain/entity/CollectionCategory";
import { CollectionID } from "@/backend/domain/common/IDs";

/**
 * CollectionCategoryRepository defines CRUD operations for `CollectionCategory` entities.
 *
 * Extends the base repository interface for common infrastructure.
 */
export interface CollectionCategoryRepository extends BaseRepository {
  insertCategory(
    category: NewCollectionCategory,
    collectionId: CollectionID,
    txn?: SQLite.SQLiteDatabase,
  ): Promise<void>;
  getCategoriesByCollectionID(
    collectionId: CollectionID,
  ): Promise<CollectionCategory[]>;
  updateCategory(
    category: NewCollectionCategory,
    categoryId: CategoryID,
    txn?: SQLite.SQLiteDatabase,
  ): Promise<boolean>;
  deleteCategory(categoryId: CategoryID): Promise<boolean>;
}
