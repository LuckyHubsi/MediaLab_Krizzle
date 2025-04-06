/**
 * Represents an ItemTemplate Entity Model used for database interactions.
 */
export type ItemTemplateModel = {
    itemTemplateID?: number;
    title: string;
    categories: string | null;
}