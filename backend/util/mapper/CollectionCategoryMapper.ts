import { collectionID } from "@/backend/domain/common/IDs";
import {
  categorySchema,
  CollectionCategory,
  collectionCategoryID,
  createNewCategorySchema,
  NewCollectionCategory,
} from "@/backend/domain/entity/CollectionCategory";
import { CollectionCategoryModel } from "@/backend/repository/model/CollectionCategoryModel";
import { CollectionCategoryDTO } from "@/dto/CollectionCategoryDTO";

export class CollectionCategoryMapper {
  static toDTO(entity: CollectionCategory): CollectionCategoryDTO {
    return {
      collectionCategoryID: entity.categoryID,
      category_name: entity.categoryName,
      collectionID: entity.collectionID,
    };
  }

  static toModel(entity: CollectionCategory): CollectionCategoryModel {
    return {
      collection_categoryID: entity.categoryID,
      category_name: entity.categoryName,
      collectionID: entity.collectionID,
    };
  }

  static toInsertModel(
    entity: NewCollectionCategory,
  ): Omit<CollectionCategoryModel, "collection_categoryID" | "collectionID"> {
    return {
      category_name: entity.categoryName,
    };
  }

  static toNewEntity(dto: CollectionCategoryDTO): NewCollectionCategory {
    try {
      const parsedDTO = createNewCategorySchema.parse({
        categoryName: dto.category_name,
      });
      return parsedDTO;
    } catch (error) {
      console.error("Error mapping CollectionCategoryDTO to New Entity");
      throw new Error("Failed to map CollectionCategoryDTO to New Entity");
    }
  }

  static toEntity(model: CollectionCategoryModel): CollectionCategory {
    try {
      return categorySchema.parse({
        categoryID: collectionCategoryID.parse(model.collection_categoryID),
        categoryName: model.category_name,
        collectionID: collectionID.parse(model.collectionID),
      });
    } catch (error) {
      console.error("Error mapping CollectionCategoryModel to Entity:", error);
      throw new Error("Failed to map CollectionCategoryModel to Entity");
    }
  }
}
