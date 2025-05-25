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
import {
  RepositoryError,
  RepositoryErrorNew,
} from "@/backend/util/error/RepositoryError";
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
   * @throws RepositoryErrorNew if the fetch fails.
   */
  async getByPageId(pageId: PageID): Promise<Note> {
    try {
      const noteData = await this.fetchFirst<NoteModel>(
        selectNoteByPageIDQuery,
        [pageId],
      );
      if (!noteData || noteData.page_type !== PageType.Note) {
        throw new RepositoryErrorNew("Not Found");
      }
      return NoteMapper.toEntity(noteData);
    } catch (error) {
      throw new RepositoryErrorNew("Fetch Failed");
    }
  }

  /**
   * Inserts a note into the database.
   *
   * @param note - The note data to be inserted.
   * @param pageId - The pageID of the note.
   * @returns A Promise resolving to void.
   * @throws RepositoryErrorNew if the insert fails.
   */
  async insertNote(
    note: NewNote,
    pageId: PageID,
    txn?: SQLite.SQLiteDatabase,
  ): Promise<void> {
    try {
      await this.executeQuery(insertNoteQuery, [note.noteContent, pageId], txn);
    } catch (error) {
      throw new RepositoryErrorNew("Insert Failed");
    }
  }

  /**
   * Updates note content of a note.
   *
   * @param pageId - The pageID of the note.
   * @param newContent - The textual note content to be updated.
   * @returns A Promise resolving to true on success.
   * @throws RepositoryError if the query fails.
   */
  async updateContent(
    pageId: PageID,
    newContent: common.String50000,
  ): Promise<boolean> {
    try {
      await this.executeTransaction(async (txn) => {
        await this.executeQuery(
          updateNoteContentQuery,
          [newContent, pageId],
          txn,
        );
        await this.updateDateModified(pageId, txn);
      });
      return true;
    } catch (error) {
      console.error("Error updating note content:", error);
      throw new RepositoryError("Failed to update content.");
    }
  }
}
