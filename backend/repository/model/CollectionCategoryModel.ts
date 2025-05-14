/**
 * Represents the internal model of a collection category in the application.
 */
export type CollectionCategoryModel = {
  collection_categoryID: number; // unique identifier of the collection category
  category_name: string; // label of the collection category
  collectionID: number; // unique identifier of the collection the category belongs to
};
