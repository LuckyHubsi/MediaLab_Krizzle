import { Collection, NewCollection } from "@/backend/domain/entity/Collection";
import { BaseRepository } from "./BaseRepository.interface";
import { PageID } from "@/backend/domain/entity/GeneralPage";
import { ItemTemplateID } from "@/backend/domain/entity/ItemTemplate";
import * as SQLite from "expo-sqlite";
import { CollectionID } from "@/backend/domain/common/IDs";

export interface CollectionRepository extends BaseRepository {
  getCollection(pageID: PageID): Promise<Collection | null>;
  insertCollection(
    pageID: PageID,
    templateID: ItemTemplateID,
    txn?: SQLite.SQLiteDatabase,
  ): Promise<CollectionID>;
}
