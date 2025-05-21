import { CollectionRepository } from "../interfaces/CollectionRepository.interface";
import { BaseRepositoryImpl } from "./BaseRepository.implementation";
import { CollectionModel } from "../model/CollectionModel";
import { PageType } from "@/shared/enum/PageType";
import { CollectionMapper } from "@/backend/util/mapper/CollectionMapper";
import { Collection } from "@/backend/domain/entity/Collection";
import { RepositoryError } from "@/backend/util/error/RepositoryError";
import { collectionSelectByPageIdQuery, insertCollectionQuery } from "../query/CollectionQuery";
import * as SQLite from "expo-sqlite";
import {
  collectionID,
  CollectionID,
  ItemTemplateID,
  PageID,
} from "@/backend/domain/common/IDs";

/**
 * Implementation of the CollectionRepository interface using SQL queries.
 *
 * Handles the following operations:
 * - Inserting a new collection.
 * - Fetching a collection.
 */
export class CollectionRepositoryImpl
  extends BaseRepositoryImpl
  implements CollectionRepository
{
  /**
   * Fetch a collection.
   *
   * @param pageID - A `PageID` representing the page ID the collection belongs to.
   * @returns A Promise resolving to `Collection`.
   * @throws RepositoryError if the query fails.
   */
  async getCollection(pageID: PageID): Promise<Collection> {
    try {
      const collectionData = await this.fetchFirst<CollectionModel>(
        collectionSelectByPageIdQuery,
        [pageID],
      );
      if (!collectionData || collectionData.page_type !== PageType.Collection) {
        throw new RepositoryError("Failed to fetch page.");
      }
      return CollectionMapper.toEntity(collectionData);
    } catch (error) {
      throw new RepositoryError("Failed to fetch page.");
    }
  }

  /**
   * Insert a collection.
   *
   * @param pageID - A `PageID` representing the page ID the collection belongs to.
   * @param templateId - A `ItemTemplateID` representing the template ID the collection uses.
   * @param txn - The DB instance the operation should be executed on if a transaction is ongoing.
   * @returns A Promise resolving to void.
   * @throws RepositoryError if the query fails.
   */
  async insertCollection(
    pageId: PageID,
    templateId: ItemTemplateID,
    txn?: SQLite.SQLiteDatabase,
  ): Promise<CollectionID> {
    try {
      const collectionId: number = await this.executeTransaction<number>(
        async (transaction) => {
          await this.executeQuery(
            insertCollectionQuery,
            [pageId, templateId],
            txn ?? transaction,
          );

          const lastInsertedID = await this.getLastInsertId(txn ?? transaction);
          return lastInsertedID;
        },
      );
      return collectionID.parse(collectionId);
    } catch (error) {
      throw new RepositoryError("Failed to insert collection.");
    }
  }
}

// Singleton instance of the CollectionRepository implementation.
export const collectionRepository = new CollectionRepositoryImpl();
