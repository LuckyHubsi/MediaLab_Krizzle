import { ItemsDTO } from "@/dto/ItemsDTO";
import { AttributeDTO } from "@/dto/AttributeDTO";
import { ItemsModel } from "@/models/ItemsModel";

export class ItemsMapper {
  static toDTO(model: ItemsModel[]): ItemsDTO {
    const collectionID = model[0].collectionID;
    const pageID = model[0].pageID;

    const attributeMap = new Map<number, AttributeDTO>();
    const itemMap = new Map<
      number,
      {
        values: (string | number | null)[];
        categoryID: number | null;
        categoryName: string | null;
      }
    >();

    for (const entry of model) {
      if (!attributeMap.has(entry.attributeID)) {
        attributeMap.set(entry.attributeID, {
          attributeID: entry.attributeID,
          attributeLabel: entry.attribute_label,
          type: entry.type,
          preview: !!entry.preview,
          symbol: entry.rating_symbol ?? undefined,
          options: entry.multiselect_options
            ? JSON.parse(entry.multiselect_options)
            : null,
        });
      }

      if (!itemMap.has(entry.itemID)) {
        itemMap.set(entry.itemID, {
          values: [],
          categoryID: entry.categoryID,
          categoryName: entry.category_name,
        });
      }

      const value =
        entry.type === "multi-select" && typeof entry.value === "string"
          ? JSON.parse(entry.value)
          : entry.value;

      itemMap.get(entry.itemID)!.values.push(value);
    }

    const test = {
      collectionID,
      pageID,
      attributes: Array.from(attributeMap.values()),
      items: Array.from(itemMap.entries()).map(
        ([itemID, { values, categoryID, categoryName }]) => ({
          itemID,
          values,
          categoryID,
          categoryName: categoryName ?? "All",
        }),
      ),
    };

    return test;
  }
}
