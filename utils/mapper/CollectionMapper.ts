import { CollectionModel } from "@/models/CollectionModel";
import { CollectionDTO } from "@/dto/CollectionDTO";
import { GeneralPageMapper } from "./GeneralPageMapper";
import { ItemTemplateDTO } from "@/dto/ItemTemplateDTO";
import { CollectionCategoryDTO } from "@/dto/CollectionCategoryDTO";

export class CollectionMapper extends GeneralPageMapper {
  static toDTO(model: CollectionModel): CollectionDTO {
    const generalPageDTO = super.toDTO(model);

    const template: ItemTemplateDTO = {
      item_templateID: model.item_templateID,
      template_name: model.template_name,
      attributes: JSON.parse(model.attributes),
    };

    const categories: CollectionCategoryDTO[] = JSON.parse(
      model.categories || "[]",
    );

    return {
      ...generalPageDTO,
      collectionID: model.collectionID,
      template,
      categories,
    };
  }
}
