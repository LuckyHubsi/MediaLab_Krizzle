/**
 * Represents a Collection Entity Model used for database interactions.
 */
export class CollectionModel {
    readonly collectionID?: number;
    pageID: number;
    itemTemplateID: number;

    constructor(
        pageID: number,
        itemTemplateID: number,
        collectionID?: number
    ) {
        this.collectionID = collectionID;
        this.pageID = pageID;
        this.itemTemplateID = itemTemplateID;
    }
    
    // Getter methods
    getCollectionID(): number | undefined {
        return this.collectionID;
    }
    
    getPageID(): number {
        return this.pageID;
    }
    
    getItemTemplateID(): number {
        return this.itemTemplateID;
    }
    
    // Setter methods
    setPageID(pageID: number): void {
        this.pageID = pageID;
    }
    
    setItemTemplateID(itemTemplateID: number): void {
        this.itemTemplateID = itemTemplateID;
    }
}