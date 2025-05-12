import {
  createNewNote,
  NewNote,
  Note,
  noteID,
  noteSchema,
} from "@/backend/domain/entity/Note";
import { NoteDTO } from "@/dto/NoteDTO";
import { TagMapper } from "./TagMapper";
import { NoteModel } from "@/backend/repository/model/NoteModel";
import { pageID } from "@/backend/domain/entity/GeneralPage";

export class NoteMapper {
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

  static toInsertModel(entity: NewNote): NoteModel {
    return {
      pageID: 0,
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
      noteID: 0,
      note_content: entity.noteContent,
      pin_count: 0,
    };
  }

  static toNewEntity(dto: NoteDTO): NewNote {
    try {
      const parsedDTO = createNewNote.parse({
        pageType: dto.page_type,
        pageTitle: dto.page_title,
        pageIcon: dto.page_icon,
        pageColor: dto.page_color,
        archived: dto.archived,
        pinned: dto.pinned,
        tag: dto.tag ? TagMapper.toNewEntity(dto.tag) : null,
        noteContent: dto.note_content,
      });
      return parsedDTO;
    } catch (error) {
      console.error("Error mapping NoteDTO to New Entity:", error);
      throw new Error("Failed to map NoteDTO to New Entity");
    }
  }

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
        tag: model.tagID
          ? TagMapper.toEntity({
              tagID: model.tagID,
              tag_label: model.tag_label!,
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
