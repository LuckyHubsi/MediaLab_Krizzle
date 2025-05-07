import { GeneralPageDTO } from "@/dto/GeneralPageDTO";
import { TagDTO } from "@/dto/TagDTO";
import { GeneralPageModel } from "@/models/GeneralPageModel";

/**
 * Utility class for converting general page data between different layers.
 */
export class GeneralPageMapper {
  /**
   * Converts a GeneralPageModel into a GeneralPageDTO.
   *
   * @param model - The GeneralPageModel object to convert.
   * @returns A GeneralPageDTO representation of the General Page Data.
   */
  static toDTO(model: GeneralPageModel): GeneralPageDTO {
    const tag: TagDTO | null = model.tag_label
      ? {
          tagID: model.tagID ?? 0,
          tag_label: model.tag_label,
        }
      : null;

    return {
      pageID: model.pageID,
      page_type: model.page_type,
      page_title: model.page_title,
      page_icon: model.page_icon ?? undefined,
      page_color: model.page_color ?? undefined,
      archived: model.archived === 1,
      pinned: model.pinned === 1,
      tag,
      pin_count: model.pin_count,
    };
  }
}
