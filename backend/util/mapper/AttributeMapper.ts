import {
  Attribute,
  attributeSchema,
  createNewAttributeSchema,
  NewAttribute,
} from "@/backend/domain/common/Attribute";
import { AttributeModel } from "@/backend/repository/model/AttributeModel";
import { AttributeDTORestructure } from "@/dto/AttributeDTO";
import { AttributeType } from "../../../shared/enum/AttributeType";
import { attributeID } from "@/backend/domain/common/IDs";

/**
 * Mapper class for converting between Attribute domain entities, DTOs, and database models:
 * - Domain Entity → DTO
 * - Database Model → Domain Entity
 * - DTO → NewAttribute (for creation)
 *
 * This utility handles transformations and validation using Zod schemas,
 * ensuring consistent data structures across layers.
 */

export class AttributeMapper {
  /**
   * Maps an Attribute domain entity to an AttributeDTO.
   *
   * @param entity - The `Attribute` domain entity.
   * @returns A corresponding `AttributeDTO` object.
   */
  static toDTO(entity: Attribute): AttributeDTORestructure {
    return {
      attributeID: entity.attributeID,
      attributeLabel: entity.attributeLabel,
      type: entity.type,
      preview: entity.preview,
      options: entity.options ?? undefined,
      symbol: entity.symbol ?? undefined,
    };
  }

  /**
   * Maps an Attribute domain entity to an AttributeModel for persistence.
   *
   * @param entity - The `Attribute` domain entity.
   * @returns A corresponding `AttributeModel` (omits `attributeID`) object.
   */
  static toInsertModel(
    entity: NewAttribute,
  ): Omit<AttributeModel, "attributeID"> {
    return {
      attribute_label: entity.attributeLabel,
      type: entity.type,
      preview: entity.preview ? 1 : 0,
      options: entity.options ? JSON.stringify(entity.options) : null,
      symbol: entity.symbol ?? null,
    };
  }

  /**
   * Maps a AttributeDTO to a NewAttribute entity, used when creating a new attribute.
   *
   * @param dto - The DTO containing all attribute fields.
   * @returns A validated `NewAttribute` domain entity.
   * @throws Error if validation fails.
   */
  static toNewEntity(dto: AttributeDTORestructure): NewAttribute {
    try {
      const parsedDTO = createNewAttributeSchema.parse({
        attributeLabel: dto.attributeLabel,
        type: dto.type,
        preview: dto.preview,
        options: dto.options,
        symbol: dto.symbol,
      });
      return parsedDTO;
    } catch (error) {
      console.error("Error mapping AttributeDTO to New Entity.");
      throw new Error("Failed to map AttributeDTO to New Entity");
    }
  }

  /**
   * Maps a AttributeModel from the db to a Attribute domain entity.
   *
   * @param model - The raw AttributeModel from the DB.
   * @returns A validated `Attribute` domain entity.
   * @throws Error if validation fails.
   */
  static toEntity(model: AttributeModel): Attribute {
    try {
      return attributeSchema.parse({
        attributeID: attributeID.parse(model.attributeID),
        attributeLabel: model.attribute_label,
        type: model.type as AttributeType,
        preview: model.preview === 1,
        options: model.options ? JSON.parse(model.options) : null,
        symbol: model.symbol ?? null,
      });
    } catch (error) {
      console.error("Error mapping AttributeModel to Entity");
      throw new Error("Failed to map AttributeModel to Entity");
    }
  }
}
