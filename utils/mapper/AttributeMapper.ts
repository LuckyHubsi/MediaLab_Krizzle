import { AttributeModel } from '@/models/AttributeModel';
import { AttributeDTO, isValidAttributeType } from '@/dto/AttributeDTO';
import { AttributeType } from '@/utils/Enums';

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

    static toModel(dto: AttributeDTO): AttributeModel {
        let attributeType: AttributeType;
        
        // Convert string to enum for Model
        if (isValidAttributeType(dto.attributeType)) {
            attributeType = AttributeType[dto.attributeType as keyof typeof AttributeType];
        } else {
            attributeType = AttributeType.Text; // Default to Text if invalid
        }
        
        return new AttributeModel(
            dto.itemTemplateID,
            dto.attributeLabel,
            attributeType,
            dto.preview ? 1 : 0,
            dto.options || null,
            dto.attributeID
        );
    }
}