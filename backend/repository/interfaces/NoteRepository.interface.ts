import { PageID } from "@/backend/domain/entity/GeneralPage";
import { Note } from "../../domain/entity/Note";
import { BaseRepository } from "./BaseRepository.interface";
import * as SQLite from "expo-sqlite";
import * as common from "../../domain/common/types";

export interface NoteRepository extends BaseRepository {
  getByPageId(pageId: PageID): Promise<Note | null>;
  insertNote(
    note: Omit<Note, "pageID" | "noteID" | "createdAt" | "updatedAt">,
    pageId: PageID,
    txn?: SQLite.SQLiteDatabase,
  ): Promise<number | null>;
  updateContent(
    pageId: PageID,
    newContent: common.String20000,
  ): Promise<boolean>;
}
