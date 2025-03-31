export interface ItemTemplate {
    itemTemplateID: number;
    title: string;
    categories: string | null;
}

export class ItemTemplate {
    constructor(public itemTemplateID: number, public title: string, public categories: string | null) {}
}