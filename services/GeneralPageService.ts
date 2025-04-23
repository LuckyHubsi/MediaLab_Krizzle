import { GeneralPageDTO } from "@/dto/GeneralPageDTO";
import { GeneralPageModel } from "@/models/GeneralPageModel";
import {
  selectAllGeneralPageQuery,
  insertNewPageQuery,
  deleteGeneralPageByIDQuery,
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

/**
 * Retrieves all general page data from the database.
 *
 * @returns {Promise<GeneralPageDTO[]>} A promise that resolves to an array of GeneralPageDTO objects.
 *
 * @throws {DatabaseError} If the fetch fails.
 */
const getAllGeneralPageData = async (): Promise<GeneralPageDTO[]> => {
  try {
    const rawData = await fetchAll<GeneralPageModel>(selectAllGeneralPageQuery);
    return rawData.map(GeneralPageMapper.toDTO);
  } catch (error) {
    throw new DatabaseError("Error retrieving all pages.");
  }
};

/**
 * Inserts a new page into the database and returns its ID.
 *
 * @param {GeneralPageDTO} generalPageDTO - The DTO representing the general page data to insert.
 * @returns {Promise<number | null>} A promise that resolves to the inserted page's ID, or null if the insertion fails.
 *
 * @throws {DatabaseError} If the insertion fails or if the page ID cannot be fetched.
 */
const insertGeneralPageAndReturnID = async (
  generalPageDTO: GeneralPageDTO,
): Promise<number> => {
  try {
    const pageID: number = await executeTransaction<number>(async () => {
      await executeQuery(insertNewPageQuery, [
        generalPageDTO.page_type,
        generalPageDTO.page_title,
        generalPageDTO.page_icon,
        generalPageDTO.page_color,
        new Date().toISOString(),
        new Date().toISOString(),
        generalPageDTO.archived ? 1 : 0,
        generalPageDTO.pinned ? 1 : 0,
      ]);

      // get inserted page ID
      const lastInsertedID = await getLastInsertId();
      return lastInsertedID;
    });

    return pageID;
  } catch (error) {
    throw new DatabaseError("Failed inserting the general page data.");
  }
};

/**
 * Deletes a page based on its ID from DB.
 *
 * @param {pageID} number - The pageID of the page to be deleted.
 * @returns {Promise<boolean>} A promise that resolves to true if successful.
 *
 * @throws {DatabaseError} If the delete fails.
 */
const deleteGeneralPage = async (pageID: number): Promise<boolean> => {
  try {
    await executeQuery(deleteGeneralPageByIDQuery, [pageID]);
    return true;
  } catch (error) {
    throw new DatabaseError("Failed to delete teh page");
  }
};

export {
  getAllGeneralPageData,
  insertGeneralPageAndReturnID,
  deleteGeneralPage,
};
