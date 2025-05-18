import {
  ItemTemplate,
  createNewItemTemplateSchema,
  NewItemTemplate,
  itemTemplateSchema,
} from "@/backend/domain/entity/ItemTemplate";
import { ItemTemplateDTO } from "@/shared/dto/ItemTemplateDTO";
import { ItemTemplateModel } from "@/backend/repository/model/ItemTemplateModel";
import { AttributeMapper } from "./AttributeMapper";
import { Attribute } from "@/backend/domain/common/Attribute";
import { itemTemplateID } from "@/backend/domain/common/IDs";

/**
 * Mapper class for converting between Template domain entities, DTOs, and database models:
 * - Domain Entity → DTO
 * - Domain Entity ↔ Database Model
 * - DTO → NewTemplate (for creation)
 *
 * This utility handles transformations and validation using Zod schemas,
 * ensuring consistent data structures across layers.
 */

export class ItemTemplateMapper {
  /**
   * Maps a ItemTemplate domain entity to a ItemTemplateDTO.
   *
   * @param entity - The `ItemTemplate` domain entity.
   * @returns A corresponding `ItemTemplateDTO` object.
   */
  static toDTO(entity: ItemTemplate): ItemTemplateDTO {
    return {
      item_templateID: entity.itemTemplateID,
      template_name: entity.templateName,
      attributes: entity.attributes.map(AttributeMapper.toDTO),
    };
  }

  /**
   * Maps an ItemTemplate domain entity to an ItemTemplateModel for persistence.
   *
   * @param entity - The `ItemTemplate` domain entity.
   * @returns A corresponding `ItemTemplateModel` object.
   */
  static toModel(
    entity: ItemTemplate,
  ): Omit<ItemTemplateModel, "attributes"> & { attributes: string } {
    return {
      item_templateID: entity.itemTemplateID,
      title: entity.templateName,
      attributes: "", // default since attributes here are not used for db persistency
    };
  }

  /**
   * Maps an ItemTemplate domain entity to an ItemTemplateModel for persistence.
   *
   * @param entity - The `ItemTemplate` domain entity.
   * @returns A corresponding `ItemTemplateModel` (omits `item_templateID`) object.
   */
  static toInsertModel(
    entity: NewItemTemplate,
  ): Omit<ItemTemplateModel, "item_templateID"> & { attributes: string } {
    return {
      title: entity.templateName,
      attributes: "", // default since attributes here are not used for db persistency
    };
  }

  /**
   * Maps an ItemTemplateDTO to a NewItemTemplate entity, used when creating a new template.
   *
   * @param dto - The DTO containing all template fields.
   * @returns A validated `NewItemTemplate` domain entity.
   * @throws Error if validation fails.
   */
  static toNewEntity(dto: ItemTemplateDTO): NewItemTemplate {
    try {
      const parsedDTO = createNewItemTemplateSchema.parse({
        templateName: dto.template_name,
        attributes: dto.attributes.map(AttributeMapper.toNewEntity),
      });
      return parsedDTO;
    } catch (error) {
      console.error("Error mapping ItemTemplateDTO to New Entity");
      throw new Error("Failed to map ItemTemplateDTO to New Entity");
    }
  }

  /**
   * Maps a ItemTemplateModel from the db to a ItemTemplat domain entity.
   *
   * @param model - The raw ItemTemplatetModel from the DB.
   * @returns A validated `ItemTemplate` domain entity.
   * @throws Error if validation fails.
   */
  static toEntity(model: ItemTemplateModel): ItemTemplate {
    try {
      const rawAttributes: any[] = JSON.parse(model.attributes);
      const parsedAttributes: Attribute[] = rawAttributes.map(
        AttributeMapper.toEntity,
      );
      return itemTemplateSchema.parse({
        itemTemplateID: itemTemplateID.parse(model.item_templateID),
        templateName: model.title,
        attributes: parsedAttributes,
      });
    } catch (error) {
      console.error("Error mapping ItemTemplateModel to Entity:", error);
      throw new Error("Failed to map ItemTemplateModel to Entity");
    }
  }
}
