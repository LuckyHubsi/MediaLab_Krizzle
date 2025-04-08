import { CollectionModel } from '@/models/CollectionModel';
import { CollectionDTO } from '@/dto/CollectionDTO';
import { GeneralPageMapper } from './GeneralPageMapper';
import { ItemTemplateDTO } from '@/dto/ItemTemplateDTO';

export class CollectionMapper extends GeneralPageMapper {
    static toDTO(model: CollectionModel): CollectionDTO {
        const generalPageDTO = super.toDTO(model);

        const template: ItemTemplateDTO = {
          item_templateID: model.item_templateID,
          template_name: model.template_name,
          categories: model.categories,
          attributes: JSON.parse(model.attributes),
        };
    
        return {
          ...generalPageDTO,
          template,
        };
    }
}