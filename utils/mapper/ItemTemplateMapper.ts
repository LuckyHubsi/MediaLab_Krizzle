import { ItemTemplateModel } from '@/models/ItemTemplateModel';
import { ItemTemplateDTO } from '@/dto/ItemTemplateDTO';

export class ItemTemplateMapper {
    static toDTO(model: ItemTemplateModel): ItemTemplateDTO {
        return {
            item_templateID: model.itemTemplateID,
            template_name: model.title,
            categories: model.categories
        };
    }
}