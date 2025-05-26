import { NoteDTO } from "@/shared/dto/NoteDTO";
import { NoteRepository } from "../repository/interfaces/NoteRepository.interface";
import { NoteMapper } from "../util/mapper/NoteMapper";
import { ServiceError } from "../util/error/ServiceError";
import * as common from "../domain/common/types";
import { pageID } from "../domain/common/IDs";
import { ServiceErrorType } from "@/shared/error/ServiceError";
import { failure, Result, success } from "@/shared/result/Result";
import { RepositoryErrorNew } from "../util/error/RepositoryError";
import { NoteErrorMessages } from "@/shared/error/ErrorMessages";
import { ZodError } from "zod";

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
  constructor(private noteRepo: NoteRepository) {}

  /**
   * Fetch a note by page ID.
   *
   * @param pageId - Number representing page ID.
   * @returns A Promise resolving to a `Result` containing either a `NoteDTO` or a `ServiceErrorType`.
   */
  async getNoteDataByPageID(
    pageId: number,
  ): Promise<Result<NoteDTO, ServiceErrorType>> {
    try {
      const brandedPageID = pageID.parse(pageId);
      const note = await this.noteRepo.getByPageId(brandedPageID);
      return success(NoteMapper.toDTO(note));
    } catch (error) {
      if (
        error instanceof ZodError ||
        (error instanceof RepositoryErrorNew && error.type === "Not Found")
      ) {
        return failure({
          type: "Not Found",
          message: NoteErrorMessages.notFound,
        });
      } else if (
        error instanceof RepositoryErrorNew &&
        error.type === "Fetch Failed"
      ) {
        return failure({
          type: "Retrieval Failed",
          message: NoteErrorMessages.loadingNote,
        });
      } else {
        return failure({
          type: "Unknown Error",
          message: NoteErrorMessages.unknown,
        });
      }
    }
  }

  /**
   * Insert a note.
   *
   * @param noteDTO - Note data to be inserted.
   * @returns A Promise resolving to a `Result` containing either a `number` (new pageID) or a `ServiceErrorType`.
   */
  async insertNote(
    noteDTO: NoteDTO,
  ): Promise<Result<number, ServiceErrorType>> {
    try {
      const note = NoteMapper.toNewEntity(noteDTO);
      const pageId = await this.noteRepo.executeTransaction<number>(
        async (txn) => {
          const retrievedPageID = await this.noteRepo.insertPage(note, txn);
          await this.noteRepo.insertNote(note, retrievedPageID, txn);
          return retrievedPageID;
        },
      );
      return success(pageId);
    } catch (error) {
      if (error instanceof ZodError) {
        return failure({
          type: "Validation Error",
          message: NoteErrorMessages.validateNewNote,
        });
      } else if (
        (error instanceof RepositoryErrorNew &&
          error.type === "Insert Failed") ||
        (error instanceof RepositoryErrorNew &&
          error.type === "Transaction Failed")
      ) {
        return failure({
          type: "Creation Failed",
          message: NoteErrorMessages.insertNewNote,
        });
      } else {
        return failure({
          type: "Unknown Error",
          message: NoteErrorMessages.unknown,
        });
      }
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
