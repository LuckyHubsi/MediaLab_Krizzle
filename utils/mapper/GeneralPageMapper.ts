import { GeneralPageDTO } from "@/dto/GeneralPageDTO";
import { GeneralPageModel } from "@/models/GeneralPageModel";

export class GeneralPageMapper {
    /**
 	* Converts a database model into a DTO for frontend communication.
 	* @param model - The GeneralPageModel instance.
 	* @returns A GeneralPageDTO representation.
 	*/
    static toDTO(model: GeneralPageModel): GeneralPageDTO {
        return {
            pageID: model.pageID ?? undefined,
            page_type: model.page_type,
            page_title: model.page_title,
            page_icon: model.page_icon,
            page_color: model.page_color,
            archived: model.archived === 1,
            pinned: model.pinned === 1
        };
    }

    /**
 	* Converts a DTO into a database model for storage.
 	* @param dto - The GeneralPageDTO instance.
 	* @returns A GeneralPageModel representation.
 	*/
    static toModel(dto: GeneralPageDTO): GeneralPageModel {
        return new GeneralPageModel(
            dto.page_type,
            dto.page_title,
            dto.page_icon || "",
            dto.page_color || "",
            dto.archived ? 1 : 0,
            dto.pinned ? 1 : 0,
            dto.pageID ?? undefined
        );
    }
}