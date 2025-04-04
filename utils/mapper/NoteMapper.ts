import { NoteDTO } from "@/dto/NoteDTO";
import { NoteModel } from "@/models/NoteModel";

export class NoteMapper {
    /**
 	* Converts a database model into a DTO for frontend communication.
 	* @param model - The NoteModel instance.
 	* @returns A NoteDTO representation.
 	*/
    static toDTO(model: NoteModel): NoteDTO {
        return {
            noteID: model.pageID ?? undefined,
            note_content: model.note_content
        };
    }

    /**
 	* Converts a DTO into a database model for storage.
 	* @param dto - The NoteDTO instance.
 	* @returns A NoteModel representation.
 	*/
    static toModel(dto: NoteDTO): NoteModel {
        return new NoteModel(
            dto.note_content,
            dto.noteID ?? undefined,
        );
    }
}