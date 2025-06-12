import { CollectionRepository } from "../interfaces/CollectionRepository.interface";
import { BaseRepositoryImpl } from "./BaseRepository.implementation";
import { CollectionModel } from "../model/CollectionModel";
import { PageType } from "@/shared/enum/PageType";
import { CollectionMapper } from "@/backend/util/mapper/CollectionMapper";
import { Collection } from "@/backend/domain/entity/Collection";
import { RepositoryError } from "@/backend/util/error/RepositoryError";
import {
  collectionSelectByPageIdQuery,
  insertCollectionQuery,
} from "../query/CollectionQuery";
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
  // constructor accepts database instace
  constructor(db: SQLite.SQLiteDatabase) {
    super(db);
  }

  /**
   * Fetch a collection.
   *
   * @param pageID - A `PageID` representing the page ID the collection belongs to.
   * @returns A Promise resolving to `Collection`.
   * @throws RepositoryError if the fetch fails or if result is null.
   */
  async getCollection(pageID: PageID): Promise<Collection> {
    try {
      const collectionData = await this.fetchFirst<CollectionModel>(
        collectionSelectByPageIdQuery,
        [pageID],
      );
      if (!collectionData || collectionData.page_type !== PageType.Collection) {
        throw new RepositoryError("Not Found");
      }
      return CollectionMapper.toEntity(collectionData);
    } catch (error) {
      throw new RepositoryError("Fetch Failed");
    }
  }

  /**
   * Insert a collection.
   *
   * @param pageID - A `PageID` representing the page ID the collection belongs to.
   * @param templateId - A `ItemTemplateID` representing the template ID the collection uses.
   * @param txn - The DB instance the operation should be executed on if a transaction is ongoing.
   * @returns A Promise resolving to void.
   * @throws RepositoryError if the transaction fails.
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
      throw new RepositoryError("Insert Failed");
    }
  }
}
