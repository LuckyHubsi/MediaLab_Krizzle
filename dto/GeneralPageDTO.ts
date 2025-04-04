/**
 * Represents a general page data structure.
 */
export interface GeneralPageDTO {
    pageID?: number;
    page_type: string;
    page_title: string;
    page_icon?: string;
    page_color?: string;
    archived: boolean;
    pinned: boolean;
}