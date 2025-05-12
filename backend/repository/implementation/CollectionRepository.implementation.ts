import { PageID } from "@/backend/domain/entity/GeneralPage";
import { CollectionRepository } from "../interfaces/CollectionRepository.interface";
import { BaseRepositoryImpl } from "./BaseRepository.implementation";
import { CollectionModel } from "../model/CollectionModel";
import { collectionSelectByPageIdQuery } from "@/queries/CollectionQuery";
import { PageType } from "@/shared/enum/PageType";
import { CollectionMapper } from "@/backend/util/mapper/CollectionMapper";
import { Collection, NewCollection } from "@/backend/domain/entity/Collection";
import { RepositoryError } from "@/backend/util/error/RepositoryError";
import { ItemTemplateID } from "@/backend/domain/entity/ItemTemplate";
import { insertCollectionQuery } from "../query/CollectionQuery";
import * as SQLite from "expo-sqlite";
import { collectionID, CollectionID } from "@/backend/domain/common/IDs";

export class CollectionRepositoryImpl
  extends BaseRepositoryImpl
  implements CollectionRepository
{
  async getCollection(pageID: PageID): Promise<Collection | null> {
    try {
      const collectionData = await this.fetchFirst<CollectionModel>(
        collectionSelectByPageIdQuery,
        [pageID],
      );
      if (!collectionData || collectionData.page_type !== PageType.Collection) {
        return null;
      }
      return CollectionMapper.toEntity(collectionData);
    } catch (error) {
      throw new RepositoryError("Failed to fetch page.");
    }
  }

  async insertCollection(
    pageId: PageID,
    templateId: ItemTemplateID,
    txn?: SQLite.SQLiteDatabase,
  ): Promise<CollectionID> {
    try {
      const collectionId: number = await super.executeTransaction<number>(
        async () => {
          await super.executeQuery(
            insertCollectionQuery,
            [pageId, templateId],
            txn,
          );

          const lastInsertedID = await super.getLastInsertId(txn);
          return lastInsertedID;
        },
      );
      return collectionID.parse(collectionId);
    } catch (error) {
      throw new RepositoryError("Failed to insert collection.");
    }
  }
}

export const collectionRepository = new CollectionRepositoryImpl();
