import { PageID } from "@/backend/domain/entity/GeneralPage";
import { CollectionRepository } from "../interfaces/CollectionRepository.interface";
import { BaseRepositoryImpl } from "./BaseRepository.implementation";
import { CollectionModel } from "../model/CollectionModel";
import { collectionSelectByPageIdQuery } from "@/queries/CollectionQuery";
import { PageType } from "@/shared/enum/PageType";
import { CollectionMapper } from "@/backend/util/mapper/CollectionMapper";
import { Collection } from "@/backend/domain/entity/Collection";
import { RepositoryError } from "@/backend/util/error/RepositoryError";

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
}

export const collectionRepository = new CollectionRepositoryImpl();
