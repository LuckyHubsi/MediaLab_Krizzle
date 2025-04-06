import { ItemAttributeValueModel } from '@/models/ItemAttributeValueModel';
import { ItemAttributeValueDTO } from '@/dto/ItemAttributeValueDTO';

export class ItemAttributeValueMapper {
    static toDTO(model: ItemAttributeValueModel): ItemAttributeValueDTO {
        return {
            valueID: model.valueID,
            itemID: model.itemID,
            attributeID: model.attributeID,
            value: model.value
        };
    }
}