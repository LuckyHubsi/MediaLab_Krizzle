import {
  Collection,
  collectionSchema,
  createNewCollectionSchema,
  NewCollection,
} from "@/backend/domain/entity/Collection";
import { CollectionDTO } from "@/shared/dto/CollectionDTO";
import { TagMapper } from "./TagMapper";
import { CollectionCategoryMapper } from "./CollectionCategoryMapper";
import { CollectionModel } from "@/backend/repository/model/CollectionModel";
import {
  collectionID,
  itemTemplateID,
  pageID,
} from "@/backend/domain/common/IDs";

/**
 * Mapper class for converting between Collection domain entities, DTOs, and database models:
 * - Domain Entity → DTO
 * - Database Model ↔ Domain Entity
 * - DTO → NewCollection (for creation)
 *
 * This utility handles transformations and validation using Zod schemas,
 * ensuring consistent data structures across layers.
 */

export class CollectionMapper {
  /**
   * Maps a Collection domain entity to a CollectionDTO.
   *
   * @param entity - The `Collection` domain entity.
   * @returns A corresponding `CollectionDTO` object.
   */
  static toDTO(entity: Collection): CollectionDTO {
    return {
      pageID: entity.pageID,
      page_type: entity.pageType,
      page_title: entity.pageTitle,
      page_icon: entity.pageIcon,
      page_color: entity.pageColor,
      archived: entity.archived,
      pinned: entity.pinned,
      tag: entity.tag ? TagMapper.toDTO(entity.tag) : null,
      collectionID: entity.collectionID,
      templateID: entity.templateID,
      categories: entity.categories
        ? entity.categories.map(CollectionCategoryMapper.toDTO)
        : [],
      pin_count: entity.pinCount,
    };
  }

  /**
   * Maps a Collection domain entity to a CollectionModel for persistence.
   *
   * @param entity - The `Collection` domain entity.
   * @returns A corresponding `CollectionModel` object.
   */
  static toModel(entity: Collection): CollectionModel {
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
      collectionID: entity.collectionID,
      templateID: entity.templateID,
      categories: "", // placeholder since these categories are not used for persistence
      pin_count: entity.pinCount,
    };
  }

  /**
   * Maps a Collection domain entity to a CollectionModel for persistence.
   *
   * @param entity - The `Collection` domain entity.
   * @returns A corresponding `CollectionModel` (omits "collectionID",  "pageID",  "categories" and "pin_count") object for creation.
   */
  static toInsertModel(
    entity: NewCollection,
  ): Omit<
    CollectionModel,
    "collectionID" | "pageID" | "categories" | "pin_count"
  > {
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
      templateID: 0,
    };
  }

  /**
   * Maps a CollectionDTO to a NewCollection entity, used when creating a new Collection.
   *
   * @param dto - The DTO containing all Collection fields.
   * @returns A validated `NewCollection` domain entity.
   * @throws Error if validation fails.
   */
  static toNewEntity(dto: CollectionDTO): NewCollection {
    try {
      const parsedDTO = createNewCollectionSchema.parse({
        pageType: dto.page_type,
        pageTitle: dto.page_title,
        pageIcon: dto.page_icon,
        pageColor: dto.page_color,
        archived: dto.archived,
        pinned: dto.pinned,
        tag:
          dto.tag && dto.tag.tagID && dto.tag.tag_label
            ? TagMapper.toUpdatedEntity(dto.tag)
            : null,
        categories: dto.categories
          ? dto.categories.map(CollectionCategoryMapper.toNewEntity)
          : [],
      });
      return parsedDTO;
    } catch (error) {
      console.error("Error mapping CollectionDTO to New Entity");
      throw new Error("Failed to map CollectionDTO to New Entity");
    }
  }

  /**
   * Maps a CollectionModel from the db to a Collection domain entity.
   *
   * @param model - The raw CollectionModel from the DB.
   * @returns A validated `Collection` domain entity.
   * @throws Error if validation fails.
   */
  static toEntity(model: CollectionModel): Collection {
    try {
      console.log("model", JSON.stringify(model, null, 2));
      return collectionSchema.parse({
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
                tag_label: model.tag_label ?? "123",
                usage_count: 0, // placeholder since this value is not used for persistence
              })
            : null,
        createdAt: new Date(model.date_created),
        updatedAt: new Date(model.date_modified),
        collectionID: collectionID.parse(model.collectionID),
        templateID: itemTemplateID.parse(model.templateID),
        categories: model.categories
          ? JSON.parse(model.categories).map(CollectionCategoryMapper.toEntity)
          : [],
        pinCount: model.pin_count,
      });
    } catch (error) {
      console.error("Error mapping CollectionModel to Entity:", error);
      throw new Error("Failed to map CollectionModel to Entity");
    }
  }
}
