import { ItemModel } from '@/models/ItemModel';
import { ItemDTO } from '@/dto/ItemDTO';

export class ItemMapper {
    static toDTO(model: ItemModel): ItemDTO {
        return {
            itemID: model.itemID,
            collectionID: model.collectionID,
            pageID: model.pageID,
            category: model.category
        };
    }
}