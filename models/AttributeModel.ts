export interface Attribute {
    attributeID: number;
    itemTemplateID: number;
    attributeLabel: string;
    //type: ItemType;
    preview: boolean;
}

export class Attribute {
    constructor(public attributeID: number, public itemTemplateID: number, public attributeLabel: string, public preview: boolean) {}
}