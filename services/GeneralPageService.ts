import { GeneralPageDTO } from "@/dto/GeneralPageDTO";
import { GeneralPageModel } from "@/models/GeneralPageModel";
import {
  selectAllGeneralPageQuery,
  insertNewPageQuery,
  deleteGeneralPageByIDQuery,
  selectGeneralPageByIdQuery,
  updateDateModifiedByPageIDQuery,
  updatePageByIDQuery,
  updatePinnedByPageIDQuery,
  updateArchivedByPageIDQuery,
  selectAllArchivedPageQuery,
  selectAllPinnedPageQuery,
  selectAllGeneralPageSortAlphabetQuery,
} from "@/queries/GeneralPageQuery";
import { DatabaseError } from "@/utils/DatabaseError";
import {
  fetchAll,
  executeQuery,
  fetchFirst,
  executeTransaction,
  getLastInsertId,
} from "@/utils/QueryHelper";
import { GeneralPageState } from "@/utils/enums/GeneralPageState";
import { GeneralPageMapper } from "@/utils/mapper/GeneralPageMapper";
import * as SQLite from "expo-sqlite";

class GeneralPageService {
  /**
   * Retrieves all general page data from the database.
   *
   * @param {SQLite.SQLiteDatabase} [txn] - Optional SQLite transaction object when its called inside a transaction.
   * @returns {Promise<GeneralPageDTO[]>} A promise that resolves to an array of GeneralPageDTO objects.
   * @throws {DatabaseError} If the fetch fails.
   */
  getAllGeneralPageData = async (
    pageState: GeneralPageState,
    txn?: SQLite.SQLiteDatabase,
  ): Promise<GeneralPageDTO[]> => {
    try {
      let queryString = "";

      switch (pageState) {
        case GeneralPageState.GeneralModfied:
          queryString = selectAllGeneralPageQuery;
          break;
        case GeneralPageState.GeneralAlphabet:
          queryString = selectAllGeneralPageSortAlphabetQuery;
          break;
        case GeneralPageState.Archived:
          queryString = selectAllArchivedPageQuery;
          break;
        case GeneralPageState.Pinned:
          queryString = selectAllPinnedPageQuery;
          break;
        default:
          break;
      }
      const rawData = await fetchAll<GeneralPageModel>(queryString, [], txn);
      return rawData.map(GeneralPageMapper.toDTO);
    } catch (error) {
      throw new DatabaseError("Error retrieving all pages.");
    }
  };

  /**
   * Retrieves general page data from the database by ID.
   *
   * @param {SQLite.SQLiteDatabase} [txn] - Optional SQLite transaction object when its called inside a transaction.
   * @returns {Promise<GeneralPageDTO[]>} A promise that resolves to an array of GeneralPageDTO objects.
   */
  getGeneralPageByID = async (
    pageID: number,
    txn?: SQLite.SQLiteDatabase,
  ): Promise<GeneralPageDTO | null> => {
    try {
      const generalPageData = await fetchFirst<GeneralPageModel>(
        selectGeneralPageByIdQuery,
        [pageID],
        txn,
      );

      if (!generalPageData) return null;
      return GeneralPageMapper.toDTO(generalPageData);
    } catch (error) {
      throw new DatabaseError("Error retrieving page by ID.");
    }
  };

  /**
   * Inserts a new page into the database and returns its ID.
   *
   * @param {GeneralPageDTO} generalPageDTO - The DTO representing the general page data to insert.
   * @param {SQLite.SQLiteDatabase} [txn] - Optional SQLite transaction object when its called inside a transaction.
   * @returns {Promise<number>} A promise that resolves to the inserted page's ID.
   * @throws {DatabaseError} If the insertion fails or if the page ID cannot be fetched.
   */
  insertGeneralPageAndReturnID = async (
    generalPageDTO: GeneralPageDTO,
    txn?: SQLite.SQLiteDatabase,
  ): Promise<number> => {
    try {
      const pageID: number = await executeTransaction<number>(async () => {
        await executeQuery(
          insertNewPageQuery,
          [
            generalPageDTO.page_type,
            generalPageDTO.page_title,
            generalPageDTO.page_icon,
            generalPageDTO.page_color,
            new Date().toISOString(),
            new Date().toISOString(),
            generalPageDTO.archived ? 1 : 0,
            generalPageDTO.pinned ? 1 : 0,
            generalPageDTO.tag?.tagID,
          ],
          txn,
        );

        // get inserted page ID
        const lastInsertedID = await getLastInsertId(txn);
        return lastInsertedID;
      });

      return pageID;
    } catch (error) {
      throw new DatabaseError("Failed inserting the general page data.");
    }
  };

  /**
   * Updates the content of a page and updates the corresponding page's `date_modified` timestamp.
   *
   * @param pageID - The unique identifier of the page to update.
   * @param newPageTitle - The new title to save for the page.
   * @param newPageIcon - The new icon to save for the page.
   * @param newPageColor - The new color to save for the page.
   * @param newTagID - The new tagID to save for the page.
   * @returns A Promise that resolves to `true` if the update was successful, or `false` if an error occurred.
   */
  updateGeneralPageData = async (
    pageID: number,
    newPageTitle: string,
    newPageIcon: string,
    newPageColor: string,
    newTagID: number | null,
    txn?: SQLite.SQLiteDatabase,
  ): Promise<boolean> => {
    try {
      if (!pageID) {
        console.error("Page not found for the given ID.");
        return false;
      }

      // update the page content
      await executeQuery(
        updatePageByIDQuery,
        [newPageTitle, newPageIcon, newPageColor, newTagID, pageID],
        txn,
      );

      // update the date_modified for the general page data
      await executeQuery(
        updateDateModifiedByPageIDQuery,
        [new Date().toISOString(), pageID],
        txn,
      );

      return true;
    } catch (error) {
      console.error("Error updating page content:", error);
      return false;
    }
  };
  /**
   * Updates the date modified of a page to the current date and time.
   *
   * @param {number} pageID - The ID of the page to update.
   * @param {SQLite.SQLiteDatabase} [txn] - Optional SQLite transaction object when it's called inside a transaction.
   * @returns {Promise<boolean>} A promise that resolves to true if successful.
   * @throws {DatabaseError} If the update fails.
   */
  updateDateModified = async (
    pageID: number,
    txn?: SQLite.SQLiteDatabase,
  ): Promise<boolean> => {
    try {
      const currentDate = new Date().toISOString();
      await executeQuery(
        updateDateModifiedByPageIDQuery,
        [currentDate, pageID],
        txn,
      );
      return true;
    } catch (error) {
      throw new DatabaseError("Failed to update the page modification date");
    }
  };

  /**
   * Toggles a page's pinned status (from pinned to unpinned or vice versa).
   *
   * @param {number} pageID - The ID of the page to toggle pin status.
   * @param {boolean} currentPinStatus - The current pin status of the page.
   * @param {SQLite.SQLiteDatabase} [txn] - Optional SQLite transaction object when its called inside a transaction.
   * @returns {Promise<boolean>} A promise that resolves to true if successful.
   * @throws {DatabaseError} If the update fails.
   */
  togglePagePin = async (
    pageID: number,
    currentPinStatus: boolean,
    txn?: SQLite.SQLiteDatabase,
  ): Promise<boolean> => {
    try {
      return await executeTransaction<boolean>(async (transaction) => {
        const newPinStatus = currentPinStatus ? 0 : 1;

        // Update pinned status
        await executeQuery(
          updatePinnedByPageIDQuery,
          [newPinStatus, pageID],
          transaction || txn,
        );

        this.updateDateModified(pageID);

        return true;
      });
    } catch (error) {
      throw new DatabaseError("Failed to toggle pin status for the page");
    }
  };

  /**
   * Toggles a page's archived status (from archived to unarchived or vice versa).
   *
   * @param {number} pageID - The ID of the page to toggle pin status.
   * @param {boolean} currentArchiveStatus - The current archive status of the page.
   * @param {SQLite.SQLiteDatabase} [txn] - Optional SQLite transaction object when its called inside a transaction.
   * @returns {Promise<boolean>} A promise that resolves to true if successful.
   * @throws {DatabaseError} If the update fails.
   */
  togglePageArchive = async (
    pageID: number,
    currentArchiveStatus: boolean,
    txn?: SQLite.SQLiteDatabase,
  ): Promise<boolean> => {
    try {
      return await executeTransaction<boolean>(async (transaction) => {
        const newArchiveStatus = currentArchiveStatus ? 0 : 1;
        const currentDate = new Date().toISOString();

        // Update archived status
        await executeQuery(
          updateArchivedByPageIDQuery,
          [newArchiveStatus, pageID],
          transaction || txn,
        );

        await executeQuery(
          updatePinnedByPageIDQuery,
          [0, pageID],
          transaction || txn,
        );

        this.updateDateModified(pageID);

        return true;
      });
    } catch (error) {
      throw new DatabaseError("Failed to toggle archive status for the page");
    }
  };

  /**
   * Deletes a page based on its ID from DB.
   *
   * @param {pageID} number - The pageID of the page to be deleted.
   * @param {SQLite.SQLiteDatabase} [txn] - Optional SQLite transaction object when its called inside a transaction.
   * @returns {Promise<boolean>} A promise that resolves to true if successful.
   * @throws {DatabaseError} If the delete fails.
   */
  deleteGeneralPage = async (
    pageID: number,
    txn?: SQLite.SQLiteDatabase,
  ): Promise<boolean> => {
    try {
      await executeQuery(deleteGeneralPageByIDQuery, [pageID], txn);
      return true;
    } catch (error) {
      throw new DatabaseError("Failed to delete teh page");
    }
  };
}

export const generalPageService = new GeneralPageService();
