/**
 * Represents a tag used to categorize or label content.
 *
 * @property tagID - The unique identifier for the tag.
 * @property tag_label - The label or name of the tag.
 * @property usage_count - The number of widgets the tag is assigned to.
 *
 */
export type TagModel = {
  tagID: number;
  tag_label: string;
  usage_count: number;
};
