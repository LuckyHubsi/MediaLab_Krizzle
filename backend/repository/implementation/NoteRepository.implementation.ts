import { NewNote, Note } from "@/backend/domain/entity/Note";
import { NoteRepository } from "../interfaces/NoteRepository.interface";
import { BaseRepositoryImpl } from "./BaseRepository.implementation";
import { NoteModel } from "../model/NoteModel";
import { updateDateModifiedByPageIDQuery } from "../query/GeneralPageQuery";
import { PageType } from "@/backend/util/enum/PageType";
import { NoteMapper } from "@/backend/util/mapper/NoteMapper";
import {
  insertNoteQuery,
  selectNoteByPageIDQuery,
  updateNoteContentQuery,
} from "../query/NoteQuery";
import { PageID, pageID } from "@/backend/domain/entity/GeneralPage";
import { RepositoryError } from "@/backend/util/error/RepositoryError";
import * as common from "../../domain/common/types";

export class NoteRepositoryImpl
  extends BaseRepositoryImpl
  implements NoteRepository
{
  async getByPageId(pageId: PageID): Promise<Note | null> {
    try {
      const noteData = await this.fetchFirst<NoteModel>(
        selectNoteByPageIDQuery,
        [pageId],
      );
      if (!noteData || noteData.page_type !== PageType.Note) {
        return null;
      }
      return NoteMapper.toEntity(noteData);
    } catch (error) {
      throw new RepositoryError("Failed to fetch page.");
    }
  }

  async insertNote(note: NewNote, pageId: PageID): Promise<number | null> {
    try {
      await this.executeQuery(insertNoteQuery, [note.noteContent, pageId]);
      return pageId;
    } catch (error) {
      console.error("Error inserting note:", error);
      throw new RepositoryError("Failed to isnert note.");
    }
  }

  async updateContent(
    pageId: PageID,
    newContent: common.String20000,
  ): Promise<boolean> {
    try {
      await this.executeQuery(updateNoteContentQuery, [newContent, pageId]);
      await this.executeQuery(updateDateModifiedByPageIDQuery, [
        new Date().toISOString(),
        pageId,
      ]);
      return true;
    } catch (error) {
      console.error("Error updating note content:", error);
      throw new RepositoryError("Failed to update content.");
    }
  }
}

export const noteRepository = new NoteRepositoryImpl();
