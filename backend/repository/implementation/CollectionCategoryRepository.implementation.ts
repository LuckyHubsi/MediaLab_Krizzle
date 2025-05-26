import {
  CategoryID,
  CollectionCategory,
  NewCollectionCategory,
} from "@/backend/domain/entity/CollectionCategory";
import { SQLiteDatabase } from "expo-sqlite";
import { CollectionCategoryRepository } from "../interfaces/CollectionCategoryRepository.interface";
import { BaseRepositoryImpl } from "./BaseRepository.implementation";
import {
  RepositoryError,
  RepositoryErrorNew,
} from "@/backend/util/error/RepositoryError";
import {
  deleteCategoryQuery,
  insertCollectionCategoryQuery,
  selectCategoriesByCollectionIdQuery,
  updateCategoryQuery,
} from "../query/CollectionCategoryQuery";
import { CollectionID } from "@/backend/domain/common/IDs";
import { CollectionCategoryMapper } from "@/backend/util/mapper/CollectionCategoryMapper";
import { CollectionCategoryModel } from "../model/CollectionCategoryModel";
import * as SQLite from "expo-sqlite";

/**
 * Implementation of the CollectionCategoryRepository interface using SQL queries.
 *
 * Handles the following operations:
 * - Inserting a new category.
 * - Fetching all categories.
 * - Updating an existing category.
 * - Deleting a category by ID.
 */
export class CollectionCategoryRepositoryImpl
  extends BaseRepositoryImpl
  implements CollectionCategoryRepository
{
  // constructor accepts database instace
  constructor(db: SQLite.SQLiteDatabase) {
    super(db);
  }

  /**
   * Insert a collection category.
   *
   * @param category - A `NewCollectionCategory` with a label to save.
   * @param collectionId - A `CollectionID` representing the collection it belongs to.
   * @param txn - The DB instance the operation should be executed on if a transaction is ongoing.
   * @returns A Promise resolving to void.
   * @throws RepositoryErrorNew if the insert fails.
   */
  async insertCategory(
    category: NewCollectionCategory,
    collectionId: CollectionID,
    txn?: SQLiteDatabase,
  ): Promise<void> {
    try {
      await this.executeQuery(
        insertCollectionCategoryQuery,
        [category.categoryName, collectionId],
        txn,
      );
    } catch (error) {
      throw new RepositoryErrorNew("Insert Failed");
    }
  }

  /**
   * Retrieves all categories of a collection from the database.
   *
   * @param collectionId - A `CollectionID` representing the collection it belongs to.
   * @returns A Promise resolving to an array of `CollectionCategory`.
   * @throws RepositoryErrorNew if the fetch fails.
   */
  async getCategoriesByCollectionID(
    collectionId: CollectionID,
  ): Promise<CollectionCategory[]> {
    try {
      const categories = await this.fetchAll<CollectionCategoryModel>(
        selectCategoriesByCollectionIdQuery,
        [collectionId],
      );
      return categories.map(CollectionCategoryMapper.toEntity);
    } catch (error) {
      throw new RepositoryErrorNew("Fetch Failed");
    }
  }

  /**
   * Update a collection category.
   *
   * @param category - A `NewCollectionCategory` with a label to save.
   * @param categoryId - A `CollectionCategoryID` representing the category ID.
   * @returns A Promise resolving to true on success.
   * @throws RepositoryError if the query fails.
   */
  async updateCategory(
    category: NewCollectionCategory,
    categoryId: CategoryID,
  ): Promise<boolean> {
    try {
      await this.executeQuery(updateCategoryQuery, [
        category.categoryName,
        categoryId,
      ]);
      return true;
    } catch (error) {
      throw new RepositoryError("Failed to update category.");
    }
  }

  /**
   * Delete a collection category.
   *
   * @param categoryId - A `CollectionCategoryID` representing the category ID.
   * @returns A Promise resolving to true on success.
   * @throws RepositoryError if the query fails.
   */
  async deleteCategory(categoryId: CategoryID): Promise<boolean> {
    try {
      await this.executeQuery(deleteCategoryQuery, [categoryId]);
      return true;
    } catch (error) {
      throw new RepositoryError("Failed to delete category.");
    }
  }
}
