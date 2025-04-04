/**
 * Represents an ItemAttributeValue Entity Model used for database interactions.
 */
export class ItemAttributeValueModel {
    readonly valueID?: number;
    itemID: number;
    attributeID: number;
    value: string;

    constructor(
        itemID: number,
        attributeID: number,
        value: string,
        valueID?: number
    ) {
        this.valueID = valueID;
        this.itemID = itemID;
        this.attributeID = attributeID;
        this.value = value;
    }

    // Getter methods
    getValueID(): number | undefined {
        return this.valueID;
    }
    
    getItemID(): number {
        return this.itemID;
    }
    
    getAttributeID(): number {
        return this.attributeID;
    }
    
    getValue(): string {
        return this.value;
    }
    
    // Setter methods
    setItemID(itemID: number): void {
        this.itemID = itemID;
    }
    
    setAttributeID(attributeID: number): void {
        this.attributeID = attributeID;
    }
    
    setValue(value: string): void {
        this.value = value;
    }
}