import {
  GeneralPage,
  NewGeneralPage,
  PageID,
} from "@/backend/domain/entity/GeneralPage";
import { BaseRepository } from "./BaseRepository.interface";
import * as SQLite from "expo-sqlite";

export interface GeneralPageRepository extends BaseRepository {
  getAllPagesSortedByModified(): Promise<GeneralPage[]>;
  getAllPagesSortedByAlphabet(): Promise<GeneralPage[]>;
  getAllPinnedPages(): Promise<GeneralPage[]>;
  getAllArchivedPages(): Promise<GeneralPage[]>;
  getByPageID(pageID: PageID): Promise<GeneralPage>;
  updateGeneralPageData(
    pageID: PageID,
    updatedPage: NewGeneralPage,
  ): Promise<boolean>;
  insertPage(
    page: NewGeneralPage,
    txn?: SQLite.SQLiteDatabase,
  ): Promise<number>;
  deletePage(pageID: PageID): Promise<boolean>;
}
