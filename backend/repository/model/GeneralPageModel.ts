/**
 * Represents the internal model of a general page in the application.
 */
export type GeneralPageModel = {
  pageID: number; // unique identifier for the page
  page_type: string; // type of the page ('note' or 'collection')
  page_title: string; // title or name of the page
  page_icon?: string | null; // optional icon representing the page
  page_color?: string | null; // optional color associated with the page
  date_created: string; // date when the page was created as ISO string
  date_modified: string; // date when the page was created as ISO string
  archived: 0 | 1; // indicates whether the page is archived (1) or not (0)
  pinned: 0 | 1; // indicates whether the page is pinned (1) or not (0)
  tagID?: number | null; // the tagID that is saved as an FK or null if none
  tag_label?: string; // the label of the associated tag
};
