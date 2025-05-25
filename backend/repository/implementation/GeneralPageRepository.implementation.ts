import {
  GeneralPage,
  NewGeneralPage,
} from "@/backend/domain/entity/GeneralPage";
import { GeneralPageRepository } from "../interfaces/GeneralPageRepository.interface";
import { BaseRepositoryImpl } from "./BaseRepository.implementation";
import { GeneralPageMapper } from "@/backend/util/mapper/GeneralPageMapper";
import { RepositoryError } from "@/backend/util/error/RepositoryError";
import {
  deleteGeneralPageByIDQuery,
  insertNewPageQuery,
  selectAllArchivedPagesQuery,
  selectAllPagesByAlphabetAndParentIDQuery,
  selectAllPagesByAlphabetQuery,
  selectAllPagesByCreatedAndParentIDQuery,
  selectAllPagesByCreatedQuery,
  selectAllPagesByLastModifiedAndParentIDQuery,
  selectAllPagesByLastModifiedQuery,
  selectAllPinnedPagesQuery,
  selectGeneralPageByIdQuery,
  updateArchivedByPageIDQuery,
  updateDateModifiedByPageIDQuery,
  updatePageByIDQuery,
  updateParentFolderQuery,
  updatePinnedByPageIDQuery,
} from "../query/GeneralPageQuery";
import * as SQLite from "expo-sqlite";
import { GeneralPageModel } from "../model/GeneralPageModel";
import { FolderID, PageID, pageID } from "@/backend/domain/common/IDs";

/**
 * Implementation of the GeneralPageRepository interface using SQL queries.
 *
 * Handles the following operations:
 * - Fetching all general pages from the database (different params).
 * - Fetching one general page from the database by ID.
 * - Inserting a new general page.
 * - Updating a general page (user input, pin status, archive status, date modfied).
 * - Deleting a general page by ID.
 */
export class GeneralPageRepositoryImpl
  extends BaseRepositoryImpl
  implements GeneralPageRepository
{
  // constructor accepts database instace
  constructor(db: SQLite.SQLiteDatabase) {
    super(db);
  }

  /**
   * Fetches all general pages sorted by their last modified date (descending).
   *
   * @returns A Promise resolving to an array of `GeneralPage` domain entities.
   * @throws RepositoryError if the query fails.
   */
  async getAllPagesSortedByModified(): Promise<GeneralPage[]> {
    try {
      const result = await this.fetchAll<GeneralPageModel>(
        selectAllPagesByLastModifiedQuery,
      );
      return result.map(GeneralPageMapper.toEntity);
    } catch (error) {
      throw new RepositoryError(
        "Failed to fetch all pages sorted by last modified.",
      );
    }
  }

  /**
   * Fetches all general pages sorted by alphabet (ascending).
   *
   * @returns A Promise resolving to an array of `GeneralPage` domain entities.
   * @throws RepositoryError if the query fails.
   */
  async getAllPagesSortedByAlphabet(): Promise<GeneralPage[]> {
    try {
      const result = await this.fetchAll<GeneralPageModel>(
        selectAllPagesByAlphabetQuery,
      );
      return result.map(GeneralPageMapper.toEntity);
    } catch (error) {
      throw new RepositoryError("Failed to fetch all pages.");
    }
  }

  /**
   * Fetches all general pages sorted by their creation date (descending).
   *
   * @returns A Promise resolving to an array of `GeneralPage` domain entities.
   * @throws RepositoryError if the query fails.
   */
  async getAllPagesSortedByCreated(): Promise<GeneralPage[]> {
    try {
      const result = await this.fetchAll<GeneralPageModel>(
        selectAllPagesByCreatedQuery,
      );
      return result.map(GeneralPageMapper.toEntity);
    } catch (error) {
      throw new RepositoryError("Failed to fetch all pages.");
    }
  }

  /**
   * Fetches all general pages sorted by their last modified date (descending).
   *
   * @param folderID - A branded folderID.
   * @returns A Promise resolving to an array of `GeneralPage` domain entities.
   * @throws RepositoryError if the query fails.
   */
  async getAllFolderPagesSortedByModified(
    folderId: FolderID,
  ): Promise<GeneralPage[]> {
    try {
      const result = await this.fetchAll<GeneralPageModel>(
        selectAllPagesByLastModifiedAndParentIDQuery,
        [folderId],
      );
      return result.map(GeneralPageMapper.toEntity);
    } catch (error) {
      throw new RepositoryError(
        "Failed to fetch all pages sorted by last modified.",
      );
    }
  }

  /**
   * Fetches all general pages sorted by alphabet (ascending).
   *
   * @param folderID - A branded folderID.
   * @returns A Promise resolving to an array of `GeneralPage` domain entities.
   * @throws RepositoryError if the query fails.
   */
  async getAllFolderPagesSortedByAlphabet(
    folderId: FolderID,
  ): Promise<GeneralPage[]> {
    try {
      const result = await this.fetchAll<GeneralPageModel>(
        selectAllPagesByAlphabetAndParentIDQuery,
        [folderId],
      );
      return result.map(GeneralPageMapper.toEntity);
    } catch (error) {
      throw new RepositoryError("Failed to fetch all pages.");
    }
  }

  /**
   * Fetches all general pages sorted by their creation date (descending).
   *
   * @param folderID - A branded folderID.
   * @returns A Promise resolving to an array of `GeneralPage` domain entities.
   * @throws RepositoryError if the query fails.
   */
  async getAllFolderPagesSortedByCreated(
    folderId: FolderID,
  ): Promise<GeneralPage[]> {
    try {
      const result = await this.fetchAll<GeneralPageModel>(
        selectAllPagesByCreatedAndParentIDQuery,
        [folderId],
      );
      return result.map(GeneralPageMapper.toEntity);
    } catch (error) {
      throw new RepositoryError("Failed to fetch all pages.");
    }
  }

  /**
   * Fetches all pinned general pages.
   *
   * @returns A Promise resolving to an array of `GeneralPage` domain entities.
   * @throws RepositoryError if the query fails.
   */
  async getAllPinnedPages(): Promise<GeneralPage[]> {
    try {
      const result = await this.fetchAll<GeneralPageModel>(
        selectAllPinnedPagesQuery,
      );
      return result.map(GeneralPageMapper.toEntity);
    } catch (error) {
      throw new RepositoryError("Failed to fetch all pages.");
    }
  }

  /**
   * Fetches all archived general pages.
   *
   * @returns A Promise resolving to an array of `GeneralPage` domain entities.
   * @throws RepositoryError if the query fails.
   */
  async getAllArchivedPages(): Promise<GeneralPage[]> {
    try {
      const result = await this.fetchAll<GeneralPageModel>(
        selectAllArchivedPagesQuery,
      );
      return result.map(GeneralPageMapper.toEntity);
    } catch (error) {
      throw new RepositoryError("Failed to fetch all pages.");
    }
  }

  /**
   * Fetches a general page by its ID.
   *
   * @param pageID - A branded pageID.
   * @returns A Promise resolving to a `GeneralPage` domain entity.
   * @throws RepositoryError if the query fails.
   */
  async getByPageID(pageID: PageID): Promise<GeneralPage> {
    try {
      const result = await this.fetchFirst<GeneralPageModel>(
        selectGeneralPageByIdQuery,
        [pageID],
      );
      if (result) {
        return GeneralPageMapper.toEntity(result);
      } else {
        throw new RepositoryError("Failed to fetch page by id.");
      }
    } catch (error) {
      throw new RepositoryError("Failed to fetch page by id.");
    }
  }

  /**
   * Updated a general page by its ID.
   *
   * @param pageID - A branded pageID.
   * @param updatedPage - A NewGeneralPage entity.
   * @returns A Promise resolving to a boolean.
   * @throws RepositoryError if the query fails.
   */
  async updateGeneralPageData(
    pageID: PageID,
    updatedPage: NewGeneralPage,
  ): Promise<boolean> {
    try {
      await this.executeQuery(updatePageByIDQuery, [
        updatedPage.pageTitle,
        updatedPage.pageIcon,
        updatedPage.pageColor,
        updatedPage.tag?.tagID ?? null,
        updatedPage.updatedAt.toISOString(),
        pageID,
      ]);
      return true;
    } catch (error) {
      throw new RepositoryError("Failed to update page.");
    }
  }

  /**
   * Insert a new general page.
   *
   * @param page - A `NewGeneralPage` entity.
   * @param txn - The DB instance the operation should be executed on if a transaction is ongoing.
   * @returns A Promise resolving to a PageID.
   * @throws RepositoryError if the query fails.
   */
  async insertPage(
    page: NewGeneralPage,
    txn?: SQLite.SQLiteDatabase,
  ): Promise<PageID> {
    try {
      const pageId = await this.executeTransaction(async (transaction) => {
        await this.executeQuery(
          insertNewPageQuery,
          [
            page.pageType,
            page.pageTitle,
            page.pageIcon,
            page.pageColor,
            page.createdAt.toISOString(),
            page.updatedAt.toISOString(),
            page.archived ? 1 : 0,
            page.pinned ? 1 : 0,
            page.tag?.tagID ?? null,
            page.parentID,
          ],
          txn ?? transaction,
        );

        const lastInsertedID = await this.getLastInsertId(txn ?? transaction);
        return lastInsertedID;
      });
      return pageID.parse(pageId);
    } catch (error) {
      throw new RepositoryError("Failed to insert page.");
    }
  }

  /**
   * Deletes a general page.
   *
   * @param pageID - A branded pageID.
   * @returns A Promise resolving to true on success.
   * @throws RepositoryError if the query fails.
   */
  async deletePage(pageID: PageID): Promise<boolean> {
    try {
      return await this.executeTransaction(async (txn) => {
        await this.executeQuery(deleteGeneralPageByIDQuery, [pageID], txn);

        return true;
      });
    } catch (error) {
      console.error("Error in deletePage:", error);
      throw new RepositoryError("Failed to delete the page");
    }
  }

  /**
   * Updates the pin status of a general page.
   *
   * @param pageID - A branded pageID.
   * @param currentPinStatus - A boolean representing the current pin status.
   * @returns A Promise resolving to true on success.
   * @throws RepositoryError if the query fails.
   */
  async updatePin(pageID: PageID, currentPinStatus: boolean): Promise<boolean> {
    try {
      const newPinStatus = currentPinStatus ? 0 : 1;

      await this.executeTransaction(async (txn) => {
        await this.executeQuery(
          updatePinnedByPageIDQuery,
          [newPinStatus, pageID],
          txn,
        );

        await this.updateDateModified(pageID, txn);
      });

      return true;
    } catch (error) {
      throw new RepositoryError("Failed to update pinned state");
    }
  }

  /**
   * Updates the archive status of a general page.
   *
   * @param pageID - A branded pageID.
   * @param currentArchiveStatus - A boolean representing the current archive status.
   * @returns A Promise resolving to true on success.
   * @throws RepositoryError if the query fails.
   */
  async updateArchive(
    pageID: PageID,
    currentArchiveStatus: boolean,
  ): Promise<boolean> {
    try {
      const newArchiveStatus = currentArchiveStatus ? 0 : 1;

      await this.executeTransaction(async (txn) => {
        await this.executeQuery(
          updateArchivedByPageIDQuery,
          [newArchiveStatus, 0, pageID], // set pin status to false
          txn,
        );

        await this.updateDateModified(pageID, txn);
      });

      return true;
    } catch (error) {
      throw new RepositoryError("Failed to update pinned state");
    }
  }

  /**
   * Updates the archive status of a general page.
   *
   * @param pageId - A branded pageID.
   * @param txn - The DB instance the operation should be executed on if a transaction is ongoing.
   * @returns A Promise resolving to void.
   * @throws RepositoryError if the query fails.
   */
  async updateDateModified(
    pageId: PageID,
    txn?: SQLite.SQLiteDatabase,
  ): Promise<void> {
    try {
      const modfiedAt = new Date();
      await this.executeQuery(
        updateDateModifiedByPageIDQuery,
        [modfiedAt.toISOString(), pageId],
        txn,
      );
    } catch (error) {
      throw new RepositoryError("Failed to update last modified date");
    }
  }

  /**
   * Updates the folderID (parent) of a general page.
   *
   * @param pageId - A branded pageID.
   * @param parentId - A branded folderID to which the page should be moved.
   * @returns A Promise resolving to true if successful.
   * @throws RepositoryError if the query fails.
   */
  async updateParentID(pageId: PageID, parentId: FolderID): Promise<boolean> {
    try {
      await this.executeQuery(updateParentFolderQuery, [parentId, pageId]);
      const allpages = await this.fetchAll("SELECT * FROM general_page_data");
      return true;
    } catch (error) {
      throw new RepositoryError("Failed to update parent folderID");
    }
  }
}
