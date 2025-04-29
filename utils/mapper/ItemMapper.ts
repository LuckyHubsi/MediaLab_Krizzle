import { AttributeDTO } from "@/dto/AttributeDTO";
import { ItemAttributeValueDTO } from "@/dto/ItemAttributeValueDTO";
import { ItemDTO } from "@/dto/ItemDTO";
import { ItemModel } from "@/models/ItemModel";
import { AttributeType } from "../enums/AttributeType";

export class ItemMapper {
  static toDTO(
    model: Omit<ItemModel, "attributes"> & { attributes: any[] },
  ): ItemDTO {
    const attributeValues: ItemAttributeValueDTO[] = model.attributes.map(
      (attr) => {
        const baseAttr: AttributeDTO = {
          attributeID: attr.attributeID,
          attributeLabel: attr.attributeLabel,
          type: attr.attributeType as AttributeType,
          preview: attr.preview === 1 ? true : false,
          options: attr.options
            ? Array.isArray(attr.options)
              ? attr.options.map((opt: any) => opt.options)
              : null
            : null,
          symbol: attr.symbol,
        };

        if (attr.attributeType === "rating") {
          return {
            ...baseAttr,
            valueID: attr.valueID,
            itemID: model.itemID,
            valueNumber: attr.value,
          };
        } else if (attr.attributeType === "multi-select") {
          const parsedValues: string[] =
            typeof attr.value === "string" ? JSON.parse(attr.value) : [];

          return {
            ...baseAttr,
            valueID: attr.valueID,
            itemID: model.itemID,
            valueMultiselect: parsedValues,
          };
        } else {
          return {
            ...baseAttr,
            valueID: attr.valueID,
            itemID: model.itemID,
            valueString: attr.value,
          };
        }
      },
    );

    return {
      itemID: model.itemID,
      pageID: model.pageID,
      page_title: model.page_title,
      categoryID: model.categoryID,
      categoryName: model.category_name ? model.category_name : undefined,
      attributeValues: attributeValues,
    };
  }
}
