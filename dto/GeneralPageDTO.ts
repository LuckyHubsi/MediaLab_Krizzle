import { PageType } from "@/utils/enums/PageType";
import { TagDTO } from "./TagDTO";

/**
 * Data Transfer Object for general page data.
 * Used for transferring tag data between the backend and frontend.
 */
export type GeneralPageDTO = {
  pageID?: number; // optional unique identifier for the page (e.g., undefined when creating a new page)
  page_type: PageType; // type of the page ('note' or 'collection')
  page_title: string; // title or name of the page
  page_icon?: string; // optional icon representing the page
  page_color?: string; // optional color associated with the page
  archived: boolean; // indicates whether the page is archived
  pinned: boolean; // indicates whether the page is pinned
  tag: TagDTO | null; // tag associated with the page, or null if none
  pin_count?: number;
};
