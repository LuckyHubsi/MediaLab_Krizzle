import { ItemModel } from "@/backend/repository/model/ItemModel";
import { ItemDTO } from "@/dto/ItemDTO";
import { ItemAttributeValueDTO } from "@/dto/ItemAttributeValueDTO";
import {
  createNewItemSchema,
  Item,
  itemAttributeValueSchema,
  itemSchema,
  NewItem,
} from "@/backend/domain/entity/Item";
import { z } from "zod";

export class ItemMapper {
  static toDTO(entity: Item): ItemDTO {
    return {
      itemID: entity.itemID,
      pageID: entity.pageID,
      page_title: entity.pageTitle,
      categoryID: entity.categoryID ?? null,
      categoryName: entity.categoryName ?? undefined,
      attributeValues: entity.attributeValues as ItemAttributeValueDTO[],
    };
  }

  static toModel(entity: Item): ItemModel {
    return {
      itemID: entity.itemID,
      pageID: entity.pageID,
      page_title: entity.pageTitle,
      categoryID: entity.categoryID ?? null,
      category_name: entity.categoryName ?? null,
      attributes: JSON.stringify(entity.attributeValues),
    };
  }

  static toInsertModel(entity: NewItem): Omit<ItemModel, "itemID"> {
    return {
      pageID: entity.pageID,
      page_title: "",
      categoryID: entity.categoryID ?? null,
      category_name: null,
      attributes: JSON.stringify(entity.attributeValues),
    };
  }

  static toNewEntity(dto: ItemDTO): NewItem {
    try {
      return createNewItemSchema.parse({
        pageID: dto.pageID,
        categoryID: dto.categoryID ?? null,
        attributeValues: dto.attributeValues ?? [],
      });
    } catch (error) {
      console.error("Error mapping ItemDTO to NewItem:", error);
      throw new Error("Invalid ItemDTO for new item entity");
    }
  }

  static toEntity(model: ItemModel): Item {
    try {
      const rawAttributes = JSON.parse(model.attributes);
      const normalizedAttributes = rawAttributes.map((attr: any) => {
        const base = {
          ...attr,
          type: attr.attributeType,
          preview: !!attr.preview,
        };

        // Map generic "value" field to correct schema key
        switch (attr.attributeType) {
          case "text":
          case "date":
            return {
              ...base,
              valueString: attr.value ?? null,
            };
          case "rating":
            return {
              ...base,
              valueNumber: attr.value ?? null,
            };
          case "multi-select":
            return {
              ...base,
              valueMultiselect: (() => {
                try {
                  const parsed = JSON.parse(attr.value);
                  return Array.isArray(parsed) ? parsed : null;
                } catch {
                  return null;
                }
              })(),
            };
          default:
            return base;
        }
      });
      const parsedAttributes = z
        .array(itemAttributeValueSchema)
        .parse(normalizedAttributes);

      return itemSchema.parse({
        itemID: model.itemID,
        pageID: model.pageID,
        pageTitle: model.page_title,
        categoryID: model.categoryID,
        categoryName: model.category_name,
        attributeValues: parsedAttributes,
      });
    } catch (error) {
      console.error("Error mapping ItemModel to Item:", error);
      throw new Error("Failed to map ItemModel to domain Item");
    }
  }
}
