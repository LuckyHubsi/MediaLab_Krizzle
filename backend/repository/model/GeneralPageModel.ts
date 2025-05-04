/**
 * Represents the internal model of a general page in the application.
 */
export type GeneralPageModel = {
  pageID: number;
  page_type: string;
  page_title: string;
  page_icon?: string | null;
  page_color?: string | null;
  date_created: string;
  date_modified: string;
  archived: 0 | 1;
  pinned: 0 | 1;
  tagID?: number | null;
  tag_label?: string;
};
