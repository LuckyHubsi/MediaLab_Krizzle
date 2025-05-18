import { ItemTemplateDTO } from "@/shared/dto/ItemTemplateDTO";
import { templateRepository } from "../repository/implementation/ItemTemplateRepository.implementation";
import { ItemTemplateRepository } from "../repository/interfaces/ItemTemplateRepository.interface";
import { ServiceError } from "../util/error/ServiceError";
import { ItemTemplateMapper } from "../util/mapper/ItemTemplateMapper";
import { ItemTemplateID, itemTemplateID } from "../domain/common/IDs";

/**
 * ItemTemplateService encapsulates item-template-related application logic.
 *
 * Responsibilities:
 * - Handles and wraps errors in service-specific error types.
 */
export class ItemTemplateService {
  constructor(
    private templateRepo: ItemTemplateRepository = templateRepository,
  ) {}

  /**
   * Fetch template by its ID.
   *
   * @param templateId - A number representing the template ID
   * @returns A Promise resolving to an `ItemTemplateDTO` object.
   * @throws ServiceError if retrieval fails.
   */
  async getTemplate(templateId: number): Promise<ItemTemplateDTO> {
    try {
      const brandedTemplateID: ItemTemplateID =
        itemTemplateID.parse(templateId);
      const template =
        await this.templateRepo.getItemTemplateById(brandedTemplateID);
      return ItemTemplateMapper.toDTO(template);
    } catch (error) {
      throw new ServiceError("Error retrieving template.");
    }
  }
}

// Singleton instance of the ItemTemplateService.
export const itemTemplateService = new ItemTemplateService();
