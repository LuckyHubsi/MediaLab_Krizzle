import { NoteDTO } from "@/dto/NoteDTO";
import { noteRepository } from "../repository/implementation/NoteRepository.implementation";
import { NoteRepository } from "../repository/interfaces/NoteRepository.interface";
import { GeneralPageRepository } from "../repository/interfaces/GeneralPageRepository.interface";
import { generalPageRepository } from "../repository/implementation/GeneralPageRepository.implementation";
import { NoteMapper } from "../util/mapper/NoteMapper";
import { pageID } from "../domain/entity/GeneralPage";
import { ServiceError } from "../util/error/ServiceError";
import * as common from "../domain/common/types";

export class NoteService {
  constructor(
    private noteRepo: NoteRepository = noteRepository,
    private generalPageRepo: GeneralPageRepository = generalPageRepository,
  ) {}

  async getNoteByPageId(pageId: number): Promise<NoteDTO> {
    try {
      const note = await this.noteRepo.getByPageId(pageID.parse(pageId));
      if (!note) {
        throw new ServiceError("Note not found.");
      }
      return NoteMapper.toDTO(note);
    } catch (error) {
      throw new ServiceError("Failed to retrieve note.");
    }
  }

  async insertNoteData(noteDTO: NoteDTO): Promise<number> {
    try {
      const note = NoteMapper.toNewEntity(noteDTO);
      const pageId = await this.noteRepo.executeTransaction<number>(
        async (txn) => {
          const retrivedPageID = await this.generalPageRepo.insertPage(
            note,
            txn,
          );
          const brandedPageID = pageID.parse(retrivedPageID);
          await this.noteRepo.insertNote(note, brandedPageID, txn);
          return retrivedPageID;
        },
      );
      return pageId;
    } catch (error) {
      throw new ServiceError("Failed to insert note data.");
    }
  }

  async updateNoteContent(pageId: number, newContent: string): Promise<void> {
    try {
      if (newContent === null) {
        throw new ServiceError("Content cannot be null.");
      }
      const parsedContent = common.string20000.parse(newContent);
      await this.noteRepo.updateContent(pageID.parse(pageId), parsedContent);
    } catch (error) {
      throw new ServiceError("Failed to update note content.");
    }
  }
}

export const noteService = new NoteService();
