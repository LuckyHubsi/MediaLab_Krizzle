import { CollectionModel } from "@/models/CollectionModel";
import { CollectionDTO } from "@/dto/CollectionDTO";
import { GeneralPageMapper } from "./GeneralPageMapper";
import { CollectionCategoryDTO } from "@/dto/CollectionCategoryDTO";

export class CollectionMapper extends GeneralPageMapper {
  static toDTO(model: CollectionModel): CollectionDTO {
    const generalPageDTO = super.toDTO(model);

    const categories: CollectionCategoryDTO[] = JSON.parse(
      model.categories || "[]",
    );

    return {
      ...generalPageDTO,
      collectionID: model.collectionID,
      templateID: model.templateID,
      categories,
    };
  }
}
