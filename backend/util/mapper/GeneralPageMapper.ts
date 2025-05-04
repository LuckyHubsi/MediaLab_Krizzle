import {
  createNewGeneralPage,
  GeneralPage,
  generalPageSchema,
  NewGeneralPage,
  pageID,
} from "@/backend/domain/entity/GeneralPage";
import { GeneralPageModel } from "@/backend/repository/model/GeneralPageModel";
import { GeneralPageDTO } from "@/dto/GeneralPageDTO";
import { TagDTO } from "@/dto/TagDTO";
import { number } from "zod";
import { TagMapper } from "./TagMapper";

export class GeneralPageMapper {
  static toDTO(entity: GeneralPage): GeneralPageDTO {
    return {
      pageID: entity.pageID,
      page_type: entity.pageType,
      page_title: entity.pageTitle,
      page_icon: entity.pageIcon,
      page_color: entity.pageColor,
      archived: entity.archived,
      pinned: entity.pinned,
      tag: entity.tag ? TagMapper.toDTO(entity.tag) : null,
    };
  }

  static toModel(entity: GeneralPage): GeneralPageModel {
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
    };
  }

  static toNewEntity(dto: GeneralPageDTO): NewGeneralPage {
    try {
      const parsedDTO = createNewGeneralPage.parse({
        pageType: dto.page_type,
        pageTitle: dto.page_title,
        pageIcon: dto.page_icon,
        pageColor: dto.page_color,
        archived: dto.archived,
        pinned: dto.pinned,
        tag: dto.tag ? TagMapper.toNewEntity(dto.tag) : null,
      });
      return parsedDTO;
    } catch (error) {
      console.error("Error mapping GeneralPageDTO to New Entity:", error);
      throw new Error("Failed to map GeneralPageDTO to New Entity");
    }
  }

  static toEntity(model: GeneralPageModel): GeneralPage {
    try {
      return generalPageSchema.parse({
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
            })
          : null,
        createdAt: new Date(model.date_created),
        updatedAt: new Date(model.date_modified),
      });
    } catch (error) {
      console.error("Error mapping GeneralPageModel to Entity:", error);
      throw new Error("Failed to map GeneralPageModel to Entity");
    }
  }
}
