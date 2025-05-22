import {
  createNewGeneralPage,
  GeneralPage,
  generalPageSchema,
  NewGeneralPage,
} from "@/backend/domain/entity/GeneralPage";
import { GeneralPageModel } from "@/backend/repository/model/GeneralPageModel";
import { GeneralPageDTO } from "@/shared/dto/GeneralPageDTO";
import { TagDTO } from "@/shared/dto/TagDTO";
import { number } from "zod";
import { TagMapper } from "./TagMapper";
import { pageID } from "@/backend/domain/common/IDs";

/**
 * Mapper class for converting between GeneralPage domain entities, DTOs, and database models:
 * - Domain Entity → DTO
 * - Database Model ↔ Domain Entity
 * - DTO → NewGeneralPage (for creation)
 *
 * This utility handles transformations and validation using Zod schemas,
 * ensuring consistent data structures across layers.
 */

export class GeneralPageMapper {
  /**
   * Maps a GeneralPage domain entity to a GeneralPageDTO.
   *
   * @param entity - The `GeneralPage` domain entity.
   * @returns A corresponding `GeneralPageDTO` object.
   */
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
      parentID: entity.parentID ? entity.parentID : null,
    };
  }

  /**
   * Maps a GeneralPageDTO from the frontend to a GeneralPage domain entity.
   *
   * @param dto - The updated GeneralPageDTO from the frontend.
   * @returns A validated `GeneralPage` domain entity.
   * @throws Error if validation fails.
   */
  static toUpdatedEntity(dto: GeneralPageDTO): GeneralPage {
    try {
      const parsedDTO = generalPageSchema.parse({
        pageID: dto.pageID,
        pageType: dto.page_type,
        pageTitle: dto.page_title,
        pageIcon: dto.page_icon,
        pageColor: dto.page_color,
        createdAt: new Date(), // default since accurate dates are not needed here
        updatedAt: new Date(), // default since accurate dates are not needed here
        archived: dto.archived,
        pinned: dto.pinned,
        tag: dto.tag ? TagMapper.toUpdatedEntity(dto.tag) : null,
        parentID: dto.parentID ? dto.parentID : null,
      });
      return parsedDTO;
    } catch (error) {
      console.error("Error mapping GeneralPageDTO to Updated Entity:", error);
      throw new Error("Failed to map GeneralPageDTO to Updated Entity");
    }
  }

  /**
   * Maps a NewGeneralPage domain entity to a GeneralPageModel for persistence.
   *
   * @param entity - The `NewGeneralPage` domain entity.
   * @returns A corresponding `GeneralPageModel` (ommited pageID) object.
   */
  static toInsertModel(
    entity: NewGeneralPage,
  ): Omit<GeneralPageModel, "pageID"> {
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
      parentID: entity.parentID,
    };
  }

  /**
   * Maps a GeneralPageModel from the db to a GeneralPage domain entity.
   *
   * @param model - The raw GeneralPageModel from the DB.
   * @returns A validated `GeneralPage` domain entity.
   * @throws Error if validation fails.
   */
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
              usage_count: 0, // zero placeholder due to type enforcement
            })
          : null,
        createdAt: new Date(model.date_created),
        updatedAt: new Date(model.date_modified),
        parentID: model.parentID,
      });
    } catch (error) {
      console.error("Error mapping GeneralPageModel to Entity:", error);
      throw new Error("Failed to map GeneralPageModel to Entity");
    }
  }
}
