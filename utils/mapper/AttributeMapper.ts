import { AttributeModel } from '@/models/AttributeModel';
import { AttributeDTO, isValidAttributeType } from '@/dto/AttributeDTO';

export class AttributeMapper {
    static toDTO(model: AttributeModel): AttributeDTO {
        return {
            attributeID: model.attributeID,
            itemTemplateID: model.itemTemplateID,
            attributeLabel: model.attributeLabel,
            attributeType: model.attributeType,
            preview: model.preview === 1,
            options: model.options
        };
    }
}