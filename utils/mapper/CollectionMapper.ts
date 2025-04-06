import { CollectionModel } from '@/models/CollectionModel';
import { CollectionDTO } from '@/dto/CollectionDTO';

export class CollectionMapper {
    static toDTO(model: CollectionModel): CollectionDTO {
        return {
            collectionID: model.collectionID,
            pageID: model.pageID,
            itemTemplateID: model.item_templateID
        };
    }
}