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

/**
 * Mapper class for converting between Note domain entities, DTOs, and database models:
 * - Domain Entity ↔ DTO
 * - Domain Entity ↔ Database Model
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
    };
  }

  /**
   * Maps a Note domain entity to a NoteModel for persistence.
   *
   * @param entity - The `Note` domain entity.
   * @returns A corresponding `NoteModel` object.
   */
  static toModel(entity: Note): NoteModel {
    return {
      pageID: entity.pageID,
      page_type: entity.pageType,
      page_title: entity.pageTitle,
      page_icon: entity.pageIcon,
      page_color: entity.pageColor,
      date_created: entity.createdAt.toISOString(),
      date_modified: entity.updatedAt.toISOString(),
      archived: entity.archived ? 1 : 0,
      pinned: entity.pinned ? 1 : 0,
      tagID: entity.tag?.tagID ?? null,
      tag_label: entity.tag?.tagLabel,
      noteID: entity.noteID,
      note_content: entity.noteContent,
      pin_count: entity.pinCount,
    };
  }

  /**
   * Maps a NewNote domain entity to a NoteModel for persistence.
   *
   * @param entity - The `NewNote` domain entity.
   * @returns A corresponding `NoteModel` (ommited IDs and pin count) object.
   */
  static toInsertModel(
    entity: NewNote,
  ): Omit<NoteModel, "pageID" | "noteID" | "pin_count"> {
    return {
      page_type: entity.pageType,
      page_title: entity.pageTitle,
      page_icon: entity.pageIcon,
      page_color: entity.pageColor,
      date_created: entity.createdAt.toISOString(),
      date_modified: entity.updatedAt.toISOString(),
      archived: entity.archived ? 1 : 0,
      pinned: entity.pinned ? 1 : 0,
      tagID: entity.tag?.tagID ?? null,
      tag_label: entity.tag?.tagLabel,
      note_content: entity.noteContent,
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
      const parsedDTO = createNewNote.parse({
        pageType: dto.page_type,
        pageTitle: dto.page_title,
        pageIcon: dto.page_icon,
        pageColor: dto.page_color,
        archived: dto.archived,
        pinned: dto.pinned,
        tag: dto.tag ? TagMapper.toUpdatedEntity(dto.tag) : null,
        noteContent: dto.note_content,
      });
      return parsedDTO;
    } catch (error) {
      console.error("Error mapping NoteDTO to New Entity:", error);
      throw new Error("Failed to map NoteDTO to New Entity");
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
      return noteSchema.parse({
        pageID: pageID.parse(model.pageID),
        pageType: model.page_type,
        pageTitle: model.page_title,
        pageIcon: model.page_icon,
        pageColor: model.page_color,
        archived: model.archived === 1,
        pinned: model.pinned === 1,
        tag:
          model.tagID && model.tag_label
            ? TagMapper.toEntity({
                tagID: model.tagID,
                tag_label: model.tag_label,
                usage_count: 0,
              })
            : null,
        createdAt: new Date(model.date_created),
        updatedAt: new Date(model.date_modified),
        noteID: model.noteID,
        noteContent: model.note_content,
        pinCount: model.pin_count,
      });
    } catch (error) {
      console.error("Error mapping NoteModel to Entity:", error);
      throw new Error("Failed to map NoteModel to Entity");
    }
  }
}
