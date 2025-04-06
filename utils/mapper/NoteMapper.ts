import { NoteDTO } from "@/dto/NoteDTO";
import { GeneralPageMapper } from "./GeneralPageMapper";
import { NoteModel } from "@/models/NoteModel";

/**
 * Utility class for converting general page data between different layers.
 */
export class NoteMapper extends GeneralPageMapper {

  /**
   * Converts a NoteModel into a NoteDTO.
   *
   * @param model - The GeneralPageModel object to convert.
   * @returns A GeneralPageDTO representation of the General Page Data.
   */
  static toDTO(model: NoteModel): NoteDTO {
    const generalPageDTO = super.toDTO(model);
    return {
      ...generalPageDTO,
      note_content: model.note_content ?? null,
    };
  }
}