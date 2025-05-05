import {
  itemTemplateID,
  ItemTemplate,
  createNewItemTemplateSchema,
  NewItemTemplate,
  itemTemplateSchema,
} from "@/backend/domain/entity/ItemTemplate";
import { ItemTemplateDTORestructure } from "@/dto/ItemTemplateDTO";
import { ItemTemplateModel } from "@/backend/repository/model/ItemTemplateModel";
import { AttributeMapper } from "./AttributeMapper";
import { AttributeDTORestructure } from "@/dto/AttributeDTO";
import { Attribute } from "@/backend/domain/common/Attribute";

export class ItemTemplateMapper {
  static toDTO(entity: ItemTemplate): ItemTemplateDTORestructure {
    return {
      item_templateID: entity.itemTemplateID,
      template_name: entity.templateName,
      attributes: entity.attributes.map(AttributeMapper.toDTO),
    };
  }

  static toModel(
    entity: ItemTemplate,
  ): Omit<ItemTemplateModel, "attributes"> & { attributes: string } {
    return {
      item_templateID: entity.itemTemplateID,
      title: entity.templateName,
      attributes: JSON.stringify(
        entity.attributes.map(AttributeMapper.toModel),
      ),
    };
  }

  static toInsertModel(
    entity: NewItemTemplate,
  ): Omit<ItemTemplateModel, "item_templateID"> & { attributes: string } {
    return {
      title: entity.templateName,
      attributes: JSON.stringify(
        entity.attributes.map((attr) => AttributeMapper.toInsertModel(attr)),
      ),
    };
  }

  static toNewEntity(dto: ItemTemplateDTORestructure): NewItemTemplate {
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
