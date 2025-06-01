import { GeneralPageRepository } from "../repository/interfaces/GeneralPageRepository.interface";
// import { ServiceError } from "../util/error/ServiceError";
import { GeneralPageMapper } from "../util/mapper/GeneralPageMapper";
import { GeneralPage, NewGeneralPage } from "../domain/entity/GeneralPage";
import { GeneralPageState } from "@/shared/enum/GeneralPageState";
import { folderID, PageID, pageID } from "../domain/common/IDs";
import { GeneralPageDTO } from "@/shared/dto/GeneralPageDTO";
import { ZodError } from "zod";
import { FolderState } from "@/shared/enum/FolderState";
import { ServiceErrorType } from "@/shared/error/ServiceError";
import { failure, Result, success } from "@/shared/result/Result";
import { RepositoryErrorNew } from "../util/error/RepositoryError";
import { PageErrorMessages } from "@/shared/error/ErrorMessages";
// import { collectionService } from "./CollectionService";

/**
 * GeneralPageService encapsulates all general-page-related application logic.
 *
 * Responsibilities:
 * - Validates and maps incoming GeneralPageDTOs.
 * - Delegates persistence operations to GeneralPageRepository.
 * - Handles and wraps errors in service-specific error types.
 */
export class GeneralPageService {
  // constructor accepts repo instace
  constructor(private generalPageRepo: GeneralPageRepository) {}

  /**
   * Fetch pages by state (sorted, pinned, or archived).
   *
   * @param pageState - Enum - the state of the pages to be retrieved (sorted, pinned, archived)
   * @returns A Promise resolving to a `Result` containing either an array of `GeneralPageDTO`s or a `ServiceErrorType`.
   */
  async getAllGeneralPageData(
    pageState: GeneralPageState,
  ): Promise<Result<GeneralPageDTO[], ServiceErrorType>> {
    try {
      let pages: GeneralPage[] = [];
      switch (pageState) {
        case GeneralPageState.GeneralModfied:
          // throw new RepositoryErrorNew("Fetch Failed");
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
      return success(pages.map(GeneralPageMapper.toDTO));
    } catch (error) {
      if (
        error instanceof RepositoryErrorNew &&
        error.type === "Fetch Failed"
      ) {
        let errorMessage: string = "";
        switch (pageState) {
          case GeneralPageState.GeneralModfied:
            errorMessage =
              PageErrorMessages.loadingAllPagesSortedByModificationDate;
            break;
          case GeneralPageState.GeneralCreated:
            errorMessage =
              PageErrorMessages.loadingAllPagesSortedByCreationDate;
            break;
          case GeneralPageState.GeneralAlphabet:
            errorMessage = PageErrorMessages.loadingAllPagesSortedByAlphabet;
            break;
          case GeneralPageState.Archived:
            errorMessage = PageErrorMessages.loadingAllArchivedPages;
            break;
          case GeneralPageState.Pinned:
            errorMessage = PageErrorMessages.loadingAllPinnedPages;
            break;
          default:
            break;
        }
        return failure({
          type: "Retrieval Failed",
          message: errorMessage,
        });
      } else {
        return failure({
          type: "Unknown Error",
          message: PageErrorMessages.unknown,
        });
      }
    }
  }

  /**
   * Fetch pages by state (sorted, pinned, or archived) and parent folder ID.
   *
   * @param sortingMode - Enum - the sorting mode of the folder page
   * @param folderId - The ID representing the folder the page is a part of.
   * @returns A Promise resolving to a `Result` containing either an array of `GeneralPageDTO`s or a `ServiceErrorType`.
   */
  async getAllFolderGeneralPageData(
    sortingMode: FolderState,
    folderId: number,
  ): Promise<Result<GeneralPageDTO[], ServiceErrorType>> {
    try {
      const brandedFolderID = folderID.parse(folderId);
      let pages: GeneralPage[] = [];
      switch (sortingMode) {
        case FolderState.GeneralModfied:
          pages =
            await this.generalPageRepo.getAllFolderPagesSortedByModified(
              brandedFolderID,
            );
          break;
        case FolderState.GeneralCreated:
          pages =
            await this.generalPageRepo.getAllFolderPagesSortedByCreated(
              brandedFolderID,
            );
          break;
        case FolderState.GeneralAlphabet:
          pages =
            await this.generalPageRepo.getAllFolderPagesSortedByAlphabet(
              brandedFolderID,
            );
          break;
        default:
          break;
      }
      return success(pages.map(GeneralPageMapper.toDTO));
    } catch (error) {
      if (
        error instanceof RepositoryErrorNew &&
        error.type === "Fetch Failed"
      ) {
        let errorMessage: string = "";
        switch (sortingMode) {
          case FolderState.GeneralModfied:
            errorMessage =
              PageErrorMessages.loadingAllFolderPagesSortedByModificationDate;
            break;
          case FolderState.GeneralCreated:
            errorMessage =
              PageErrorMessages.loadingAllFolderPagesSortedByCreationDate;
            break;
          case FolderState.GeneralAlphabet:
            errorMessage =
              PageErrorMessages.loadingAllFolderPagesSortedByAlphabet;
            break;
          default:
            break;
        }
        return failure({
          type: "Retrieval Failed",
          message: errorMessage,
        });
      } else {
        return failure({
          type: "Unknown Error",
          message: PageErrorMessages.unknown,
        });
      }
    }
  }

  /**
   * Fetch a single page by its ID.
   *
   * @param pageId - Number representing the pageID.
   * @returns  A Promise resolving to a `Result` containing a `GeneralPageDTO` or a `ServiceErrorType`
   */
  async getGeneralPageByID(
    pageId: number,
  ): Promise<Result<GeneralPageDTO, ServiceErrorType>> {
    try {
      const brandedPageID: PageID = pageID.parse(pageId);
      const page = await this.generalPageRepo.getByPageID(brandedPageID);
      return success(GeneralPageMapper.toDTO(page));
    } catch (error) {
      if (
        error instanceof ZodError ||
        (error instanceof RepositoryErrorNew && error.type === "Not Found")
      ) {
        return failure({
          type: "Not Found",
          message: PageErrorMessages.notFound,
        });
      } else if (
        error instanceof RepositoryErrorNew &&
        error.type === "Fetch Failed"
      ) {
        return failure({
          type: "Retrieval Failed",
          message: PageErrorMessages.loadingPage,
        });
      } else {
        return failure({
          type: "Unknown Error",
          message: PageErrorMessages.unknown,
        });
      }
    }
  }

  /**
   * Updates a single page.
   *
   * @param pageDTO - `GeneralPageDTO` representing the updated page data.
   * @returns A Promise resolving to a `Result` containing either `true` or a `ServiceErrorType`.
   */
  async updateGeneralPageData(
    pageDTO: GeneralPageDTO,
  ): Promise<Result<boolean, ServiceErrorType>> {
    try {
      const updatedPage: GeneralPage =
        GeneralPageMapper.toUpdatedEntity(pageDTO);
      await this.generalPageRepo.updateGeneralPageData(
        updatedPage.pageID,
        updatedPage,
      );
      return success(true);
    } catch (error) {
      if (error instanceof ZodError) {
        return failure({
          type: "Validation Error",
          message: PageErrorMessages.validatePageToUpdate,
        });
      } else if (
        error instanceof RepositoryErrorNew &&
        error.type === "Update Failed"
      ) {
        return failure({
          type: "Update Failed",
          message: PageErrorMessages.updatePage,
        });
      } else {
        return failure({
          type: "Unknown Error",
          message: PageErrorMessages.unknown,
        });
      }
    }
  }

  /**
   * Updates the pin status of a general page.
   *
   * @param pageId - Number representing the pageID.
   * @param currentPinStatus - Boolean representing the page's current pin status.
   * @returns  A Promise resolving to a `Result` containing either `true` or a `ServiceErrorType`.
   */
  async togglePagePin(
    pageId: number,
    currentPinStatus: boolean,
  ): Promise<Result<boolean, ServiceErrorType>> {
    try {
      const brandedPageID = pageID.parse(pageId);
      await this.generalPageRepo.updatePin(brandedPageID, currentPinStatus);
      return success(true);
    } catch (error) {
      if (error instanceof ZodError) {
        return failure({
          type: "Validation Error",
          message: PageErrorMessages.validatePageToUpdate,
        });
      } else if (
        error instanceof RepositoryErrorNew &&
        error.type === "Update Failed"
      ) {
        return failure({
          type: "Update Failed",
          message: PageErrorMessages.updatePagePin,
        });
      } else {
        return failure({
          type: "Unknown Error",
          message: PageErrorMessages.unknown,
        });
      }
    }
  }

  /**
   * Updates the archive status of a general page.
   *
   * @param pageId - Number representing the pageID.
   * @param currentArchiveStatus - Boolean representing the page's current archive status.
   * @returns A Promise resolving to a `Result` containing either `true` or a `ServiceErrorType`.
   */
  async togglePageArchive(
    pageId: number,
    currentArchiveStatus: boolean,
  ): Promise<Result<boolean, ServiceErrorType>> {
    try {
      const brandedPageID = pageID.parse(pageId);
      await this.generalPageRepo.updateArchive(
        brandedPageID,
        currentArchiveStatus,
      );
      return success(true);
    } catch (error) {
      if (error instanceof ZodError) {
        return failure({
          type: "Validation Error",
          message: PageErrorMessages.validatePageToUpdate,
        });
      } else if (
        error instanceof RepositoryErrorNew &&
        error.type === "Update Failed"
      ) {
        return failure({
          type: "Update Failed",
          message: PageErrorMessages.updatePageArchive,
        });
      } else {
        return failure({
          type: "Unknown Error",
          message: PageErrorMessages.unknown,
        });
      }
    }
  }

  /**
   * Deletes a general page.
   *
   * @param pageId - Number representing the pageID.
   * @returns A Promise resolving to a `Result` containing either `true` or a `ServiceErrorType`.
   */
  async deleteGeneralPage(
    pageId: number,
  ): Promise<Result<boolean, ServiceErrorType>> {
    try {
      const brandedPageID = pageID.parse(pageId);
      await this.generalPageRepo.deletePage(brandedPageID);
      return success(true);
    } catch (error) {
      if (error instanceof ZodError) {
        return failure({
          type: "Validation Error",
          message: PageErrorMessages.validatePageToUpdate,
        });
      } else if (
        error instanceof RepositoryErrorNew &&
        error.type === "Delete Failed"
      ) {
        return failure({
          type: "Delete Failed",
          message: PageErrorMessages.deletePage,
        });
      } else {
        return failure({
          type: "Unknown Error",
          message: PageErrorMessages.unknown,
        });
      }
    }
  }

  /**
   * Updates which folder a general page belongs to.
   *
   * @param folderId - Number representing the folderID of the folder the page should be moved to.
   * @param pageId - Number representing the pageID.
   * @returns A Promise resolving to a `Result` containing either `true` or a `ServiceErrorType`.
   */
  async updateFolderID(
    pageId: number,
    folderId: number | null,
  ): Promise<Result<boolean, ServiceErrorType>> {
    try {
      const brandedPageID = pageID.parse(pageId);
      const brandedFolderIDOrNull =
        folderId === null ? null : folderID.parse(folderId);
      await this.generalPageRepo.updateParentID(
        brandedPageID,
        brandedFolderIDOrNull,
      );
      return success(true);
    } catch (error) {
      if (error instanceof ZodError) {
        return failure({
          type: "Validation Error",
          message: PageErrorMessages.validatePageToUpdate,
        });
      } else if (
        error instanceof RepositoryErrorNew &&
        error.type === "Update Failed"
      ) {
        return failure({
          type: "Update Failed",
          message: PageErrorMessages.updatePageParent,
        });
      } else {
        return failure({
          type: "Unknown Error",
          message: PageErrorMessages.unknown,
        });
      }
    }
  }
}
