import {
  GeneralPage,
  NewGeneralPage,
  PageID,
} from "@/backend/domain/entity/GeneralPage";
import { BaseRepository } from "./BaseRepository.interface";
import * as SQLite from "expo-sqlite";

export interface GeneralPageRepository extends BaseRepository {
  getAllPages(): Promise<GeneralPage[]>;
  insertPage(
    page: NewGeneralPage,
    txn?: SQLite.SQLiteDatabase,
  ): Promise<number>;
  deletePage(pageID: PageID): Promise<boolean>;
}
