import { executeQuery, fetchAll } from "@/utils/QueryHelper";
import { CollectionCategoryDTO } from "@/dto/CollectionCategoryDTO";
import {
  insertCollectionCategoryQuery,
  selectCategoriesByCollectionIdQuery,
} from "@/queries/CollectionCategoryQuery";
import { CollectionCategoryModel } from "@/models/CollectionCategoryModel";
import { CollectionCategoryMapper } from "@/utils/mapper/CollectionCategoryMapper";
import * as SQLite from "expo-sqlite";
import { DatabaseError } from "@/utils/DatabaseError";

class CollectionCategoryService {
  /**
   * Inserts a new collection category into the database.
   *
   * @param {CollectionCategoryDTO} categoryDTO - The DTO representing the category to insert.
   * @param {SQLite.SQLiteDatabase} [txn] - Optional SQLite transaction object when its called inside a transaction.
   * @returns {Promise<void>} A promise that resolves to void upon successful insertion.
   * @throws {DatabaseError} If there is an error during the insertion.
   */
  public insertCollectionCategory = async (
    categoryDTO: CollectionCategoryDTO,
    txn?: SQLite.SQLiteDatabase,
  ): Promise<void> => {
    try {
      await executeQuery(
        insertCollectionCategoryQuery,
        [categoryDTO.category_name, categoryDTO.collectionID],
        txn,
      );
    } catch (error) {
      throw new DatabaseError("Error inserting list:", error);
    }
  };

  /**
   * Retrieves all collection categories for a given collection ID.
   *
   * @param {number} collectionID - The ID of the collection.
   * @param {SQLite.SQLiteDatabase} [txn] - Optional SQLite transaction object.
   * @returns {Promise<CollectionCategoryDTO[]>} A promise that resolves to an array of CollectionCategoryDTO objects.
   * @throws {DatabaseError} If there is an error during the fetch.
   */
  public getCollectionCategories = async (
    collectionID: number,
    txn?: SQLite.SQLiteDatabase,
  ): Promise<CollectionCategoryDTO[]> => {
    try {
      const categories = await fetchAll<CollectionCategoryModel>(
        selectCategoriesByCollectionIdQuery,
        [collectionID],
        txn,
      );
      return categories.map(CollectionCategoryMapper.toDTO);
    } catch (error) {
      throw new DatabaseError("Failed to retrieve collection categories");
    }
  };
}

export const collectionCategoryService = new CollectionCategoryService();
