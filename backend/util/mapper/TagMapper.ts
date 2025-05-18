import { TagDTO } from "@/shared/dto/TagDTO";
import {
  createNewTagSchema,
  NewTag,
  Tag,
  tagSchema,
} from "@/backend/domain/entity/Tag";
import { TagModel } from "@/backend/repository/model/TagModel";

/**
 * Mapper class for converting between Tag domain entities, DTOs, and database models:
 * - Domain Entity ↔ DTO
 * - Domain Entity ↔ Database Model
 * - DTO → NewTag (for creation)
 *
 * This utility handles transformations and validation using Zod schemas,
 * ensuring consistent data structures across layers.
 */

export class TagMapper {
  /**
   * Maps a Tag domain entity to a TagDTO.
   *
   * @param entity - The `Tag` domain entity.
   * @returns A corresponding `TagDTO` object.
   */
  static toDTO(entity: Tag): TagDTO {
    return {
      tagID: entity.tagID,
      tag_label: entity.tagLabel,
      usage_count: entity.usageCount,
    };
  }

  /**
   * Maps a Tag domain entity to a TagModel for persistence.
   *
   * @param entity - The `Tag` domain entity.
   * @returns A corresponding `TagModel` object.
   */
  static toModel(entity: Tag): TagModel {
    return {
      tagID: entity.tagID,
      tag_label: entity.tagLabel,
      usage_count: entity.usageCount,
    };
  }

  /**
   * Maps a TagDTO to a NewTag, used when creating a new tag.
   *
   * @param dto - The incoming DTO (from API, etc.).
   * @returns A validated `NewTag` object.
   * @throws Error if validation fails.
   */
  static toNewEntity(dto: TagDTO): NewTag {
    try {
      return createNewTagSchema.parse({
        tagLabel: dto.tag_label,
      });
    } catch (error: any) {
      console.error("Error mapping TagDTO to New Entity:", error.issues);
      throw new Error("Failed to map TagDTO to New Entity");
    }
  }

  /**
   * Maps a TagDTO to a fully defined Tag entity.
   *
   * @param dto - The DTO containing all tag fields.
   * @returns A validated `Tag` domain entity.
   * @throws Error if validation fails.
   */
  static toUpdatedEntity(dto: TagDTO): Tag {
    try {
      return tagSchema.parse({
        tagID: dto.tagID,
        tagLabel: dto.tag_label,
        usageCount: 0, // default value - not used for db persistence
      });
    } catch (error: any) {
      console.error("Error mapping TagDTO to Updatde Entity:", error.issues);
      throw new Error("Failed to map TagDTO to Updatde Entity");
    }
  }

  /**
   * Maps a TagModel from the db to a Tag domain entity.
   *
   * @param model - The raw TagModel from the DB.
   * @returns A validated `Tag` domain entity.
   * @throws Error if validation fails.
   */
  static toEntity(model: TagModel): Tag {
    try {
      return tagSchema.parse({
        tagID: model.tagID,
        tagLabel: model.tag_label,
        usageCount: model.usage_count,
      });
    } catch (error: any) {
      console.error("Error mapping TagModel to Entity:", error.issues);
      throw new Error("Failed to map TagModel to Entity");
    }
  }
}
