import { ItemTemplateDTO } from "@/shared/dto/ItemTemplateDTO";
import { ItemTemplateRepository } from "../repository/interfaces/ItemTemplateRepository.interface";
import { ServiceError } from "../util/error/ServiceError";
import { ItemTemplateMapper } from "../util/mapper/ItemTemplateMapper";
import { ItemTemplateID, itemTemplateID } from "../domain/common/IDs";
import { ServiceErrorType } from "@/shared/error/ServiceError";
import { failure, Result, success } from "@/shared/result/Result";
import { ZodError } from "zod";
import { RepositoryErrorNew } from "../util/error/RepositoryError";
import { TemplateErrorMessages } from "@/shared/error/ErrorMessages";

/**
 * ItemTemplateService encapsulates item-template-related application logic.
 *
 * Responsibilities:
 * - Handles and wraps errors in service-specific error types.
 */
export class ItemTemplateService {
  // constructor accepts repo instace
  constructor(private templateRepo: ItemTemplateRepository) {}

  /**
   * Fetch template by its ID.
   *
   * @param templateId - A number representing the template ID
   * @returns A Promise resolving to a `Result` containing either `ItemTemplateDTO` or `ServiceErrorType.
   * @throws ServiceError if retrieval fails.
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
}
