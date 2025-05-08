import { GeneralPageDTO } from "@/dto/GeneralPageDTO";
import { generalPageRepository } from "../repository/implementation/GeneralPageRepository.implementation";
import { GeneralPageRepository } from "../repository/interfaces/GeneralPageRepository.interface";
import { ServiceError } from "../util/error/ServiceError";
import { GeneralPageMapper } from "../util/mapper/GeneralPageMapper";
import {
  GeneralPage,
  NewGeneralPage,
  PageID,
  pageID,
} from "../domain/entity/GeneralPage";
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

  async getGeneralPageByID(pageId: number): Promise<GeneralPageDTO> {
    try {
      const brandedPageID: PageID = pageID.parse(pageId);
      const page = await generalPageRepository.getByPageID(brandedPageID);
      return GeneralPageMapper.toDTO(page);
    } catch (error) {
      throw new ServiceError("Error retrieving page by id.");
    }
  }

  async updateGeneralPageData(pageDTO: GeneralPageDTO): Promise<boolean> {
    try {
      const updatedPage: NewGeneralPage =
        GeneralPageMapper.toNewEntity(pageDTO);
      const brandedPageID = pageID.parse(pageDTO.pageID);
      await this.generalPageRepo.updateGeneralPageData(
        brandedPageID,
        updatedPage,
      );
      return true;
    } catch (error) {
      throw new ServiceError("Error updating page.");
    }
  }

  async togglePagePin(
    pageId: number,
    currentPinStatus: boolean,
  ): Promise<boolean> {
    try {
      const brandedPageID = pageID.parse(pageId);
      await this.generalPageRepo.updatePin(brandedPageID, currentPinStatus);
      return true;
    } catch (error) {
      throw new ServiceError("Error updating pin status.");
    }
  }

  async togglePageArchive(
    pageId: number,
    currentArchiveStatus: boolean,
  ): Promise<boolean> {
    try {
      const brandedPageID = pageID.parse(pageId);
      await this.generalPageRepo.updateArchive(
        brandedPageID,
        currentArchiveStatus,
      );
      return true;
    } catch (error) {
      throw new ServiceError("Error updating pin status.");
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
