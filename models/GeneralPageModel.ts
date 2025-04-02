/**
 * Represents a General Page Entity Model used for database interactions.
 */
export class GeneralPageModel {
    readonly pageID?: number;
    page_type: string;
    page_title: string;
    page_icon: string;
    page_color: string;
    date_created: string;
    date_modified: string;
    archived: number;
    pinned: number;

    constructor(
        page_type: string,
        page_title: string,
        page_icon: string,
        page_color: string,
        date_created: string,
        date_modified: string,
        archived: number,
        pinned: number,
        pageID?: number
    ) {
        this.pageID = pageID;
        this.page_type = page_type;
        this.page_title = page_title;
        this.page_icon = page_icon;
        this.page_color = page_color;
        this.date_created = date_created;
        this.date_modified = date_modified;
        this.archived = archived;
        this.pinned = pinned;
    }
}