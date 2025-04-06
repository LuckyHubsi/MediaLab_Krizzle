import { AttributeDTO } from '@/dto/AttributeDTO';
import { AttributeType } from './AttributeTypes';
import { ItemAttributeValueDTO } from '@/dto/ItemAttributeValueDTO';

/**
 * Utility class for validating attribute values based on their types
 */
export class AttributeValidator {
    /**
     * Validates an attribute value based on its type
     * 
     * @param value The value to validate
     * @param attributeType The type of the attribute
     * @returns The validated/corrected value or null if invalid
     */
    static validateValue(value: string, attributeType: string): string | null {
        // Convert the string attributeType to a string for comparison with enum values
        const typeAsString = attributeType.toString();
        
        // Compare with string values of the enum
        switch (typeAsString) {
            case AttributeType.Text.toString():
                // Text is always valid
                return value;
                
            case AttributeType.Rating.toString():
                // Rating should be a number between 0 and 5
                const ratingValue = parseInt(value, 10);
                if (isNaN(ratingValue)) {
                    return '0';
                }
                return Math.max(0, Math.min(5, ratingValue)).toString();
                
            case AttributeType.Date.toString():
                // Try to parse as date
                try {
                    const date = new Date(value);
                    if (isNaN(date.getTime())) {
                        return '';
                    }
                    return date.toISOString().split('T')[0]; // YYYY-MM-DD format
                } catch (e) {
                    return '';
                }
                
            case AttributeType.Multiselect.toString():
                // Should be a valid JSON array or whatever else we'll use
                try {
                    const parsed = JSON.parse(value);
                    if (Array.isArray(parsed)) {
                        return JSON.stringify(parsed);
                    }
                    return '[]';
                } catch (e) {
                    return '[]';
                }
                
            default:
                return value;
        }
    }

    /**
     * Validates an ItemAttributeValueDTO against its attribute type
     * 
     * @param valueDTO The value DTO to validate
     * @param attribute The attribute definition
     * @returns The validated value DTO
     */
    static validateAttributeValue(
        valueDTO: ItemAttributeValueDTO, 
        attribute: AttributeDTO
    ): ItemAttributeValueDTO {
        const validatedValue = this.validateValue(valueDTO.value, attribute.attributeType);
        
        return {
            ...valueDTO,
            value: validatedValue !== null ? validatedValue : ''
        };
    }

    /**
     * Validates the options string for a Multiselect attribute
     * 
     * @param options The options string to validate
     * @returns A valid options string or null if invalid
     */
    static validateMultiselectOptions(options: string | null): string | null {
        if (!options) {
            return '[]'; // Default empty array
        }
        
        try {
            const parsedOptions = JSON.parse(options);
            if (Array.isArray(parsedOptions)) {
                return JSON.stringify(parsedOptions);
            }
            return '[]';
        } catch (e) {
            return '[]';
        }
    }
}