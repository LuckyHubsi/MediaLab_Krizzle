import {
  createNewNote,
  NewNote,
  Note,
  noteSchema,
} from "@/backend/domain/entity/Note";
import { NoteDTO } from "@/shared/dto/NoteDTO";
import { TagMapper } from "./TagMapper";
import { NoteModel } from "@/backend/repository/model/NoteModel";
import { pageID } from "@/backend/domain/common/IDs";
import { GeneralPageMapper } from "./GeneralPageMapper";

/**
 * Mapper class for converting between Note domain entities, DTOs, and database models:
 * - Domain Entity ↔ DTO
 * - Database Model → Domain Entity
 *
 * This utility handles transformations and validation using Zod schemas,
 * ensuring consistent data structures across layers.
 */

export class NoteMapper {
  /**
   * Maps a Note domain entity to a NoteDTO.
   *
   * @param entity - The `Note` domain entity.
   * @returns A corresponding `NoteDTO` object.
   */
  static toDTO(entity: Note): NoteDTO {
    return {
      pageID: entity.pageID,
      page_type: entity.pageType,
      page_title: entity.pageTitle,
      page_icon: entity.pageIcon,
      page_color: entity.pageColor,
      archived: entity.archived,
      pinned: entity.pinned,
      tag: entity.tag ? TagMapper.toDTO(entity.tag) : null,
      noteID: entity.noteID,
      note_content: entity.noteContent,
      pin_count: entity.pinCount,
      parentID: entity.parentID,
    };
  }

  /**
   * Maps a NoteDTO to a NewNote entity, used when creating a new note.
   *
   * @param dto - The DTO containing all note fields.
   * @returns A validated `NewNote` domain entity.
   * @throws Error if validation fails.
   */
  static toNewEntity(dto: NoteDTO): NewNote {
    try {
      const generalPage = GeneralPageMapper.toNewEntity(dto);
      const parsedDTO = createNewNote.parse({
        ...generalPage,
        noteContent: dto.note_content,
      });
      return parsedDTO;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  /**
   * Maps a NoteModel from the db to a Note domain entity.
   *
   * @param model - The raw NoteModel from the DB.
   * @returns A validated `Note` domain entity.
   * @throws Error if validation fails.
   */
  static toEntity(model: NoteModel): Note {
    try {
      const generalPage = GeneralPageMapper.toEntity(model);
      return noteSchema.parse({
        ...generalPage,
        noteID: model.noteID,
        noteContent: model.note_content,
        pinCount: model.pin_count,
      });
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
