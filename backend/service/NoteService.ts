import { NoteDTO } from "@/shared/dto/NoteDTO";
import { NoteRepository } from "../repository/interfaces/NoteRepository.interface";
import { GeneralPageRepository } from "../repository/interfaces/GeneralPageRepository.interface";
import { NoteMapper } from "../util/mapper/NoteMapper";
import { ServiceError } from "../util/error/ServiceError";
import * as common from "../domain/common/types";
import { pageID } from "../domain/common/IDs";

/**
 * NoteService encapsulates all note-related application logic.
 *
 * Responsibilities:
 * - Validates and maps incoming NoteDTOs.
 * - Delegates persistence operations to NoteRepository.
 * - Handles and wraps errors in service-specific error types.
 */
export class NoteService {
  // constructor accepts repo instaces
  constructor(
    private noteRepo: NoteRepository,
    private generalPageRepo: GeneralPageRepository,
  ) {}

  /**
   * Fetch a note by page ID.
   *
   * @param pageId - Number representing page ID.
   * @returns A Promise resolving to a `NoteDTO` object.
   * @throws ServiceError if retrieval fails.
   */
  async getNoteDataByPageID(pageId: number): Promise<NoteDTO> {
    try {
      const brandedPageID = pageID.parse(pageId);
      const note = await this.noteRepo.getByPageId(brandedPageID);
      return NoteMapper.toDTO(note);
    } catch (error) {
      throw new ServiceError("Failed to retrieve note.");
    }
  }

  /**
   * Insert a note.
   *
   * @param noteDTO - Note data to be inserted.
   * @returns A Promise resolving to a number (new pageID).
   * @throws ServiceError if insert fails.
   */
  async insertNote(noteDTO: NoteDTO): Promise<number> {
    try {
      const note = NoteMapper.toNewEntity(noteDTO);
      const pageId = await this.noteRepo.executeTransaction<number>(
        async (txn) => {
          const retrievedPageID = await this.generalPageRepo.insertPage(
            note,
            txn,
          );
          await this.noteRepo.insertNote(note, retrievedPageID, txn);
          return retrievedPageID;
        },
      );
      return pageId;
    } catch (error) {
      throw new ServiceError("Failed to insert note data.");
    }
  }

  /**
   * Insert a note.
   *
   * @param pageId - Number representing the pageID.
   * @param newContent - Textual content to be saved.
   * @returns A Promise resolving to void.
   * @throws ServiceError if uopdate fails.
   */
  async updateNoteContent(pageId: number, newContent: string): Promise<void> {
    try {
      if (newContent === null) {
        throw new ServiceError("Content cannot be null.");
      }
      const parsedContent = common.string50000.parse(newContent);
      const brandedPageID = pageID.parse(pageId);
      await this.noteRepo.updateContent(brandedPageID, parsedContent);
    } catch (error) {
      throw new ServiceError("Failed to update note content.");
    }
  }
}
