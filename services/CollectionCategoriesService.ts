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

/**
 * Inserts a new collection category into the database.
 *
 * @param {CollectionCategoryDTO} categoryDTO - The DTO representing the category to insert.
 * @returns {Promise<void>}  A promise that resolves to void.
 */
const insertCollectionCategory = async (
  categoryDTO: CollectionCategoryDTO,
  txn?: SQLite.SQLiteDatabase,
): Promise<void> => {
  try {
    console.log(categoryDTO);
    await executeQuery(
      insertCollectionCategoryQuery,
      [categoryDTO.category_name, categoryDTO.collectionID],
      txn,
    );
  } catch (error) {
    throw new DatabaseError("Error inserting list:", error);
  }
};

const getCollectionCategories = async (
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

export { insertCollectionCategory, getCollectionCategories };
