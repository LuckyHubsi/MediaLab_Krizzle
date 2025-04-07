export interface Item {
    itemID: number;
    pageID: number;
    category: string | null;
}

export class Item {
    constructor(public itemID: number, public pageID: number, public category: string | null) {}
}