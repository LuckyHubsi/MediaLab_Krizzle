import { NewCollectionCategory } from "@/backend/domain/entity/CollectionCategory";
import { SQLiteDatabase } from "expo-sqlite";
import { CollectionCategoryRepository } from "../interfaces/CollectionCategoryRepository.interface";
import { BaseRepositoryImpl } from "./BaseRepository.implementation";
import { RepositoryError } from "@/backend/util/error/RepositoryError";
import { insertCollectionCategoryQuery } from "../query/CollectionCategoryQuery";
import { CollectionID } from "@/backend/domain/common/IDs";

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
}

export const categoryRepository = new CollectionCategoryRepositoryImpl();
