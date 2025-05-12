import {
  Collection,
  collectionSchema,
  createNewCollectionSchema,
  NewCollection,
} from "@/backend/domain/entity/Collection";
import { CollectionDTO } from "@/dto/CollectionDTO";
import { TagMapper } from "./TagMapper";
import { CollectionCategoryMapper } from "./CollectionCategoryMapper";
import { CollectionModel } from "@/backend/repository/model/CollectionModel";
import { pageID } from "@/backend/domain/entity/GeneralPage";
import { itemTemplateID } from "@/backend/domain/entity/ItemTemplate";
import { collectionID } from "@/backend/domain/common/IDs";

export class CollectionMapper {
  static toDTO(entity: Collection): CollectionDTO {
    return {
      pageID: entity.pageID,
      page_type: entity.pageType,
      page_title: entity.pageTitle,
      page_icon: entity.pageIcon,
      page_color: entity.pageColor,
      archived: entity.archived,
      pinned: entity.pinned,
      tag: entity.tag ? TagMapper.toDTO(entity.tag) : null,
      collectionID: entity.collectionID,
      templateID: entity.templateID,
      categories: entity.categories
        ? entity.categories.map(CollectionCategoryMapper.toDTO)
        : [],
    };
  }

  static toModel(entity: Collection): CollectionModel {
    return {
      pageID: entity.pageID,
      page_type: entity.pageType,
      page_title: entity.pageTitle,
      page_icon: entity.pageIcon,
      page_color: entity.pageColor,
      date_created: entity.createdAt.toISOString(),
      date_modified: entity.updatedAt.toISOString(),
      archived: entity.archived ? 1 : 0,
      pinned: entity.pinned ? 1 : 0,
      tagID: entity.tag?.tagID ?? null,
      tag_label: entity.tag?.tagLabel,
      collectionID: entity.collectionID,
      templateID: entity.templateID,
      categories: "",
    };
  }

  static toInsertModel(
    entity: NewCollection,
  ): Omit<CollectionModel, "collectionID" | "pageID"> {
    return {
      page_type: entity.pageType,
      page_title: entity.pageTitle,
      page_icon: entity.pageIcon,
      page_color: entity.pageColor,
      date_created: entity.createdAt.toISOString(),
      date_modified: entity.updatedAt.toISOString(),
      archived: entity.archived ? 1 : 0,
      pinned: entity.pinned ? 1 : 0,
      tagID: entity.tag?.tagID ?? null,
      tag_label: entity.tag?.tagLabel,
      templateID: 0,
      categories: "",
    };
  }

  static toNewEntity(dto: CollectionDTO): NewCollection {
    try {
      const parsedDTO = createNewCollectionSchema.parse({
        pageType: dto.page_type,
        pageTitle: dto.page_title,
        pageIcon: dto.page_icon,
        pageColor: dto.page_color,
        archived: dto.archived,
        pinned: dto.pinned,
        tag: dto.tag ? TagMapper.toNewEntity(dto.tag) : null,
        categories: dto.categories
          ? dto.categories.map(CollectionCategoryMapper.toNewEntity)
          : [],
      });
      return parsedDTO;
    } catch (error) {
      console.error("Error mapping CollectionDTO to New Entity");
      throw new Error("Failed to map CollectionDTO to New Entity");
    }
  }

  static toEntity(model: CollectionModel): Collection {
    try {
      return collectionSchema.parse({
        pageID: pageID.parse(model.pageID),
        pageType: model.page_type,
        pageTitle: model.page_title,
        pageIcon: model.page_icon,
        pageColor: model.page_color,
        archived: model.archived === 1,
        pinned: model.pinned === 1,
        tag: model.tagID
          ? TagMapper.toEntity({
              tagID: model.tagID,
              tag_label: model.tag_label!,
              usage_count: 0,
            })
          : null,
        createdAt: new Date(model.date_created),
        updatedAt: new Date(model.date_modified),
        collectionID: collectionID.parse(model.collectionID),
        templateID: itemTemplateID.parse(model.templateID),
        categories: model.categories
          ? JSON.parse(model.categories).map(CollectionCategoryMapper.toEntity)
          : [],
      });
    } catch (error) {
      console.error("Error mapping CollectionModel to Entity:", error);
      throw new Error("Failed to map CollectionModel to Entity");
    }
  }
}
