import { GeneralPageDTO } from "@/dto/GeneralPageDTO";
import { GeneralPageModel } from "@/models/GeneralPageModel";

export class GeneralPageMapper {
    static toDTO(model: GeneralPageModel): GeneralPageDTO {
        return {
            pageID: model.pageID ?? undefined,
            page_type: model.page_type,
            page_title: model.page_title,
            page_icon: model.page_icon,
            page_color: model.page_color,
            date_created: model.date_created,
            date_modified: model.date_modified,
            archived: model.archived === 1,
            pinned: model.pinned === 1
        };
    }

    static toModel(dto: GeneralPageDTO): GeneralPageModel {
        return new GeneralPageModel(
            dto.page_type,
            dto.page_title,
            dto.page_icon || "",
            dto.page_color || "",
            dto.date_created,
            dto.date_modified,
            dto.archived ? 1 : 0,
            dto.pinned ? 1 : 0,
            dto.pageID ?? undefined
        );
    }
}