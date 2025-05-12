import { Item, ItemID } from "@/backend/domain/entity/Item";
import { BaseRepository } from "./BaseRepository.interface";

export interface ItemRepository extends BaseRepository {
  getItemByID(itemId: ItemID): Promise<Item>;
}
