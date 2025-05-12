import { Collection } from "@/backend/domain/entity/Collection";
import { BaseRepository } from "./BaseRepository.interface";
import { PageID } from "@/backend/domain/entity/GeneralPage";

export interface CollectionRepository extends BaseRepository {
  getCollection(pageID: PageID): Promise<Collection | null>;
}
