import { ItemTemplateModel } from "@/models/ItemTemplateModel";
import { ItemTemplateDTO } from "@/dto/ItemTemplateDTO";
import { AttributeDTO } from "@/dto/AttributeDTO";
import { AttributeModel } from "@/models/AttributeModel";

export class ItemTemplateMapper {
  static toDTO(model: ItemTemplateModel): ItemTemplateDTO {
    let attributes: AttributeDTO[] = [];
    if (model.attributes) {
      // If the attributes are a stringified JSON array, parse it into an actual array
      const parsedAttributes: AttributeModel[] =
        typeof model.attributes === "string"
          ? JSON.parse(model.attributes)
          : model.attributes;

      // Now map the parsed attributes
      attributes = parsedAttributes.map((attribute) => {
        return {
          attributeLabel: attribute.attribute_label,
          type: attribute.type,
          attributeID: attribute.attributeID,
          preview: attribute.preview === 1,
          options: attribute.options,
          symbol: attribute.symbol,
        };
      });
    }

    return {
      item_templateID: model.itemTemplateID,
      template_name: model.title,
      attributes: attributes,
    };
  }
}
