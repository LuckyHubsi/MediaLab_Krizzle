/**
 * Enum representing the different possible types of attributes within a collection template in the app.
 *
 * - `Text`: Represents a text attribute.
 * - `Rating`: Represents a number attribute from 1-5.
 * - `Date`: Represents a date attribute.
 * - `Multiselect`: Represents a list of 'labels' grouped in the multi-select attribute.
 * - `Image`: Represents an image attribute.
 * - `Link`: Represents a hyperlink attribute.
 */
export enum AttributeType {
  Text = "text",
  Rating = "rating",
  Date = "date",
  Multiselect = "multi-select",
  Image = "image",
  Link = "link",
}
