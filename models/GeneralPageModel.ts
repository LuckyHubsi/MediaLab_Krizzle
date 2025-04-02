import { Tag } from "./TagModel";

export interface GeneralPage {
    pageID: number;
    page_type: string;
    page_title: string;
    page_icon: string;
    page_color: string;
    date_created: string;
    date_modified: string;
    archived: number;
    pinned: number;
    tag: Tag | null;
}

export class GeneralPage {
    constructor(public pageID: number, public page_type: string, public page_title: string, public page_icon: string, public page_color: string,
        public date_created: string, public date_modified: string, public archived: number, public pinned: number, public tag: Tag | null) {}
}