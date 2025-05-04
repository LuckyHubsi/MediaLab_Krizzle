import { GeneralPageDTO } from "@/dto/GeneralPageDTO";
import { generalPageRepository } from "../repository/implementation/GeneralPageRepository.implementation";
import { GeneralPageRepository } from "../repository/interfaces/GeneralPageRepository.interface";
import { ServiceError } from "../util/error/ServiceError";
import { GeneralPageMapper } from "../util/mapper/GeneralPageMapper";
import { pageID } from "../domain/entity/GeneralPage";

export class GeneralPageService {
  constructor(
    private generalPageRepo: GeneralPageRepository = generalPageRepository,
  ) {}

  async getAllPages(): Promise<GeneralPageDTO[]> {
    try {
      const pages = await this.generalPageRepo.getAllPages();
      return pages.map(GeneralPageMapper.toDTO);
    } catch (error) {
      throw new ServiceError("Error retrieving all pages.");
    }
  }

  async deletePage(pageId: number): Promise<boolean> {
    try {
      const barndedPageID = pageID.parse(pageId);
      await this.generalPageRepo.deletePage(barndedPageID);
      return true;
    } catch (error) {
      throw new ServiceError("Error deleting page.");
    }
  }
}

export const generalPageService = new GeneralPageService();
