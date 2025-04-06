/**
 * Represents an Item Entity Model used for database interactions.
 */
export type ItemModel = {
    itemID: number;
    collectionID: number;
    pageID: number;
    category: string | null;
}