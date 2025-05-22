import {
  GeneralPage,
  NewGeneralPage,
} from "@/backend/domain/entity/GeneralPage";
import { BaseRepository } from "./BaseRepository.interface";
import * as SQLite from "expo-sqlite";
import { PageID } from "@/backend/domain/common/IDs";

/**
 * GeneralPageRepository defines CRUD operations for `GeneralPage` entities.
 *
 * Extends the base repository interface for common infrastructure.
 */
export interface GeneralPageRepository extends BaseRepository {
  getAllPagesSortedByModified(): Promise<GeneralPage[]>;
  getAllPagesSortedByCreated(): Promise<GeneralPage[]>;
  getAllPagesSortedByAlphabet(): Promise<GeneralPage[]>;
  getAllPinnedPages(): Promise<GeneralPage[]>;
  getAllArchivedPages(): Promise<GeneralPage[]>;
  getByPageID(pageId: PageID): Promise<GeneralPage>;
  updateGeneralPageData(
    pageId: PageID,
    updatedPage: NewGeneralPage,
  ): Promise<boolean>;
  insertPage(
    page: NewGeneralPage,
    txn?: SQLite.SQLiteDatabase,
  ): Promise<PageID>;
  deletePage(pageId: PageID): Promise<boolean>;
  updatePin(pageId: PageID, currentPinStatus: boolean): Promise<boolean>;
  updateArchive(
    pageId: PageID,
    currentArchiveStatus: boolean,
  ): Promise<boolean>;
  updateDateModified(
    pageId: PageID,
    txn?: SQLite.SQLiteDatabase,
  ): Promise<void>;
  updateParentID(pageId: PageID, parentId: FolderID): Promise<boolean>;
}
