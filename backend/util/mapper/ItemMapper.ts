import {
  ItemModel,
  ItemPreviewValueModel,
} from "@/backend/repository/model/ItemModel";
import { ItemDTO, PreviewItemDTO } from "@/shared/dto/ItemDTO";
import { ItemAttributeValueDTO } from "@/shared/dto/ItemAttributeValueDTO";
import {
  createNewItemSchema,
  Item,
  itemAttributeValueSchema,
  itemSchema,
  NewItem,
  PreviewItem,
} from "@/backend/domain/entity/Item";
import { number, z } from "zod";
import { Attribute } from "@/backend/domain/common/Attribute";
import { ItemsDTO } from "@/shared/dto/ItemsDTO";
import { ItemID } from "@/backend/domain/common/IDs";
import { CategoryID } from "@/backend/domain/entity/CollectionCategory";
import { AttributeMapper } from "./AttributeMapper";
import { AttributeDTO } from "@/shared/dto/AttributeDTO";

/**
 * Mapper class for converting between Item domain entities, DTOs, and database models:
 * - Domain Entity → DTO
 * - Database Model → Domain Entity
 * - DTO → NewItem (for creation)
 *
 * This utility handles transformations and validation using Zod schemas,
 * ensuring consistent data structures across layers.
 */

export class ItemMapper {
  /**
   * Maps an Item domain entity to an ItemDTO.
   *
   * @param entity - The `Item` domain entity.
   * @returns A corresponding `ItemDTO` object.
   */
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

  /**
   * Maps a PreviewItem domain entity to an PreviewItemDTO with the help of an array of Attribute entities.
   *
   * @param entity - The `PreviewItem` domain entity.
   * @param attributes - The array `Attribute` domain entities.
   * @returns A corresponding `PreviewItemDTO` object.
   */
  static toPreviewDTO(
    entity: PreviewItem,
    attributes: Attribute[],
  ): PreviewItemDTO {
    const dtoValues: (
      | string
      | number
      | string[]
      | { value: string; displayText: string }
      | null
    )[] = entity.values.map((value, index) => {
      const attr = attributes[index];

      // return null if value is null or attribute is missing
      if (value === null || !attr) {
        return null;
      }

      // conversion based on the attribute type
      switch (attr.type) {
        case "text":
          // text values are expected to be strings
          return typeof value === "string" ? value : null;
        case "date":
          // date values are expected to be an instance of Date and to be converted to strings
          return value instanceof Date ? value.toISOString() : null;
        case "rating":
          // rating values are expected to be numbers
          return typeof value === "number" ? value : null;
        case "multi-select":
          // multiselect values are expected to be arrays of strings
          return Array.isArray(value) &&
            value.every((v) => typeof v === "string")
            ? value
            : null;
        case "image":
          // image values are expected to be strings
          return typeof value === "string" ? value : null;
        case "link":
          if (
            typeof value === "object" &&
            value !== null &&
            !Array.isArray(value) &&
            "value" in value &&
            typeof (value as any).value === "string"
          ) {
            return {
              value: value.value,
              displayText:
                typeof value.displayText === "string" ? value.displayText : "",
            };
          }
          return null;

        default:
          return null;
      }
    });

    return {
      itemID: entity.itemID,
      categoryID: entity.categoryID ?? null,
      categoryName: entity.categoryName ?? undefined,
      values: dtoValues,
    };
  }

  /**
   * Maps an Attribute and a PreviewItems domain entity array to an ItemsDTO.
   *
   * @param items - The `PreviewItem[]` domain entities.
   * @param attributes - The `Attribute[]` domain entities.
   * @returns A corresponding `ItemsDTO` object.
   */
  static toItemsDTO(items: PreviewItem[], attributes: Attribute[]): ItemsDTO {
    return {
      collectionID: 1,
      pageID: 1,
      attributes: attributes.map(AttributeMapper.toDTO),
      items: items.map((item) => this.toPreviewDTO(item, attributes)),
    };
  }

  /**
   * Maps an ItemDTO to a NewItem entity, used when creating a new Item.
   *
   * @param dto - The DTO containing all Item fields.
   * @returns A validated `NewItem` domain entity.
   * @throws Error if validation fails.
   */
  static toNewEntity(dto: ItemDTO): NewItem {
    try {
      return createNewItemSchema.parse({
        pageID: dto.pageID,
        categoryID: dto.categoryID ?? null,
        attributeValues: dto.attributeValues ?? [],
      });
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  /**
   * Maps an ItemModel from the db to an Item domain entity.
   *
   * @param model - The raw ItemModel from the DB.
   * @returns A validated `Item` domain entity.
   * @throws Error if validation fails.
   */
  static toEntity(model: ItemModel): Item {
    try {
      const rawAttributes = JSON.parse(model.attribute_values);
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
              options: (() => {
                try {
                  return Array.isArray(attr.options)
                    ? attr.options
                        .map((opt: unknown) => {
                          if (typeof opt === "string" && opt.startsWith("[")) {
                            return JSON.parse(opt);
                          }
                          return opt;
                        })
                        .flat()
                    : null;
                } catch {
                  return null;
                }
              })(),
            };
          case "image":
            return {
              ...base,
              valueString: attr.value ?? null,
            };
          case "link":
            return {
              ...base,
              valueString: attr.value ?? null,
              displayText: attr.display_text ?? null,
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
      console.error(error);
      throw error;
    }
  }

  /**
   * Maps an array of ItemPreviewValueModel from the db to an array of PreviewItem domain entities based on an array of Attributes.
   *
   * @param itemPreviewValues - The array of ItemPreviewValueModel from the DB.
   * @param attributes - The array of Attributes to help the mapper.
   * @returns A validated array of `PreviewItem` domain entities.
   * @throws Error if validation fails.
   */
  static toPreviewEntities(
    itemPreviewValues: ItemPreviewValueModel[],
    attributes: Attribute[],
  ): PreviewItem[] {
    try {
      // group all the individual ItemPreviewValueModel by their IDs
      const groupedByItemID = new Map<number, ItemPreviewValueModel[]>();
      for (const value of itemPreviewValues) {
        if (!groupedByItemID.has(value.itemID)) {
          groupedByItemID.set(value.itemID, []);
        }
        groupedByItemID.get(value.itemID)!.push(value);
      }

      const items: PreviewItem[] = [];

      // loop through each group and build a PreviewItem object
      for (const [itemID, previewValues] of groupedByItemID.entries()) {
        const first = previewValues[0]; // define the first record to get other data like category

        const values = attributes.map((attr) => {
          // find the preview value matching the current attribute
          const previewValue = previewValues.find(
            (value) => value.attributeID === attr.attributeID,
          );

          // return null if there is no previewValue
          if (!previewValue) return null;

          const raw = previewValue.value;

          // parse the raw value based on the attribute type
          switch (attr.type) {
            case "text":
              return typeof raw === "string" ? raw : null;
            case "date":
              return typeof raw === "string" ? new Date(raw) : null;
            case "rating":
              return typeof raw === "number" ? raw : null;
            case "multi-select":
              if (typeof raw !== "string") return null;
              const parsed = JSON.parse(raw);
              return Array.isArray(parsed) ? parsed : null;
            case "image":
              return typeof raw === "string" ? raw : null;
            case "link":
              if (typeof raw !== "string") return null;
              const displayText =
                typeof previewValue.display_text === "string"
                  ? previewValue.display_text
                  : null;
              return displayText ? { value: raw, displayText } : null;
            default:
              return null;
          }
        });

        // push the PreviewItem to the array
        items.push({
          itemID: itemID as ItemID,
          categoryID: first.categoryID as CategoryID,
          categoryName: first.category_name,
          values: values,
        });
      }

      return items;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
