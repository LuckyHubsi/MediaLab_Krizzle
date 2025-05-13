/**
 * Data Transfer Object for a tag.
 * Used for transferring tag data between the backend and frontend.
 *
 * @property tagID - Unique identifier of the tag.
 * @property tag_label - The label or name associated with the tag.
 * @property usage_count - The number of widgets the tag is assigned to.
 */
export type TagDTO = {
  tagID?: number;
  tag_label: string;
  usage_count?: number;
};
