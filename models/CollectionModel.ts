export interface Collection {
    collectionID: number;
    itemTemplateID: number;
    pageID: number;
}

export class Collection {
    constructor(public collectionID: number, public itemTemplateID: number, public pageID: number) {}
}