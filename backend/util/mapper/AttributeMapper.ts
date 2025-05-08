import {
  Attribute,
  attributeID,
  attributeSchema,
  createNewAttributeSchema,
  NewAttribute,
} from "@/backend/domain/common/Attribute";
import { AttributeModel } from "@/backend/repository/model/AttributeModel";
import { AttributeDTORestructure } from "@/dto/AttributeDTO";
import { AttributeType } from "../../../shared/enum/AttributeType";

export class AttributeMapper {
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

  static toModel(entity: Attribute): AttributeModel {
    return {
      attributeID: entity.attributeID,
      attribute_label: entity.attributeLabel,
      type: entity.type,
      preview: entity.preview ? 1 : 0,
      options: entity.options ? JSON.stringify(entity.options) : null,
      symbol: entity.symbol ?? null,
    };
  }

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
