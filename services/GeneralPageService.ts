import { GeneralPageDTO } from "@/dto/GeneralPageDTO";
import { GeneralPageModel } from "@/models/GeneralPageModel";
import {
  selectAllGeneralPageQuery,
  insertNewPageQuery,
  deleteGeneralPageByIDQuery,
  selectGeneralPageByIdQuery,
  updateDateModifiedByPageIDQuery,
  updatePageByIDQuery,
} from "@/queries/GeneralPageQuery";
import { DatabaseError } from "@/utils/DatabaseError";
import {
  fetchAll,
  executeQuery,
  fetchFirst,
  executeTransaction,
  getLastInsertId,
} from "@/utils/QueryHelper";
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
  txn?: SQLite.SQLiteDatabase,
): Promise<GeneralPageDTO[]> => {
  try {
    const rawData = await fetchAll<GeneralPageModel>(
      selectAllGeneralPageQuery,
      [],
      txn,
    );
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
const getGeneralPageByID = async (
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
const updateGeneralPageData = async (
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
  getGeneralPageByID,
  insertGeneralPageAndReturnID,
  updateGeneralPageData,
  deleteGeneralPage,
};
