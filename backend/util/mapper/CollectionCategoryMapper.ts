import { collectionID } from "@/backend/domain/common/IDs";
import {
  categorySchema,
  CollectionCategory,
  collectionCategoryID,
  createNewCategorySchema,
  NewCollectionCategory,
} from "@/backend/domain/entity/CollectionCategory";
import { CollectionCategoryModel } from "@/backend/repository/model/CollectionCategoryModel";
import { CollectionCategoryDTO } from "@/shared/dto/CollectionCategoryDTO";

/**
 * Mapper class for converting between CollectionCategory domain entities, DTOs, and database models:
 * - Domain Entity → DTO
 * - Database Model → Domain Entity
 * - DTO → NewCollectionCategory (for creation)
 *
 * This utility handles transformations and validation using Zod schemas,
 * ensuring consistent data structures across layers.
 */

export class CollectionCategoryMapper {
  /**
   * Maps a CollectionCategory domain entity to a CollectionCategoryDTO.
   *
   * @param entity - The `CollectionCategory` domain entity.
   * @returns A corresponding `CollectionCategoryDTO` object.
   */
  static toDTO(entity: CollectionCategory): CollectionCategoryDTO {
    return {
      collectionCategoryID: entity.categoryID,
      category_name: entity.categoryName,
      collectionID: entity.collectionID,
    };
  }

  /**
   * Maps a CollectionCategoryDTO to a NewCollectionCategory entity, used when creating a new CollectionCategory.
   *
   * @param dto - The DTO containing all CollectionCategory fields.
   * @returns A validated `NewCollectionCategory` domain entity.
   * @throws Error if validation fails.
   */
  static toNewEntity(dto: CollectionCategoryDTO): NewCollectionCategory {
    try {
      const parsedDTO = createNewCategorySchema.parse({
        categoryName: dto.category_name,
      });
      return parsedDTO;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  /**
   * Maps a CollectionCategoryModel from the db to a CollectionCategory domain entity.
   *
   * @param model - The raw CollectionCategoryModel from the DB.
   * @returns A validated `CollectionCategory` domain entity.
   * @throws Error if validation fails.
   */
  static toEntity(model: CollectionCategoryModel): CollectionCategory {
    try {
      return categorySchema.parse({
        categoryID: collectionCategoryID.parse(model.collection_categoryID),
        categoryName: model.category_name,
        collectionID: collectionID.parse(model.collectionID),
      });
    } catch (error) {
      console.error("Error mapping CollectionCategoryModel to Entity:", error);
      throw error;
    }
  }
}
