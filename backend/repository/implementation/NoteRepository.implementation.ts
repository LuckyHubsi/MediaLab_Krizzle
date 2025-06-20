import { NewNote, Note } from "@/backend/domain/entity/Note";
import { NoteRepository } from "../interfaces/NoteRepository.interface";
import { BaseRepositoryImpl } from "./BaseRepository.implementation";
import { NoteModel } from "../model/NoteModel";
import { updateDateModifiedByPageIDQuery } from "../query/GeneralPageQuery";
import { PageType } from "@/shared/enum/PageType";
import { NoteMapper } from "@/backend/util/mapper/NoteMapper";
import {
  insertNoteQuery,
  selectNoteByPageIDQuery,
  updateNoteContentQuery,
} from "../query/NoteQuery";
import { RepositoryError } from "@/backend/util/error/RepositoryError";
import * as common from "../../domain/common/types";
import { PageID } from "@/backend/domain/common/IDs";
import * as SQLite from "expo-sqlite";
import { GeneralPageRepositoryImpl } from "./GeneralPageRepository.implementation";

/**
 * Implementation of the NoteRepository interface using SQL queries.
 *
 * Handles the following operations:
 * - Fetching a note.
 * - Inserting a new note.
 * - Updating note content.
 */
export class NoteRepositoryImpl
  extends GeneralPageRepositoryImpl
  implements NoteRepository
{
  // constructor accepts database instace
  constructor(db: SQLite.SQLiteDatabase) {
    super(db);
  }

  /**
   * Retrieves a note from the database.
   *
   * @param pageId - The pageID of the note.
   * @returns A Promise resolving to a `Note` domain entity.
   * @throws RepositoryError if the fetch fails.
   */
  async getByPageId(pageId: PageID): Promise<Note> {
    try {
      const noteData = await this.fetchFirst<NoteModel>(
        selectNoteByPageIDQuery,
        [pageId],
      );
      if (!noteData || noteData.page_type !== PageType.Note) {
        throw new RepositoryError("Not Found");
      }
      return NoteMapper.toEntity(noteData);
    } catch (error) {
      throw new RepositoryError("Fetch Failed");
    }
  }

  /**
   * Inserts a note into the database.
   *
   * @param note - The note data to be inserted.
   * @param pageId - The pageID of the note.
   * @param txn - The DB instance the operation should be executed on if a transaction is ongoing.
   * @returns A Promise resolving to void.
   * @throws RepositoryError if the insert fails.
   */
  async insertNote(
    note: NewNote,
    pageId: PageID,
    txn?: SQLite.SQLiteDatabase,
  ): Promise<void> {
    try {
      await this.executeQuery(insertNoteQuery, [note.noteContent, pageId], txn);
    } catch (error) {
      throw new RepositoryError("Insert Failed");
    }
  }

  /**
   * Updates note content of a note.
   *
   * @param pageId - The pageID of the note.
   * @param newContent - The textual note content to be updated.
   * @param txn - The DB instance the operation should be executed on if a transaction is ongoing.
   * @returns A Promise resolving to true on success.
   * @throws RepositoryError if the update fails.
   */
  async updateContent(
    pageId: PageID,
    newContent: common.String50000,
    txn?: SQLite.SQLiteDatabase,
  ): Promise<boolean> {
    try {
      await this.executeQuery(
        updateNoteContentQuery,
        [newContent, pageId],
        txn,
      );
      return true;
    } catch (error) {
      throw new RepositoryError("Update Failed");
    }
  }
}
