import {Attribute} from './AttributeModel'

export interface ItemTemplate {
    itemTemplateID: number;
    title: string;
    categories: string | null;
    attributes: Attribute[];
}

export class ItemTemplate {
    constructor(public itemTemplateID: number, public title: string, public categories: string | null, public attributes: Attribute[]) {}
}