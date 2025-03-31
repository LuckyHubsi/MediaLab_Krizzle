import { Tag } from './TagModel';

export interface GeneralPage {
    pageID: number;
    //pageType: PageType;
    pageTitle: string;
    //pageIcon: PageIcon;
    //pageColor: PageColor;
    dateCreated: Date;
    dateModified: Date;
    archived: boolean;
    pinned: boolean;
    pageTags: Tag[] | null;
}

export class GeneralPage {
    constructor(public pageID: number, public pageTitle: string, public dateCreated: Date, public dateModified: Date,
    public archived: boolean, public pinned: boolean, public pageTags: Tag[] | null) {}
}