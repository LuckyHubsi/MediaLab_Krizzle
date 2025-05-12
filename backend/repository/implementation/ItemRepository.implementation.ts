import { RepositoryError } from "@/backend/util/error/RepositoryError";
import { ItemRepository } from "../interfaces/ItemRepository.interface";
import { BaseRepositoryImpl } from "./BaseRepository.implementation";
import { Item, ItemID } from "@/backend/domain/entity/Item";
import { ItemModel } from "@/models/ItemModel";
import { itemSelectByIdQuery } from "../query/ItemQuery";
import { ItemMapper } from "@/backend/util/mapper/ItemMapper";

export class ItemRepositoryImpl
  extends BaseRepositoryImpl
  implements ItemRepository
{
  async getItemByID(itemId: ItemID): Promise<Item> {
    try {
      const item = await super.fetchFirst<ItemModel>(itemSelectByIdQuery, [
        itemId,
      ]);
      if (item) {
        console.log("ITEM MODEL", JSON.stringify(item, null, 2));
        return ItemMapper.toEntity(item);
      } else {
        throw new RepositoryError("Failed to fetch item.");
      }
    } catch (error) {
      throw new RepositoryError("Failed to fetch item.");
    }
  }
}

export const itemRepository = new ItemRepositoryImpl();
