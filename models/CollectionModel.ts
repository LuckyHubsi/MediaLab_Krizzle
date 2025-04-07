import {ItemTemplate} from './ItemTemplateModel'

export interface Collection {
    collectionID: number;
    pageID: number;
    itemTemplate: ItemTemplate;
}

export class Collection {
    constructor(public collectionID: number, public pageID: number, public itemTemplate: ItemTemplate) {}
}