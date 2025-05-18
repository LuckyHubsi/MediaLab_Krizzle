import { generalPageRepository } from "../repository/implementation/GeneralPageRepository.implementation";
import { GeneralPageRepository } from "../repository/interfaces/GeneralPageRepository.interface";
// import { ServiceError } from "../util/error/ServiceError";
import { GeneralPageMapper } from "../util/mapper/GeneralPageMapper";
import { GeneralPage, NewGeneralPage } from "../domain/entity/GeneralPage";
import { GeneralPageState } from "@/shared/enum/GeneralPageState";
import { PageID, pageID } from "../domain/common/IDs";
import { GeneralPageDTO } from "@/shared/dto/GeneralPageDTO";
import { failure, Result, success } from "@/shared/result/Result";
import { ServiceError } from "@/shared/error/Error";
import { ZodError } from "zod";

/**
 * GeneralPageService encapsulates all general-page-related application logic.
 *
 * Responsibilities:
 * - Validates and maps incoming GeneralPageDTOs.
 * - Delegates persistence operations to GeneralPageRepository.
 * - Handles and wraps errors in service-specific error types.
 */
export class GeneralPageService {
  constructor(
    private generalPageRepo: GeneralPageRepository = generalPageRepository,
  ) {}

  /**
   * Fetch pages by state (sorted, pinned, or archived).
   *
   * @param pageState - Enum - the state of the pages to be retrieved (sorted, pinned, archived)
   * @returns A Promise resolving to an array of `GeneralPageDTO` objects.
   * @throws ServiceError if retrieval fails.
   */
  async getAllGeneralPageData(
    pageState: GeneralPageState,
  ): Promise<GeneralPageDTO[]> {
    try {
      let pages: GeneralPage[] = [];
      switch (pageState) {
        case GeneralPageState.GeneralModfied:
          pages = await this.generalPageRepo.getAllPagesSortedByModified();
          break;
        case GeneralPageState.GeneralCreated:
          pages = await this.generalPageRepo.getAllPagesSortedByCreated();
          break;
        case GeneralPageState.GeneralAlphabet:
          pages = await this.generalPageRepo.getAllPagesSortedByAlphabet();
          break;
        case GeneralPageState.Archived:
          pages = await this.generalPageRepo.getAllArchivedPages();
          break;
        case GeneralPageState.Pinned:
          pages = await this.generalPageRepo.getAllPinnedPages();
          break;
        default:
          break;
      }
      return pages.map(GeneralPageMapper.toDTO);
    } catch (error) {
      throw new ServiceError("Error retrieving all pages.");
    }
  }

  /**
   * Fetch a single page by its ID.
   *
   * @param pageId - Number representing the pageID.
   * @returns A Promise resolving to a `GeneralPageDTO`.
   * @throws ServiceError if retrieval fails.
   */
  async getGeneralPageByID(pageId: number): Promise<GeneralPageDTO> {
    try {
      const brandedPageID: PageID = pageID.parse(pageId);
      const page = await this.generalPageRepo.getByPageID(brandedPageID);
      return GeneralPageMapper.toDTO(page);
    } catch (error) {
      throw new ServiceError("Error retrieving page by id.");
    }
  }

  /**
   * Updates a single page.
   *
   * @param pageDTO - `GeneralPageDTO` representing the updated page data.
   * @returns A Promise resolving to true on success.
   * @throws ServiceError if udpate fails.
   */
  async updateGeneralPageData(pageDTO: GeneralPageDTO): Promise<boolean> {
    try {
      const updatedPage: GeneralPage =
        GeneralPageMapper.toUpdatedEntity(pageDTO);
      await this.generalPageRepo.updateGeneralPageData(
        updatedPage.pageID,
        updatedPage,
      );
      return true;
    } catch (error) {
      throw new ServiceError("Error updating page.");
    }
  }

  /**
   * Updates the pin status of a general page.
   *
   * @param pageId - Number representing the pageID.
   * @param currentPinStatus - Boolean representing the page's current pin status.
   * @returns A Promise resolving to true on success.
   * @throws ServiceError if udpate fails.
   */
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

  /**
   * Updates the archive status of a general page.
   *
   * @param pageId - Number representing the pageID.
   * @param currentArchiveStatus - Boolean representing the page's current archive status.
   * @returns A Promise resolving to true on success.
   * @throws ServiceError if udpate fails.
   */
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
      throw new ServiceError("Error updating archive status.");
    }
  }

  /**
   * Deletes a general page.
   *
   * @param pageId - Number representing the pageID.
   * @returns A Promise resolving to true on success.
   * @throws ServiceError if delete fails.
   */
  async deleteGeneralPage(pageId: number): Promise<boolean> {
    try {
      const brandedPageID = pageID.parse(pageId);
      await this.generalPageRepo.deletePage(brandedPageID);
      return true;
    } catch (error) {
      throw new ServiceError("Error deleting page.");
    }
  }
}

// Singleton instance of the GeneralPageService.
export const generalPageService = new GeneralPageService();
