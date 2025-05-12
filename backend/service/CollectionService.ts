import { CollectionDTO } from "@/dto/CollectionDTO";
import { collectionRepository } from "../repository/implementation/CollectionRepository.implementation";
import { generalPageRepository } from "../repository/implementation/GeneralPageRepository.implementation";
import { CollectionRepository } from "../repository/interfaces/CollectionRepository.interface";
import { GeneralPageRepository } from "../repository/interfaces/GeneralPageRepository.interface";
import { pageID } from "../domain/entity/GeneralPage";
import { ServiceError } from "../util/error/ServiceError";
import { CollectionMapper } from "../util/mapper/CollectionMapper";
import { ItemTemplateDTORestructure } from "@/dto/ItemTemplateDTO";
import { ItemTemplateMapper } from "../util/mapper/ItemTemplateMapper";
import { BaseRepository } from "../repository/interfaces/BaseRepository.interface";
import { baseRepository } from "../repository/implementation/BaseRepository.implementation";
import { ItemTemplateRepository } from "../repository/interfaces/ItemTemplateRepository.interface";
import { templateRepository } from "../repository/implementation/ItemTemplateRepository.implementation";
import { AttributeRepository } from "../repository/interfaces/AttributeRepository.interface";
import { attributeRepository } from "../repository/implementation/AttributeRepository.implementation";
import { AttributeType } from "@/shared/enum/AttributeType";
import { CollectionCategoryRepository } from "../repository/interfaces/CollectionCategoryRepository.interface";
import { categoryRepository } from "../repository/implementation/CollectionCategoryRepository.implementation";
import { CollectionCategoryDTO } from "@/dto/CollectionCategoryDTO";
import { collectionID } from "../domain/common/IDs";
import { CollectionCategoryMapper } from "../util/mapper/CollectionCategoryMapper";
import { collectionCategoryID } from "../domain/entity/CollectionCategory";
import { itemID } from "../domain/entity/Item";
import { ItemRepository } from "../repository/interfaces/ItemRepository.interface";
import { itemRepository } from "../repository/implementation/ItemRepository.implementation";
import { ItemMapper } from "../util/mapper/ItemMapper";
import { ItemDTO } from "@/dto/ItemDTO";

export class CollectionService {
  constructor(
    private baseRepo: BaseRepository = baseRepository,
    private collectionRepo: CollectionRepository = collectionRepository,
    private generalPageRepo: GeneralPageRepository = generalPageRepository,
    private templateRepo: ItemTemplateRepository = templateRepository,
    private attributeRepo: AttributeRepository = attributeRepository,
    private categoryRepo: CollectionCategoryRepository = categoryRepository,
    private itemRepo: ItemRepository = itemRepository,
  ) {}

  async getCollectionByPageId(pageId: number): Promise<CollectionDTO> {
    try {
      const collection = await this.collectionRepo.getCollection(
        pageID.parse(pageId),
      );
      if (!collection) {
        throw new ServiceError("Note not found.");
      }
      return CollectionMapper.toDTO(collection);
    } catch (error) {
      throw new ServiceError("Failed to retrieve note.");
    }
  }

  async saveCollection(
    collectionDTO: CollectionDTO,
    templateDTO: ItemTemplateDTORestructure,
  ): Promise<number> {
    try {
      const collection = CollectionMapper.toNewEntity(collectionDTO);
      const template = ItemTemplateMapper.toNewEntity(templateDTO);

      const pageId = this.baseRepo.executeTransaction<number>(async (txn) => {
        const retrievedPageId = await this.generalPageRepo.insertPage(
          collection,
          txn,
        );

        const templateId = await this.templateRepo.insertTemplateAndReturnID(
          template,
          txn,
        );

        for (const attr of template.attributes) {
          const attributeID = await this.attributeRepo.insertAttribute(
            attr,
            templateId,
            txn,
          );

          if (attr.type === AttributeType.Multiselect && attr.options) {
            await this.attributeRepo.insertMultiselectOptions(
              attr.options,
              attributeID,
              txn,
            );
          } else if (attr.type === AttributeType.Rating && attr.symbol) {
            await this.attributeRepo.insertRatingSymbol(
              attr.symbol,
              attributeID,
              txn,
            );
          }
        }

        const collectionId = await this.collectionRepo.insertCollection(
          retrievedPageId,
          templateId,
          txn,
        );

        for (const category of collection.categories) {
          await this.categoryRepo.insertCategory(category, collectionId, txn);
        }

        return retrievedPageId;
      });

      return pageId;
    } catch (error) {
      throw new ServiceError("Failed to save collection.");
    }
  }

  async getCollectionCategories(
    collectionId: number,
  ): Promise<CollectionCategoryDTO[]> {
    try {
      const brandedCollectionId = collectionID.parse(collectionId);
      const categories =
        await this.categoryRepo.getCategoriesByCollectionID(
          brandedCollectionId,
        );
      return categories.map(CollectionCategoryMapper.toDTO);
    } catch (error) {
      throw new ServiceError("Failed to retrieve collection categories.");
    }
  }

  async insertCollectionCategory(
    categoryDTO: CollectionCategoryDTO,
  ): Promise<boolean> {
    try {
      console.log("inserting new cat");
      const brandedCollectionID = collectionID.parse(categoryDTO.collectionID);
      const category = CollectionCategoryMapper.toNewEntity(categoryDTO);
      await this.categoryRepo.insertCategory(category, brandedCollectionID);
      return true;
    } catch (error) {
      throw new ServiceError("Failed to retrieve collection categories.");
    }
  }

  async updateCollectionCategory(
    categoryDTO: CollectionCategoryDTO,
  ): Promise<boolean> {
    try {
      const updatedCategory = CollectionCategoryMapper.toNewEntity(categoryDTO);
      const brandedCategoryID = collectionCategoryID.parse(
        categoryDTO.collectionCategoryID,
      );
      await this.categoryRepo.updateCategory(
        updatedCategory,
        brandedCategoryID,
      );
      return true;
    } catch (error) {
      throw new ServiceError("Failed to retrieve collection categories.");
    }
  }

  async deleteCollectionCategoryByID(categoryId: number): Promise<boolean> {
    try {
      const brandedCategoryID = collectionCategoryID.parse(categoryId);
      await this.categoryRepo.deleteCategory(brandedCategoryID);
      return true;
    } catch (error) {
      throw new ServiceError("Failed to retrieve collection categories.");
    }
  }

  async getItemByID(itemId: number): Promise<ItemDTO> {
    try {
      const brandedItemID = itemID.parse(itemId);
      const item = await this.itemRepo.getItemByID(brandedItemID);
      return ItemMapper.toDTO(item);
    } catch (error) {
      throw new ServiceError("Failed to retrieve collection item.");
    }
  }
}

export const collectionService = new CollectionService();
