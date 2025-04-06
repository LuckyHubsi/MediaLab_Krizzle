import { AttributeType } from '@/utils/enums/AttributeType';

/**
 * Represents an Attribute Entity Model used for database interactions.
 */
export class AttributeModel {
    readonly attributeID?: number;
    itemTemplateID: number;
    attributeLabel: string;
    attributeType: AttributeType; // One of: "Text", "Rating", "Date", "Multiselect"
    preview: number; // Using number for boolean (0/1) to match SQLite storage
    options: string | null; // For storing options for Multiselect?

    constructor(
        itemTemplateID: number,
        attributeLabel: string,
        attributeType: AttributeType,
        preview: number,
        options: string | null = null,
        attributeID?: number
    ) {
        this.attributeID = attributeID;
        this.itemTemplateID = itemTemplateID;
        this.attributeLabel = attributeLabel;
        this.attributeType = attributeType;
        this.preview = preview;
        this.options = options;
    }

    // Getter methods
    getAttributeID(): number | undefined {
        return this.attributeID;
    }
    
    getItemTemplateID(): number {
        return this.itemTemplateID;
    }
    
    getAttributeLabel(): string {
        return this.attributeLabel;
    }
    
    getAttributeType(): AttributeType {
        return this.attributeType;
    }
    
    getPreview(): number {
        return this.preview;
    }
    
    getOptions(): string | null {
        return this.options;
    }
    
    // Setter methods
    setItemTemplateID(itemTemplateID: number): void {
        this.itemTemplateID = itemTemplateID;
    }
    
    setAttributeLabel(attributeLabel: string): void {
        this.attributeLabel = attributeLabel;
    }
    
    setAttributeType(attributeType: AttributeType): void {
        this.attributeType = attributeType;
    }
    
    setPreview(preview: number): void {
        this.preview = preview;
    }
    
    setOptions(options: string | null): void {
        this.options = options;
    }
}