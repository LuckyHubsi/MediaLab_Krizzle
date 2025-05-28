import {
  Attribute,
  attributeSchema,
  createNewAttributeSchema,
  NewAttribute,
} from "@/backend/domain/common/Attribute";
import { AttributeModel } from "@/backend/repository/model/AttributeModel";
import { AttributeType } from "../../../shared/enum/AttributeType";
import { attributeID } from "@/backend/domain/common/IDs";
import { AttributeDTO } from "@/shared/dto/AttributeDTO";

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
  static toDTO(entity: Attribute): AttributeDTO {
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
   * Maps a AttributeDTO to a NewAttribute entity, used when creating a new attribute.
   *
   * @param dto - The DTO containing all attribute fields.
   * @returns A validated `NewAttribute` domain entity.
   * @throws Rethrow error if validation fails.
   */
  static toNewEntity(dto: AttributeDTO): NewAttribute {
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
      console.error(error);
      throw error;
    }
  }

  /**
   * Maps an AttributeDTO to a fully defined Attribute entity.
   *
   * @param dto - The DTO containing all attribute fields.
   * @returns A validated `Attribute` domain entity.
   * @throws Rethrows if validation fails.
   */
  static toUpdatedEntity(dto: AttributeDTO): Attribute {
    try {
      return attributeSchema.parse({
        attributeID: attributeID.parse(dto.attributeID),
        attributeLabel: dto.attributeLabel,
        type: dto.type as AttributeType,
        preview: dto.preview,
        options: dto.options,
        symbol: dto.symbol ?? null,
      });
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  /**
   * Maps a AttributeModel from the db to a Attribute domain entity.
   *
   * @param model - The raw AttributeModel from the DB.
   * @returns A validated `Attribute` domain entity.
   * @throws Rethrow Error if validation fails.
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
      console.error(error);
      throw error;
    }
  }
}
