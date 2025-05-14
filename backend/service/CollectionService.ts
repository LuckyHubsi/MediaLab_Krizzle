import { CollectionDTO } from "@/dto/CollectionDTO";
import { collectionRepository } from "../repository/implementation/CollectionRepository.implementation";
import { generalPageRepository } from "../repository/implementation/GeneralPageRepository.implementation";
import { CollectionRepository } from "../repository/interfaces/CollectionRepository.interface";
import { GeneralPageRepository } from "../repository/interfaces/GeneralPageRepository.interface";
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
import { collectionID, itemID, pageID } from "../domain/common/IDs";
import { CollectionCategoryMapper } from "../util/mapper/CollectionCategoryMapper";
import { ItemRepository } from "../repository/interfaces/ItemRepository.interface";
import { itemRepository } from "../repository/implementation/ItemRepository.implementation";
import { ItemMapper } from "../util/mapper/ItemMapper";
import { ItemDTO } from "@/dto/ItemDTO";
import { collectionCategoryID } from "../domain/entity/CollectionCategory";

/**
 * CollectionService encapsulates all collection-related application logic.
 *
 * Responsibilities:
 * - Validates and maps incoming DTOs.
 * - Delegates persistence operations to repositories.
 * - Handles and wraps errors in service-specific error types.
 */
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

  /**
   * Fetch collection by its pageID.
   *
   * @param pageId - A number representing the collection's pageID.
   * @returns A Promise resolving to a `CollectionDTO` object.
   * @throws ServiceError if retrieval fails.
   */
  async getCollectionByPageId(pageId: number): Promise<CollectionDTO> {
    try {
      const brandedPageID = pageID.parse(pageId);
      const collection = await this.collectionRepo.getCollection(brandedPageID);
      if (!collection) {
        throw new ServiceError("Collection not found.");
      }
      return CollectionMapper.toDTO(collection);
    } catch (error) {
      throw new ServiceError("Failed to retrieve collection.");
    }
  }

  /**
   * Saves a new collection to the database within a transaction.
   *
   * This function performs a multi-step process to persist a `CollectionDTO` object:
   * 1. Inserts a general page and obtains its ID.
   * 2. Inserts the associated template and gets its ID.
   * 3. Inserts all attributes related to the template, including multiselect options and rating symbol.
   * 4. Inserts the actual collection using the page and template IDs.
   * 5. Inserts all related categories, linking them to the collection.
   *
   * If any step fails, the entire transaction is rolled back to maintain database integrity.
   *
   * @param collectionDTO - The collectionDTO containing all data needed to create the collection.
   * @param templateDTO - The templateDTO containing all data needed to create the template.
   * @returns A promise that resolves to a pageID if the collection is saved successfully, or rejects with an error.
   *
   * @throws ServiceError if insert fails.
   */
  async saveCollection(
    collectionDTO: CollectionDTO,
    templateDTO: ItemTemplateDTORestructure,
  ): Promise<number> {
    try {
      // validate the user input
      const collection = CollectionMapper.toNewEntity(collectionDTO);
      const template = ItemTemplateMapper.toNewEntity(templateDTO);

      const pageId = this.baseRepo.executeTransaction<number>(async (txn) => {
        // 1. Insert general page, retrieve ID
        const retrievedPageId = await this.generalPageRepo.insertPage(
          collection,
          txn,
        );

        // 2. Insert template, retrieve ID
        const templateId = await this.templateRepo.insertTemplateAndReturnID(
          template,
          txn,
        );

        // 3. Insert all Attributes
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

        // 4. Inserts Collection, retrieves ID
        const collectionId = await this.collectionRepo.insertCollection(
          retrievedPageId,
          templateId,
          txn,
        );

        // 5. Insert Categories
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

  /**
   * Fetch categories by collectionID.
   *
   * @param collectionId - A number representing the collection the categories belong to.
   * @returns A Promise resolving to an array of `CollectionCategoryDTO` objects.
   * @throws ServiceError if retrieval fails.
   */
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

  /**
   * Insert new category.
   *
   * @param categoryDTO - A `CollectionCategoryDTO` to be saved.
   * @returns A Promise resolving to true on success.
   * @throws ServiceError if retrieval fails.
   */
  async insertCollectionCategory(
    categoryDTO: CollectionCategoryDTO,
  ): Promise<boolean> {
    try {
      const brandedCollectionID = collectionID.parse(categoryDTO.collectionID);
      const category = CollectionCategoryMapper.toNewEntity(categoryDTO);
      await this.categoryRepo.insertCategory(category, brandedCollectionID);
      return true;
    } catch (error) {
      throw new ServiceError("Failed to insert collection category.");
    }
  }

  /**
   * Update an existing category.
   *
   * @param categoryDTO - A `CollectionCategoryDTO` to be updated.
   * @returns A Promise resolving to true on success.
   * @throws ServiceError if update fails.
   */
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
      throw new ServiceError("Failed to update collection category.");
    }
  }

  /**
   * Deleting a category.
   *
   * @param categoryId - A number representing the categoryID.
   * @returns A Promise resolving to true on success.
   * @throws ServiceError if update fails.
   */
  async deleteCollectionCategoryByID(categoryId: number): Promise<boolean> {
    try {
      const brandedCategoryID = collectionCategoryID.parse(categoryId);
      await this.categoryRepo.deleteCategory(brandedCategoryID);
      return true;
    } catch (error) {
      throw new ServiceError("Failed to retrieve collection categories.");
    }
  }

  /**
   * Fetches an item and its values.
   *
   * @param itemId - A number representing the itemID.
   * @returns A Promise resolving to `ItemDTO` on succes.
   * @throws ServiceError if fetch fails.
   */
  async getItemByID(itemId: number): Promise<ItemDTO> {
    try {
      const brandedItemID = itemID.parse(itemId);
      const item = await this.itemRepo.getItemByID(brandedItemID);
      return ItemMapper.toDTO(item);
    } catch (error) {
      throw new ServiceError("Failed to retrieve collection item.");
    }
  }

  /**
   * Inserts an item and its values.
   *
   * @param itemDTO - An `ItemDTO` representing the item and values to be inserted.
   * @returns A Promise resolving to a number reresenting the itemID on success.
   * @throws ServiceError if insert fails.
   */
  async insertItemAndReturnID(itemDTO: ItemDTO): Promise<number> {
    try {
      const item = ItemMapper.toNewEntity(itemDTO);
      const categoryId = collectionCategoryID.parse(itemDTO.categoryID);
      const itemId = this.baseRepo.executeTransaction<number>(async (txn) => {
        const retrievedItemID = await this.itemRepo.insertItemAndReturnID(
          item.pageID,
          categoryId,
        );

        // dependent on the attribute type it calls the appropriate repo method
        item.attributeValues.forEach((attributeValue) => {
          switch (attributeValue.type) {
            case AttributeType.Text:
              this.itemRepo.insertTextValue(
                attributeValue,
                retrievedItemID,
                txn,
              );
              break;
            case AttributeType.Date:
              this.itemRepo.insertDateValue(
                attributeValue,
                retrievedItemID,
                txn,
              );
              break;
            case AttributeType.Rating:
              this.itemRepo.insertRatingValue(
                attributeValue,
                retrievedItemID,
                txn,
              );
              break;
            case AttributeType.Multiselect:
              this.itemRepo.insertMultiselectValue(
                attributeValue,
                retrievedItemID,
                txn,
              );
              break;
            default:
              break;
          }
        });

        // update the last modified date of the collection
        await this.generalPageRepo.updateDateModified(item.pageID, txn);

        return retrievedItemID;
      });
      return itemId;
    } catch (error) {
      throw new ServiceError("Failed to insert collection item.");
    }
  }

  /**
   * Deletes an item and its values.
   *
   * @param itemId - An number representing the item id.
   * @returns A Promise resolving to true on success.
   * @throws ServiceError if insert fails.
   */
  async deleteItemById(itemId: number): Promise<boolean> {
    try {
      const brandedItemID = itemID.parse(itemId);
      const success = await this.baseRepo.executeTransaction<boolean>(
        async (txn) => {
          await this.itemRepo.deleteItemValues(brandedItemID, txn);
          const pageId = await this.itemRepo.deleteItem(brandedItemID, txn);
          await this.generalPageRepo.updateDateModified(pageId, txn);
          return true;
        },
      );
      return true;
    } catch (error) {
      throw new ServiceError("Failed to delete collection item.");
    }
  }

  /**
   * Updates an item and its values.
   *
   * @param itemDTO - An `ItemDTO` representing the item and values to be updated.
   * @returns A Promise resolving to true on success.
   * @throws ServiceError if insert fails.
   */
  async editItemByID(itemDTO: ItemDTO): Promise<boolean> {
    try {
      const newItem = ItemMapper.toNewEntity(itemDTO);
      const itemId = itemID.parse(itemDTO.itemID);
      const pageId = pageID.parse(itemDTO.pageID);
      const categoryId = collectionCategoryID.parse(itemDTO.categoryID);

      const success = await this.baseRepo.executeTransaction<boolean>(
        async (txn) => {
          this.itemRepo.updateItem(itemId, categoryId, txn);

          // dependent on the attribute type it calls the appropriate repo method for all attribute values
          for (const value of newItem.attributeValues) {
            switch (value.type) {
              case AttributeType.Text:
                if ("valueString" in value && value.valueString) {
                  this.itemRepo.updateTextValue(
                    itemId,
                    value.attributeID,
                    value.valueString,
                    txn,
                  );
                }
                break;
              case AttributeType.Date:
                if ("valueString" in value && value.valueString) {
                  this.itemRepo.updateDateValue(
                    itemId,
                    value.attributeID,
                    value.valueString,
                    txn,
                  );
                }
                break;
              case AttributeType.Rating:
                if ("valueNumber" in value && value.valueNumber) {
                  this.itemRepo.updateRatingValue(
                    itemId,
                    value.attributeID,
                    value.valueNumber,
                    txn,
                  );
                }
                break;
              case AttributeType.Multiselect:
                if ("valueMultiselect" in value && value.valueMultiselect) {
                  const stringifiedValues = JSON.stringify(
                    value.valueMultiselect,
                  );
                  this.itemRepo.updateMultiselectValue(
                    itemId,
                    value.attributeID,
                    stringifiedValues,
                    txn,
                  );
                }
                break;
              default:
                break;
            }
          }
          // update the last modified date of the collection
          await this.generalPageRepo.updateDateModified(pageId, txn);
          return true;
        },
      );

      return success;
    } catch (error) {
      throw new ServiceError("Failed to update collection item.");
    }
  }
}

export const collectionService = new CollectionService();
