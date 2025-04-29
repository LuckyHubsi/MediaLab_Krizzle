import { AttributeDTO } from "@/dto/AttributeDTO";
import { ItemsDTO } from "@/dto/ItemsDTO";
import { ItemsModel } from "@/models/ItemsModel";

export class ItemsMapper {
  static toDTO(model: ItemsModel[]): ItemsDTO {
    const collectionID = model[0].collectionID;
    const pageID = model[0].pageID;

    const attributeMap = new Map<number, AttributeDTO>();
    const itemMap = new Map<number, (string | number | null)[]>();

    for (const singleEntry of model) {
      if (!attributeMap.has(singleEntry.attributeID)) {
        attributeMap.set(singleEntry.attributeID, {
          attributeID: singleEntry.attributeID,
          attributeLabel: singleEntry.attribute_label,
          type: singleEntry.type,
          preview: !!singleEntry.preview,
          symbol: singleEntry.rating_symbol
            ? singleEntry.rating_symbol
            : undefined,
          options: singleEntry.multiselect_options
            ? JSON.parse(singleEntry.multiselect_options)
            : null,
        });
      }

      if (!itemMap.has(singleEntry.itemID)) {
        itemMap.set(singleEntry.itemID, []);
      }

      itemMap
        .get(singleEntry.itemID)!
        .push(
          singleEntry.type === "multi-select" &&
            typeof singleEntry.value === "string"
            ? JSON.parse(singleEntry.value)
            : singleEntry.value,
        );
    }

    return {
      collectionID,
      pageID,
      attributes: Array.from(attributeMap.values()),
      items: Array.from(itemMap.entries()).map(([itemID, values]) => ({
        itemID,
        values,
      })),
    };
  }
}
