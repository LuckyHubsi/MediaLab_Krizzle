import { NewNote, Note } from "../../domain/entity/Note";
import { BaseRepository } from "./BaseRepository.interface";
import * as SQLite from "expo-sqlite";
import * as common from "../../domain/common/types";
import { PageID } from "@/backend/domain/common/IDs";
import { GeneralPageRepository } from "./GeneralPageRepository.interface";

/**
 * NoteRepository defines CRUD operations for `Note` entities.
 *
 * Extends the generalPage repository interface for common infrastructure.
 */
export interface NoteRepository extends GeneralPageRepository {
  getByPageId(pageId: PageID): Promise<Note>;
  insertNote(
    note: NewNote,
    pageId: PageID,
    txn?: SQLite.SQLiteDatabase,
  ): Promise<void>;
  updateContent(
    pageId: PageID,
    newContent: common.String50000,
    txn?: SQLite.SQLiteDatabase,
  ): Promise<boolean>;
}
