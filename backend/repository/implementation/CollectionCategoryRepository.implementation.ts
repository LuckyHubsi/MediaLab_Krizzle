import {
  CategoryID,
  CollectionCategory,
  NewCollectionCategory,
} from "@/backend/domain/entity/CollectionCategory";
import { SQLiteDatabase } from "expo-sqlite";
import { CollectionCategoryRepository } from "../interfaces/CollectionCategoryRepository.interface";
import { BaseRepositoryImpl } from "./BaseRepository.implementation";
import { RepositoryError } from "@/backend/util/error/RepositoryError";
import {
  deleteCategoryQuery,
  insertCollectionCategoryQuery,
  selectCategoriesByCollectionIdQuery,
  updateCategoryQuery,
} from "../query/CollectionCategoryQuery";
import { CollectionID } from "@/backend/domain/common/IDs";
import { CollectionCategoryMapper } from "@/backend/util/mapper/CollectionCategoryMapper";
import { CollectionCategoryModel } from "../model/CollectionCategoryModel";

export class CollectionCategoryRepositoryImpl
  extends BaseRepositoryImpl
  implements CollectionCategoryRepository
{
  async insertCategory(
    category: NewCollectionCategory,
    collectionId: CollectionID,
    txn?: SQLiteDatabase,
  ): Promise<void> {
    try {
      await super.executeQuery(
        insertCollectionCategoryQuery,
        [category.categoryName, collectionId],
        txn,
      );
    } catch (error) {
      throw new RepositoryError("Failed to insert category.");
    }
  }

  async getCategoriesByCollectionID(
    collectionId: CollectionID,
    txn?: SQLiteDatabase,
  ): Promise<CollectionCategory[]> {
    try {
      const categories = await super.fetchAll<CollectionCategoryModel>(
        selectCategoriesByCollectionIdQuery,
        [collectionId],
        txn,
      );
      return categories.map(CollectionCategoryMapper.toEntity);
    } catch (error) {
      throw new RepositoryError("Failed to retrieve categories.");
    }
  }

  async updateCategory(
    category: NewCollectionCategory,
    categoryId: CategoryID,
  ): Promise<boolean> {
    try {
      await super.executeQuery(updateCategoryQuery, [
        category.categoryName,
        categoryId,
      ]);
      return true;
    } catch (error) {
      throw new RepositoryError("Failed to update category.");
    }
  }

  async deleteCategory(categoryId: CategoryID): Promise<boolean> {
    try {
      await super.executeQuery(deleteCategoryQuery, [categoryId]);
      return true;
    } catch (error) {
      throw new RepositoryError("Failed to delete category.");
    }
  }
}

export const categoryRepository = new CollectionCategoryRepositoryImpl();
