import { TagDTO } from "@/dto/TagDTO";
import { TagModel } from "@/models/TagModel";

/**
 * Utility class for converting tag-related data between different layers.
 */
export class TagMapper {

  /**
   * Converts a TagModel into a TagDTO.
   *
   * @param model - The TagModel object to convert.
   * @returns A TagDTO representation of the tag.
   */
  static toDTO(model: TagModel): TagDTO {
    return {
      tagID: model.tagID,
      tag_label: model.tag_label,
    };
  }
}