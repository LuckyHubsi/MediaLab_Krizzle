export interface GeneralPage {
    pageID: number;
    //pageType: PageType;
    pageTitle: string;
    //pageIcon: PageIcon;
    //pageColor: PageColor;
    dateCreated: string;
    dateModified: string;
    archived: boolean;
    pinned: boolean;
    pageTags: {tagID: number}[] | null;
}

export class GeneralPage {
    constructor(public pageID: number, public pageTitle: string, public dateCreated: string, public dateModified: string,
    public archived: boolean, public pinned: boolean, public pageTags: {tagID: number}[] | null) {}
}