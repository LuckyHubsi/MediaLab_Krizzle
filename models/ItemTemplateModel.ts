/**
 * Represents an ItemTemplate Entity Model used for database interactions.
 */
export class ItemTemplateModel {
    readonly itemTemplateID?: number;
    title: string;
    categories: string | null;

    constructor(
        title: string,
        categories: string | null,
        itemTemplateID?: number
    ) {
        this.itemTemplateID = itemTemplateID;
        this.title = title;
        this.categories = categories;
    }

    // Getter methods
    getItemTemplateID(): number | undefined {
        return this.itemTemplateID;
    }
    
    getTitle(): string {
        return this.title;
    }
    
    getCategories(): string | null {
        return this.categories;
    }
    
    // Setter methods
    setTitle(title: string): void {
        this.title = title;
    }
    
    setCategories(categories: string | null): void {
        this.categories = categories;
    }
}