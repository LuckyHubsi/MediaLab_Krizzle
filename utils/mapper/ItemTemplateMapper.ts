import { ItemTemplateModel } from "@/models/ItemTemplateModel";
import { ItemTemplateDTO } from "@/dto/ItemTemplateDTO";
import { AttributeDTO } from "@/dto/AttributeDTO";
import { AttributeModel } from "@/models/AttributeModel";

export class ItemTemplateMapper {
  static toDTO(model: ItemTemplateModel): ItemTemplateDTO {
    console.log("Entering toDTO function:", model);

    let attributes: AttributeDTO[] = [];
    if (model.attributes) {
      // If the attributes are a stringified JSON array, parse it into an actual array
      const parsedAttributes: AttributeModel[] =
        typeof model.attributes === "string"
          ? JSON.parse(model.attributes)
          : model.attributes;

      console.log("Model has attributes:", parsedAttributes);

      // Now map the parsed attributes
      attributes = parsedAttributes.map((attribute) => {
        return {
          attributeLabel: attribute.attribute_label,
          type: attribute.type,
          attributeID: attribute.attributeID,
          preview: attribute.preview === 1,
          options: attribute.options,
        };
      });
    }

    console.log("ATTR IN TODTO:", JSON.stringify({ attributes }));
    return {
      item_templateID: model.itemTemplateID,
      template_name: model.title,
      attributes: attributes,
    };
  }
}
