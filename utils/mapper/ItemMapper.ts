import { ItemDTO } from "@/dto/ItemDTO";
import { ItemModel } from "@/models/ItemModel";

export class ItemMapper {
  static toDTO(model: ItemModel): ItemDTO {
    return {
      itemID: model.itemID,
      collectionID: model.collectionID,
      category: model.category,
    };
  }
}
