import { CollectionCategoryDTO } from "@/dto/CollectionCategoryDTO";
import { CollectionCategoryModel } from "@/models/CollectionCategoryModel";

export class CollectionCategoryMapper {
  static toDTO = (model: CollectionCategoryModel): CollectionCategoryDTO => {
    return {
      category_name: model.category_name,
      collectionID: model.collectionID,
      collectionCategoryID: model.collection_categoryID,
    };
  };
}
