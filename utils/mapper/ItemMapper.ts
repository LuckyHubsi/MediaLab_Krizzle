import { ItemDTO } from "@/dto/ItemDTO";
import { ItemModel } from "@/models/ItemModel";
import { ItemAttributeValueDTO } from "@/dto/ItemAttributeValueDTO";
import { AttributeDTO } from "@/dto/AttributeDTO";
import { AttributeType } from "../enums/AttributeType";

export class ItemMapper {
  static toDTO(model: ItemModel): ItemDTO {
    const attributeValues: ItemAttributeValueDTO[] = model.attributes.map(
      (attr) => {
        const baseAttr: AttributeDTO = {
          attributeID: attr.attributeID,
          attributeLabel: attr.attributeLabel,
          type: attr.attributeType as AttributeType,
          preview: false,
          options: attr.options ? attr.options.map((opt) => opt.options) : null,
        };

        if (attr.attributeType === "text") {
          return {
            ...baseAttr,
            valueID: undefined,
            itemID: model.itemID,
            valueString: attr.value,
          };
        } else if (attr.attributeType === "multiselect") {
          return {
            ...baseAttr,
            valueID: undefined,
            itemID: model.itemID,
            valueMultiselect: attr.value,
          };
        } else {
          return {
            ...baseAttr,
            valueID: undefined,
            itemID: model.itemID,
          };
        }
      },
    );

    return {
      itemID: model.itemID,
      pageID: model.pageID,
      categoryID: model.categoryID,
      attributeValues: attributeValues,
    };
  }
}
