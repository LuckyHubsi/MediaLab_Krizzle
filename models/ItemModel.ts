/**
 * Represents an Item Entity Model used for database interactions.
 */
export class ItemModel {
    readonly itemID?: number;
    collectionID: number;
    pageID: number;
    category: string | null;

    constructor(
        collectionID: number,
        pageID: number,
        category: string | null,
        itemID?: number
    ) {
        this.itemID = itemID;
        this.collectionID = collectionID;
        this.pageID = pageID;
        this.category = category;
    }

    // Getter methods
    getItemID(): number | undefined {
        return this.itemID;
    }

    getCollectionID(): number {
        return this.collectionID;
    }
    
    getPageID(): number {
        return this.pageID;
    }
    
    getCategory(): string | null {
        return this.category;
    }
    
    // Setter methods
    setCollectionID(collectionID: number): void {
        this.collectionID = collectionID;
    }
    
    setPageID(pageID: number): void {
        this.pageID = pageID;
    }
    
    setCategory(category: string | null): void {
        this.category = category;
    }
}