import { ItemTemplateDTO } from "@/shared/dto/ItemTemplateDTO";
import { ItemTemplateRepository } from "../repository/interfaces/ItemTemplateRepository.interface";
import { ItemTemplateMapper } from "../util/mapper/ItemTemplateMapper";
import {
  attributeID,
  ItemTemplateID,
  itemTemplateID,
  pageID,
  PageID,
} from "../domain/common/IDs";
import { ServiceErrorType } from "@/shared/error/ServiceError";
import { failure, Result, success } from "@/shared/result/Result";
import { ZodError } from "zod";
import { RepositoryErrorNew } from "../util/error/RepositoryError";
import { TemplateErrorMessages } from "@/shared/error/ErrorMessages";
import { AttributeDTO } from "@/shared/dto/AttributeDTO";
import { AttributeMapper } from "../util/mapper/AttributeMapper";
import { Attribute, NewAttribute } from "../domain/common/Attribute";
import { AttributeRepository } from "../repository/interfaces/AttributeRepository.interface";
import { AttributeType } from "@/shared/enum/AttributeType";
import { ItemRepository } from "../repository/interfaces/ItemRepository.interface";
import { ItemAttributeValue } from "../domain/entity/Item";

/**
 * ItemTemplateService encapsulates item-template-related application logic.
 *
 * Responsibilities:
 * - Handles and wraps errors in service-specific error types.
 */
export class ItemTemplateService {
  // constructor accepts repo instace
  constructor(
    private templateRepo: ItemTemplateRepository,
    private attributeRepo: AttributeRepository,
    private itemRepo: ItemRepository,
  ) {}

  /**
   * Fetch template by its ID.
   *
   * @param templateId - A number representing the template ID
   * @returns A Promise resolving to a `Result` containing either `ItemTemplateDTO` or `ServiceErrorType.
   */
  async getTemplate(
    templateId: number,
  ): Promise<Result<ItemTemplateDTO, ServiceErrorType>> {
    try {
      const brandedTemplateID: ItemTemplateID =
        itemTemplateID.parse(templateId);
      const template =
        await this.templateRepo.getItemTemplateById(brandedTemplateID);
      return success(ItemTemplateMapper.toDTO(template));
    } catch (error) {
      if (
        error instanceof ZodError ||
        (error instanceof RepositoryErrorNew && error.type === "Not Found")
      ) {
        return failure({
          type: "Not Found",
          message: TemplateErrorMessages.notFound,
        });
      } else if (
        error instanceof RepositoryErrorNew &&
        error.type === "Fetch Failed"
      ) {
        return failure({
          type: "Retrieval Failed",
          message: TemplateErrorMessages.loadingTemplate,
        });
      } else {
        return failure({
          type: "Unknown Error",
          message: TemplateErrorMessages.unknown,
        });
      }
    }
  }

  /**
   * Update the attributes per template.
   *
   * @param templateId - A number representing the template ID.
   * @param existingAttributes - An array of `AttributeDTO`s that were already a part of the template.
   * @param newAttributes - An array of `AttributeDTO`s that were not yet a part of the template.
   * @param pageId - A number representing the page ID of the page the template belongs to.
   * @returns A Promise resolving to a `Result` containing either `true` or `ServiceErrorType`.
   */
  async updateTemplate(
    templateId: number,
    existingAttributes: AttributeDTO[],
    newAttributes: AttributeDTO[],
    pageId: number,
  ): Promise<Result<boolean, ServiceErrorType>> {
    try {
      const brandedTemplateID: ItemTemplateID =
        itemTemplateID.parse(templateId);
      const brandedPageID: PageID = pageID.parse(pageId);

      const existingAttributeEntities: Attribute[] = existingAttributes.map(
        AttributeMapper.toUpdatedEntity,
      );
      const newAttributeEntities: NewAttribute[] = newAttributes.map(
        AttributeMapper.toNewEntity,
      );

      // starts transaction to update the whole template
      await this.templateRepo.executeTransaction(async (txn) => {
        // first retrieve all the item IDs of all items in the relevant page - to update or input default values if necessary
        const itemIDs = await this.itemRepo.getItemIDs(brandedPageID);

        // loops through existing attributes and updates them as well as extras (options and symbol)
        for (const existingAttr of existingAttributeEntities) {
          await this.attributeRepo.updateAttribute(existingAttr, txn);
          if (
            existingAttr.type === AttributeType.Multiselect &&
            existingAttr.options !== null &&
            existingAttr.options !== undefined
          ) {
            const currentOptions = existingAttr.options;

            await this.attributeRepo.updateMultiselectOptions(
              existingAttr.options,
              existingAttr.attributeID,
              txn,
            );

            // loop through itemIDs to retrieve all their multiselect values by itemID and attributeID
            for (const itemId of itemIDs) {
              const multiselectValues =
                await this.itemRepo.getMultiselectValues(
                  itemId,
                  existingAttr.attributeID,
                  txn,
                );

              // filter the item multiselect values to only include the current options
              if (multiselectValues && multiselectValues?.length > 0) {
                const filtered = multiselectValues.filter((value) =>
                  currentOptions.includes(value),
                );

                // check whether the old values and filtered values differ
                if (
                  JSON.stringify(multiselectValues) !== JSON.stringify(filtered)
                ) {
                  const stringifiedValues = filtered
                    ? JSON.stringify(filtered)
                    : null;

                  // save the new filtered values
                  await this.itemRepo.updateMultiselectValue(
                    itemId,
                    existingAttr.attributeID,
                    stringifiedValues,
                    txn,
                  );
                }
              }
            }
          } else if (
            existingAttr.type === AttributeType.Rating &&
            existingAttr.symbol
          ) {
            await this.attributeRepo.updateRatingSymbol(
              existingAttr.symbol,
              existingAttr.attributeID,
              txn,
            );
          }
        }

        // if there are new attributes it loops throught them to insert them
        // inserts item attribute default values as well to avoid conflicts later on
        if (newAttributeEntities.length >= 1) {
          // loop through new attributes to insert
          for (const newAttr of newAttributeEntities) {
            // insert new attribute
            const newID = await this.attributeRepo.insertAttribute(
              newAttr,
              brandedTemplateID,
              txn,
            );
            // inserts optional things like options and symbol if relevant
            if (newAttr.type === AttributeType.Multiselect && newAttr.options) {
              await this.attributeRepo.insertMultiselectOptions(
                newAttr.options,
                newID,
                txn,
              );
            } else if (
              newAttr.type === AttributeType.Rating &&
              newAttr.symbol
            ) {
              await this.attributeRepo.insertRatingSymbol(
                newAttr.symbol,
                newID,
                txn,
              );
            }

            // defines the default values for the item values to be input
            const defaultAttributeValue: ItemAttributeValue = {
              ...newAttr,
              attributeID: newID,
              valueString: null,
              displayText: null,
              valueMultiselect: null,
              valueNumber: 0,
            };

            // for each item insert the default attribute values with the itemID and new attributeID
            for (const itemId of itemIDs) {
              switch (newAttr.type) {
                case AttributeType.Text:
                  await this.itemRepo.insertTextValue(
                    defaultAttributeValue,
                    itemId,
                    txn,
                  );
                  break;
                case AttributeType.Date:
                  await this.itemRepo.insertDateValue(
                    defaultAttributeValue,
                    itemId,
                    txn,
                  );
                  break;
                case AttributeType.Rating:
                  await this.itemRepo.insertRatingValue(
                    defaultAttributeValue,
                    itemId,
                    txn,
                  );
                  break;
                case AttributeType.Multiselect:
                  await this.itemRepo.insertMultiselectValue(
                    defaultAttributeValue,
                    itemId,
                    txn,
                  );
                  break;
                case AttributeType.Image:
                  await this.itemRepo.insertImageValue(
                    defaultAttributeValue,
                    itemId,
                    txn,
                  );
                  break;
                case AttributeType.Link:
                  await this.itemRepo.insertLinkValue(
                    defaultAttributeValue,
                    itemId,
                    txn,
                  );
                  break;
                default:
                  break;
              }
            }
          }
        }
      });

      // returns true on success
      return success(true);
    } catch (error) {
      if (
        error instanceof ZodError ||
        (error instanceof RepositoryErrorNew &&
          error.type === "Update Failed") ||
        (error instanceof RepositoryErrorNew &&
          error.type === "Insert Failed") ||
        (error instanceof RepositoryErrorNew &&
          error.type === "Transaction Failed")
      ) {
        return failure({
          type: "Retrieval Failed",
          message: TemplateErrorMessages.editTemplate,
        });
      } else {
        return failure({
          type: "Unknown Error",
          message: TemplateErrorMessages.unknown,
        });
      }
    }
  }
}
