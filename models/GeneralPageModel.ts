import { PageType } from "@/utils/enums/PageType";

/**
 * Represents the internal model of a general page in the application.
 */
export type GeneralPageModel = {
  pageID: number;                 // unique identifier for the page
  page_type: PageType;            // type of the page ('note' or 'collection')
  page_title: string;             // title of the page
  page_icon?: string | null;      // optional icon associated with the page
  page_color?: string | null;     // optional background or accent color for the page
  date_created: string;           // ISO string representing when the page was created.
  date_modified: string;          // ISO string representing the last modification time.
  archived: 0 | 1;                // indicates if the page is archived (0 = false, 1 = true)
  pinned: 0 | 1;                  // indicates if the page is pinned (0 = false, 1 = true)
  tagID?: number | null;          // optional ID of the associated tag
  tag_label?: string;             // optional label of the associated tag
};