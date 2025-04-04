import { CollectionModel } from '@/models/CollectionModel';
import { CollectionDTO } from '@/dto/CollectionDTO';

export class CollectionMapper {
    static toDTO(model: CollectionModel): CollectionDTO {
        return {
            collectionID: model.collectionID,
            pageID: model.pageID,
            itemTemplateID: model.itemTemplateID
        };
    }

    static toModel(dto: CollectionDTO): CollectionModel {
        return new CollectionModel(
            dto.pageID,
            dto.itemTemplateID,
            dto.collectionID
        );
    }
}