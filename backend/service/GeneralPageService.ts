import { GeneralPageDTO } from "@/dto/GeneralPageDTO";
import { generalPageRepository } from "../repository/implementation/GeneralPageRepository.implementation";
import { GeneralPageRepository } from "../repository/interfaces/GeneralPageRepository.interface";
import { ServiceError } from "../util/error/ServiceError";
import { GeneralPageMapper } from "../util/mapper/GeneralPageMapper";
import { GeneralPage, pageID } from "../domain/entity/GeneralPage";
import { GeneralPageState } from "@/shared/enum/GeneralPageState";

export class GeneralPageService {
  constructor(
    private generalPageRepo: GeneralPageRepository = generalPageRepository,
  ) {}

  async getAllGeneralPageData(
    pageState: GeneralPageState,
  ): Promise<GeneralPageDTO[]> {
    try {
      let pages: GeneralPage[] = [];
      switch (pageState) {
        case GeneralPageState.GeneralModfied:
          pages = await generalPageRepository.getAllPagesSortedByModified();
          break;
        case GeneralPageState.GeneralAlphabet:
          pages = await generalPageRepository.getAllPagesSortedByAlphabet();
          break;
        case GeneralPageState.Archived:
          pages = await generalPageRepository.getAllArchivedPages();
          break;
        case GeneralPageState.Pinned:
          pages = await generalPageRepository.getAllPinnedPages();
          break;
        default:
          break;
      }
      return pages.map(GeneralPageMapper.toDTO);
    } catch (error) {
      throw new ServiceError("Error retrieving all pages.");
    }
  }

  async deletePage(pageId: number): Promise<boolean> {
    try {
      const brandedPageID = pageID.parse(pageId);
      await this.generalPageRepo.deletePage(brandedPageID);
      return true;
    } catch (error) {
      throw new ServiceError("Error deleting page.");
    }
  }
}

export const generalPageService = new GeneralPageService();
