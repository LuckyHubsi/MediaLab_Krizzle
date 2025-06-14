import { CollectionDTO } from "@/shared/dto/CollectionDTO";
import { CollectionRepository } from "../repository/interfaces/CollectionRepository.interface";
import { GeneralPageRepository } from "../repository/interfaces/GeneralPageRepository.interface";
import { CollectionMapper } from "../util/mapper/CollectionMapper";
import { ItemTemplateMapper } from "../util/mapper/ItemTemplateMapper";
import { BaseRepository } from "../repository/interfaces/BaseRepository.interface";
import { ItemTemplateRepository } from "../repository/interfaces/ItemTemplateRepository.interface";
import { AttributeRepository } from "../repository/interfaces/AttributeRepository.interface";
import { AttributeType } from "@/shared/enum/AttributeType";
import { CollectionCategoryRepository } from "../repository/interfaces/CollectionCategoryRepository.interface";
import { CollectionCategoryDTO } from "@/shared/dto/CollectionCategoryDTO";
import { collectionID, itemID, PageID, pageID } from "../domain/common/IDs";
import { CollectionCategoryMapper } from "../util/mapper/CollectionCategoryMapper";
import { ItemRepository } from "../repository/interfaces/ItemRepository.interface";
import { ItemMapper } from "../util/mapper/ItemMapper";
import { ItemDTO } from "@/shared/dto/ItemDTO";
import { collectionCategoryID } from "../domain/entity/CollectionCategory";
import { ItemsDTO } from "@/shared/dto/ItemsDTO";
import { ItemTemplateDTO } from "@/shared/dto/ItemTemplateDTO";
import * as FileSystem from "expo-file-system";
import { Item } from "@/backend/domain/entity/Item";
import { selectImageValuesByPageIdQuery } from "../repository/query/ItemQuery";
import { ZodError } from "zod";
import { RepositoryErrorNew } from "../util/error/RepositoryError";
import {
  CategoryErrorMessages,
  CollectionErrorMessages,
  ItemErrorMessages,
} from "@/shared/error/ErrorMessages";
import { failure, Result, success } from "@/shared/result/Result";
import { ServiceErrorType } from "@/shared/error/ServiceError";

/**
 * CollectionService encapsulates all collection-related application logic.
 *
 * Responsibilities:
 * - Validates and maps incoming DTOs.
 * - Delegates persistence operations to repositories.
 * - Handles and wraps errors in service-specific error types.
 */
export class CollectionService {
  // constructor accepts repo instaces
  constructor(
    private baseRepo: BaseRepository,
    private collectionRepo: CollectionRepository,
    private generalPageRepo: GeneralPageRepository,
    private templateRepo: ItemTemplateRepository,
    private attributeRepo: AttributeRepository,
    private categoryRepo: CollectionCategoryRepository,
    private itemRepo: ItemRepository,
  ) {}

  /**
   * Fetch collection by its pageID.
   *
   * @param pageId - A number representing the collection's pageID.
   * @returns  Promise resolving to a `Result` containing either a `CollectionDTO` or `ServiceTypeError`.
   */
  async getCollectionByPageId(
    pageId: number,
  ): Promise<Result<CollectionDTO, ServiceErrorType>> {
    try {
      const brandedPageID = pageID.parse(pageId);
      const collection = await this.collectionRepo.getCollection(brandedPageID);
      return success(CollectionMapper.toDTO(collection));
    } catch (error) {
      if (
        error instanceof ZodError ||
        (error instanceof RepositoryErrorNew && error.type === "Not Found")
      ) {
        return failure({
          type: "Not Found",
          message: CollectionErrorMessages.notFound,
        });
      } else if (
        error instanceof RepositoryErrorNew &&
        error.type === "Fetch Failed"
      ) {
        return failure({
          type: "Retrieval Failed",
          message: CollectionErrorMessages.loadingCollection,
        });
      } else {
        return failure({
          type: "Unknown Error",
          message: CollectionErrorMessages.unknown,
        });
      }
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
   * @returns Promise resolving to a `Result` containing either a `number` (new pageID) or `ServiceTypeError`.
   */
  async saveCollection(
    collectionDTO: CollectionDTO,
    templateDTO: ItemTemplateDTO,
  ): Promise<Result<number, ServiceErrorType>> {
    try {
      // validate the user input
      const collection = CollectionMapper.toNewEntity(collectionDTO);
      const template = ItemTemplateMapper.toNewEntity(templateDTO);

      const pageId = await this.baseRepo.executeTransaction<number>(
        async (txn) => {
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
        },
      );

      return success(pageId);
    } catch (error) {
      if (error instanceof ZodError) {
        return failure({
          type: "Validation Error",
          message: CollectionErrorMessages.validateNewCollection,
        });
      } else if (
        (error instanceof RepositoryErrorNew &&
          error.type === "Insert Failed") ||
        (error instanceof RepositoryErrorNew &&
          error.type === "Transaction Failed")
      ) {
        return failure({
          type: "Creation Failed",
          message: CollectionErrorMessages.insertNewCollection,
        });
      } else {
        return failure({
          type: "Unknown Error",
          message: CollectionErrorMessages.unknown,
        });
      }
    }
  }

  /**
   * Fetch categories by collectionID.
   *
   * @param collectionId - A number representing the collection the categories belong to.
   * @returns Promise resolving to a `Result` containing either a `CollectionCategoryDTO[]` or `ServiceErrorType`
   */
  async getCollectionCategories(
    collectionId: number,
  ): Promise<Result<CollectionCategoryDTO[], ServiceErrorType>> {
    try {
      const brandedCollectionId = collectionID.parse(collectionId);
      const categories =
        await this.categoryRepo.getCategoriesByCollectionID(
          brandedCollectionId,
        );
      return success(categories.map(CollectionCategoryMapper.toDTO));
    } catch (error) {
      if (
        error instanceof RepositoryErrorNew &&
        error.type === "Fetch Failed"
      ) {
        return failure({
          type: "Retrieval Failed",
          message: CategoryErrorMessages.loadingAllCategories,
        });
      } else {
        return failure({
          type: "Unknown Error",
          message: CategoryErrorMessages.unknown,
        });
      }
    }
  }

  /**
   * Insert new category.
   *
   * @param categoryDTO - A `CollectionCategoryDTO` to be saved.
   * @param pageId - A `number` representing the pageID of the page to be updated.
   * @returns A Promise resolving to a `Result` containing either `true` or `ServiceErrorType`
   */
  async insertCollectionCategory(
    categoryDTO: CollectionCategoryDTO,
    pageId: number,
  ): Promise<Result<boolean, ServiceErrorType>> {
    try {
      const brandedPageID = pageID.parse(pageId);
      const brandedCollectionID = collectionID.parse(categoryDTO.collectionID);
      const category = CollectionCategoryMapper.toNewEntity(categoryDTO);
      await this.baseRepo.executeTransaction(async (txn) => {
        await this.categoryRepo.insertCategory(
          category,
          brandedCollectionID,
          txn,
        );
        await this.generalPageRepo.updateDateModified(brandedPageID, txn);
      });
      return success(true);
    } catch (error) {
      if (error instanceof ZodError) {
        return failure({
          type: "Validation Error",
          message: CategoryErrorMessages.validateNewCollectionCat,
        });
      } else if (
        (error instanceof RepositoryErrorNew &&
          error.type === "Insert Failed") ||
        (error instanceof RepositoryErrorNew &&
          error.type === "Transaction Failed")
      ) {
        return failure({
          type: "Creation Failed",
          message: CategoryErrorMessages.insertNewCollectionCat,
        });
      } else {
        return failure({
          type: "Unknown Error",
          message: CategoryErrorMessages.unknown,
        });
      }
    }
  }

  /**
   * Update an existing category.
   *
   * @param categoryDTO - A `CollectionCategoryDTO` to be updated.
   * @param pageId - A `number` representing the pageID of the page to be updated.
   * @returns A Promise resolving to a `Result` containing either `true` or `ServiceErrorType`
   */
  async updateCollectionCategory(
    categoryDTO: CollectionCategoryDTO,
    pageId: number,
  ): Promise<Result<boolean, ServiceErrorType>> {
    try {
      const brandedPageID = pageID.parse(pageId);
      const updatedCategory = CollectionCategoryMapper.toNewEntity(categoryDTO);
      const brandedCategoryID = collectionCategoryID.parse(
        categoryDTO.collectionCategoryID,
      );
      await this.baseRepo.executeTransaction(async (txn) => {
        await this.categoryRepo.updateCategory(
          updatedCategory,
          brandedCategoryID,
          txn,
        );
        await this.generalPageRepo.updateDateModified(brandedPageID, txn);
      });
      return success(true);
    } catch (error) {
      if (error instanceof ZodError) {
        return failure({
          type: "Validation Error",
          message: CategoryErrorMessages.validateCategoryToUpdate,
        });
      } else if (
        (error instanceof RepositoryErrorNew &&
          error.type === "Update Failed") ||
        (error instanceof RepositoryErrorNew &&
          error.type === "Transaction Failed")
      ) {
        return failure({
          type: "Update Failed",
          message: CategoryErrorMessages.updateCategory,
        });
      } else {
        return failure({
          type: "Unknown Error",
          message: CategoryErrorMessages.unknown,
        });
      }
    }
  }

  /**
   * Deleting a category.
   *
   * @param categoryId - A number representing the categoryID.
   * @param pageId - A `number` representing the pageID of the page to be updated.
   * @returns A Promise resolving to a `Result` containing either `true` or `ServiceErrorType`
   */
  async deleteCollectionCategoryByID(
    categoryId: number,
    pageId: number,
  ): Promise<Result<boolean, ServiceErrorType>> {
    try {
      const brandedPageID = pageID.parse(pageId);
      const brandedCategoryID = collectionCategoryID.parse(categoryId);
      await this.baseRepo.executeTransaction(async (txn) => {
        await this.categoryRepo.deleteCategory(brandedCategoryID, txn);
        await this.generalPageRepo.updateDateModified(brandedPageID, txn);
      });
      return success(true);
    } catch (error) {
      if (error instanceof ZodError) {
        return failure({
          type: "Validation Error",
          message: CategoryErrorMessages.validateCategoryToDelete,
        });
      } else if (
        (error instanceof RepositoryErrorNew &&
          error.type === "Delete Failed") ||
        (error instanceof RepositoryErrorNew &&
          error.type === "Transaction Failed")
      ) {
        return failure({
          type: "Delete Failed",
          message: CategoryErrorMessages.deleteCategory,
        });
      } else {
        return failure({
          type: "Unknown Error",
          message: CategoryErrorMessages.unknown,
        });
      }
    }
  }

  /**
   * Deletes an image file from the file system.
   *
   * @param imageUri - URI of the image to delete.
   * @returns Promise resolving to true on success.
   * @throws Rethrows error
   */
  private async deleteImageFile(imageUri: string): Promise<boolean> {
    if (!imageUri) return false;

    try {
      const fileInfo = await FileSystem.getInfoAsync(imageUri);

      if (fileInfo.exists) {
        await FileSystem.deleteAsync(imageUri, { idempotent: true });
        console.log("Deleted image file:", imageUri);
        return true;
      }

      return false;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Deletes all image files from the file system tied to a collection.
   *
   * @param pageId - the collection pageID to be deleted.
   * @returns Promise resolving to void.
   * @throws Rethrows error
   */
  async deleteCollectionImages(pageId: number): Promise<void> {
    try {
      const brandedPageID = pageID.parse(pageId);

      const attributes =
        await this.attributeRepo.getPreviewAttributes(brandedPageID);
      const imageAttributeIds: number[] = [];

      attributes.forEach((attr) => {
        if (attr.type === AttributeType.Image) {
          imageAttributeIds.push(attr.attributeID);
        }
      });

      if (imageAttributeIds.length === 0) return;

      const imageValues = await this.baseRepo.fetchAll<{ value: string }>(
        selectImageValuesByPageIdQuery,
        [pageId],
      );

      for (const imgValue of imageValues) {
        if (imgValue.value) {
          await this.deleteImageFile(imgValue.value);
        }
      }
    } catch (error) {
      throw error;
    }
  }

  /**
   * Fetches an item and its values.
   *
   * @param itemId - A number representing the itemID.
   * @returns A Promise resolving to a `Result` containing either an `ItemDTO` or `ServiceErrorType`
   */
  async getItemByID(
    itemId: number,
  ): Promise<Result<ItemDTO, ServiceErrorType>> {
    try {
      const brandedItemID = itemID.parse(itemId);
      const item = await this.itemRepo.getItemByID(brandedItemID);
      return success(ItemMapper.toDTO(item));
    } catch (error) {
      if (
        error instanceof ZodError ||
        (error instanceof RepositoryErrorNew && error.type === "Not Found")
      ) {
        return failure({
          type: "Not Found",
          message: ItemErrorMessages.notFound,
        });
      } else if (
        error instanceof RepositoryErrorNew &&
        error.type === "Fetch Failed"
      ) {
        return failure({
          type: "Retrieval Failed",
          message: ItemErrorMessages.loadingItem,
        });
      } else {
        return failure({
          type: "Unknown Error",
          message: ItemErrorMessages.unknown,
        });
      }
    }
  }

  /**
   * Inserts an item and its values.
   *
   * @param itemDTO - An `ItemDTO` representing the item and values to be inserted.
   * @returns A Promise resolving to a `Result` containing either a `number` (new itemID) or `ServiceErrorType`
   */
  async insertItemAndReturnID(
    itemDTO: ItemDTO,
  ): Promise<Result<number, ServiceErrorType>> {
    try {
      const item = ItemMapper.toNewEntity(itemDTO);
      const categoryId = collectionCategoryID.parse(itemDTO.categoryID);
      const itemId = await this.baseRepo.executeTransaction<number>(
        async (txn) => {
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
              case AttributeType.Image:
                this.itemRepo.insertImageValue(
                  attributeValue,
                  retrievedItemID,
                  txn,
                );
                break;
              case AttributeType.Link:
                if ("valueString" in attributeValue) {
                  this.itemRepo.insertLinkValue(
                    attributeValue,
                    retrievedItemID,
                    txn,
                  );
                }
                break;
              default:
                break;
            }
          });

          // update the last modified date of the collection
          await this.generalPageRepo.updateDateModified(item.pageID, txn);

          return retrievedItemID;
        },
      );
      return success(itemId);
    } catch (error) {
      if (error instanceof ZodError) {
        return failure({
          type: "Validation Error",
          message: ItemErrorMessages.validateNewItem,
        });
      } else if (
        (error instanceof RepositoryErrorNew &&
          error.type === "Insert Failed") ||
        (error instanceof RepositoryErrorNew &&
          error.type === "Transaction Failed")
      ) {
        return failure({
          type: "Creation Failed",
          message: ItemErrorMessages.insertNewItem,
        });
      } else {
        return failure({
          type: "Unknown Error",
          message: ItemErrorMessages.unknown,
        });
      }
    }
  }

  /**
   * Deletes an item and its values.
   *
   * @param itemId - An number representing the item id.
   * @returns A Promise resolving to a `Result` containing either an `ItemDTO` or `ServiceErrorType`
   */
  async deleteItemById(
    itemId: number,
  ): Promise<Result<boolean, ServiceErrorType>> {
    try {
      const brandedItemID = itemID.parse(itemId);

      const item = await this.itemRepo.getItemByID(brandedItemID);
      const imageUris: string[] = [];

      if (item.attributeValues) {
        for (const attr of item.attributeValues) {
          if (
            attr.type === AttributeType.Image &&
            "valueString" in attr &&
            attr.valueString
          ) {
            imageUris.push(attr.valueString);
          }
        }
      }

      const successful = await this.baseRepo.executeTransaction<boolean>(
        async (txn) => {
          await this.itemRepo.deleteItemValues(brandedItemID, txn);
          const pageId = await this.itemRepo.deleteItem(brandedItemID, txn);
          await this.generalPageRepo.updateDateModified(pageId, txn);
          return true;
        },
      );

      for (const uri of imageUris) {
        await this.deleteImageFile(uri);
      }

      return success(true);
    } catch (error) {
      if (error instanceof ZodError) {
        return failure({
          type: "Validation Error",
          message: ItemErrorMessages.validateItemToDelete,
        });
      } else if (
        (error instanceof RepositoryErrorNew &&
          error.type === "Delete Failed") ||
        (error instanceof RepositoryErrorNew &&
          error.type === "Transaction Failed")
      ) {
        return failure({
          type: "Delete Failed",
          message: ItemErrorMessages.deleteItem,
        });
      } else {
        return failure({
          type: "Unknown Error",
          message: ItemErrorMessages.unknown,
        });
      }
    }
  }

  /**
   * Updates an item and its values.
   *
   * @param itemDTO - An `ItemDTO` representing the item and values to be updated.
   * @returns  A Promise resolving to a `Result` containing either a `true` or `ServiceErrorType`
   */
  async editItemByID(
    itemDTO: ItemDTO,
  ): Promise<Result<boolean, ServiceErrorType>> {
    try {
      const newItem = ItemMapper.toNewEntity(itemDTO);
      const itemId = itemID.parse(itemDTO.itemID);
      const pageId = pageID.parse(itemDTO.pageID);
      const categoryId = collectionCategoryID.parse(itemDTO.categoryID);

      const successful = await this.baseRepo.executeTransaction<boolean>(
        async (txn) => {
          this.itemRepo.updateItem(itemId, categoryId, txn);

          // dependent on the attribute type it calls the appropriate repo method for all attribute values
          for (const value of newItem.attributeValues) {
            switch (value.type) {
              case AttributeType.Text:
                if ("valueString" in value) {
                  this.itemRepo.updateTextValue(
                    itemId,
                    value.attributeID,
                    value.valueString ?? null,
                    txn,
                  );
                }
                break;
              case AttributeType.Date:
                if ("valueString" in value) {
                  this.itemRepo.updateDateValue(
                    itemId,
                    value.attributeID,
                    value.valueString ?? null,
                    txn,
                  );
                }
                break;
              case AttributeType.Rating:
                if ("valueNumber" in value) {
                  this.itemRepo.updateRatingValue(
                    itemId,
                    value.attributeID,
                    value.valueNumber ?? null,
                    txn,
                  );
                }
                break;
              case AttributeType.Multiselect:
                if ("valueMultiselect" in value && value.valueMultiselect) {
                  const stringifiedValues = value.valueMultiselect
                    ? JSON.stringify(value.valueMultiselect)
                    : null;
                  this.itemRepo.updateMultiselectValue(
                    itemId,
                    value.attributeID,
                    stringifiedValues,
                    txn,
                  );
                }
                break;
              case AttributeType.Image:
                if ("valueString" in value) {
                  this.itemRepo.updateImageValue(
                    itemId,
                    value.attributeID,
                    value.valueString ?? null,
                    value.altText ?? null,
                    txn,
                  );
                }
                break;
              case AttributeType.Link:
                if ("valueString" in value) {
                  const displayText =
                    "displayText" in value ? (value.displayText ?? null) : null;
                  this.itemRepo.updateLinkValue(
                    itemId,
                    value.attributeID,
                    value.valueString ?? null,
                    displayText,
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

      return success(true);
    } catch (error) {
      if (error instanceof ZodError) {
        return failure({
          type: "Validation Error",
          message: ItemErrorMessages.validateItemToUpdate,
        });
      } else if (
        (error instanceof RepositoryErrorNew &&
          error.type === "Update Failed") ||
        (error instanceof RepositoryErrorNew &&
          error.type === "Transaction Failed")
      ) {
        return failure({
          type: "Update Failed",
          message: ItemErrorMessages.updateItem,
        });
      } else {
        return failure({
          type: "Unknown Error",
          message: ItemErrorMessages.unknown,
        });
      }
    }
  }

  /**
   * Fetches all items and their preview values.
   *
   * @param pageId - A number representing the pageId of the collection they belong to.
   * @returns A Promise resolving to a `Result` containing either an `ItemsDTO` or `ServiceErrorType`
   */
  async getItemsByPageId(
    pageId: number,
  ): Promise<Result<ItemsDTO, ServiceErrorType>> {
    try {
      const brandedPageID: PageID = pageID.parse(pageId);

      const attributes =
        await this.attributeRepo.getPreviewAttributes(brandedPageID);

      const previewItems = await this.itemRepo.getItemsByID(
        brandedPageID,
        attributes,
      );

      return success(ItemMapper.toItemsDTO(previewItems, attributes));
    } catch (error) {
      if (
        error instanceof RepositoryErrorNew &&
        error.type === "Fetch Failed"
      ) {
        return failure({
          type: "Retrieval Failed",
          message: ItemErrorMessages.loadingAllItems,
        });
      } else {
        return failure({
          type: "Unknown Error",
          message: ItemErrorMessages.unknown,
        });
      }
    }
  }
}
