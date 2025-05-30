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
import { GeneralPageMapper } from "./GeneralPageMapper";

/**
 * Mapper class for converting between Collection domain entities, DTOs, and database models:
 * - Domain Entity → DTO
 * - Database Model → Domain Entity
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
      parentID: entity.parentID,
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
      const generalPage = GeneralPageMapper.toNewEntity(dto);
      const categories =
        dto.categories?.length >= 1
          ? dto.categories.map(CollectionCategoryMapper.toNewEntity)
          : [
              CollectionCategoryMapper.toNewEntity({
                category_name: "General",
              }),
            ];

      const parsedDTO = createNewCollectionSchema.parse({
        ...generalPage,
        categories,
      });
      return parsedDTO;
    } catch (error) {
      console.error(error);
      throw error;
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
      const generalPage = GeneralPageMapper.toEntity(model);
      return collectionSchema.parse({
        ...generalPage,
        collectionID: collectionID.parse(model.collectionID),
        templateID: itemTemplateID.parse(model.templateID),
        categories: model.categories
          ? JSON.parse(model.categories).map(CollectionCategoryMapper.toEntity)
          : [],
        pinCount: model.pin_count,
      });
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
