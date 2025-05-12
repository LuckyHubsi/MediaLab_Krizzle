import * as SQLite from "expo-sqlite";
import { BaseRepository } from "./BaseRepository.interface";
import {
  CategoryID,
  CollectionCategory,
  NewCollectionCategory,
} from "@/backend/domain/entity/CollectionCategory";
import { CollectionID } from "@/backend/domain/common/IDs";

export interface CollectionCategoryRepository extends BaseRepository {
  insertCategory(
    category: NewCollectionCategory,
    collectionId: CollectionID,
    txn?: SQLite.SQLiteDatabase,
  ): Promise<void>;
  getCategoriesByCollectionID(
    collectionId: CollectionID,
    txn?: SQLite.SQLiteDatabase,
  ): Promise<CollectionCategory[]>;
  updateCategory(
    category: NewCollectionCategory,
    categoryId: CategoryID,
  ): Promise<boolean>;
  deleteCategory(categoryId: CategoryID): Promise<boolean>;
}
