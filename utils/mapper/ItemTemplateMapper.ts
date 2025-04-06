import { ItemTemplateModel } from '@/models/ItemTemplateModel';
import { ItemTemplateDTO } from '@/dto/ItemTemplateDTO';

export class ItemTemplateMapper {
    static toDTO(model: ItemTemplateModel): ItemTemplateDTO {
        return {
            itemTemplateID: model.itemTemplateID,
            title: model.title,
            categories: model.categories
        };
    }
}