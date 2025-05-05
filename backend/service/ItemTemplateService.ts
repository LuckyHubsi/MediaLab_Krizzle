import { ItemTemplateDTORestructure } from "@/dto/ItemTemplateDTO";
import { templateRepository } from "../repository/implementation/ItemTemplateRepository.implementation";
import { ItemTemplateRepository } from "../repository/interfaces/ItemTemplateRepository.interface";
import { itemTemplateID, ItemTemplateID } from "../domain/entity/ItemTemplate";
import { ServiceError } from "../util/error/ServiceError";
import { ItemTemplateMapper } from "../util/mapper/ItemTemplateMapper";

export class ItemTemplateService {
  constructor(
    private templateRepo: ItemTemplateRepository = templateRepository,
  ) {}

  async getItemTemplate(
    templateId: number,
  ): Promise<ItemTemplateDTORestructure> {
    try {
      const brandedTemplateID: ItemTemplateID =
        itemTemplateID.parse(templateId);
      const template =
        await this.templateRepo.getItemTemplateById(brandedTemplateID);
      return ItemTemplateMapper.toDTO(template);
    } catch (error) {
      throw new ServiceError("Error retrieving all pages.");
    }
  }
}

export const templateService = new ItemTemplateService();
