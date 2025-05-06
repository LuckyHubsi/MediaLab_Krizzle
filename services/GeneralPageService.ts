import { GeneralPageDTO } from "@/dto/GeneralPageDTO";
import { GeneralPageModel } from "@/models/GeneralPageModel";
import {
  selectAllGeneralPageQuery,
  insertNewPageQuery,
  deleteGeneralPageByIDQuery,
  updatePinnedByPageIDQuery,
  updateDateModifiedByPageIDQuery,
  updateArchivedByPageIDQuery,
  selectAllArchivedPageQuery,
  selectAllPinnedPageQuery,
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

/**
 * Retrieves all general page data from the database.
 *
 * @param {SQLite.SQLiteDatabase} [txn] - Optional SQLite transaction object when its called inside a transaction.
 * @returns {Promise<GeneralPageDTO[]>} A promise that resolves to an array of GeneralPageDTO objects.
 * @throws {DatabaseError} If the fetch fails.
 */
const getAllGeneralPageData = async (
  pageState: GeneralPageState,
  txn?: SQLite.SQLiteDatabase,
): Promise<GeneralPageDTO[]> => {
  try {
    let queryString = "";

    switch (pageState) {
      case GeneralPageState.General:
        queryString = selectAllGeneralPageQuery;
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
 * Inserts a new page into the database and returns its ID.
 *
 * @param {GeneralPageDTO} generalPageDTO - The DTO representing the general page data to insert.
 * @param {SQLite.SQLiteDatabase} [txn] - Optional SQLite transaction object when its called inside a transaction.
 * @returns {Promise<number>} A promise that resolves to the inserted page's ID.
 * @throws {DatabaseError} If the insertion fails or if the page ID cannot be fetched.
 */
const insertGeneralPageAndReturnID = async (
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
 * Updates the date modified of a page to the current date and time.
 *
 * @param {number} pageID - The ID of the page to update.
 * @param {SQLite.SQLiteDatabase} [txn] - Optional SQLite transaction object when it's called inside a transaction.
 * @returns {Promise<boolean>} A promise that resolves to true if successful.
 * @throws {DatabaseError} If the update fails.
 */
const updateDateModified = async (
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
const togglePagePin = async (
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

      updateDateModified(pageID);

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
const togglePageArchive = async (
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

      updateDateModified(pageID);

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
const deleteGeneralPage = async (
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

export {
  getAllGeneralPageData,
  insertGeneralPageAndReturnID,
  updateDateModified,
  togglePagePin,
  togglePageArchive,
  deleteGeneralPage,
};
