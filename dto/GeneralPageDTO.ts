/**
 * Represents a general page data structure.
 */
export interface GeneralPageDTO {
    pageID?: number;
    page_type: string;
    page_title: string;
    page_icon?: string;
    page_color?: string;
    date_created: string;
    date_modified: string;
    archived: boolean;
    pinned: boolean;
}