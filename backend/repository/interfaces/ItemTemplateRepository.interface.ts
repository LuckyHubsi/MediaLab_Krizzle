import {
  ItemTemplate,
  ItemTemplateID,
  NewItemTemplate,
} from "@/backend/domain/entity/ItemTemplate";
import { BaseRepository } from "./BaseRepository.interface";
import * as SQLite from "expo-sqlite";

export interface ItemTemplateRepository extends BaseRepository {
  getItemTemplateById(
    itemTemplateID: ItemTemplateID,
    txn?: SQLite.SQLiteDatabase,
  ): Promise<ItemTemplate>;
}
