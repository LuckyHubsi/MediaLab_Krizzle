import { GeneralPageDTO } from "@/dto/GeneralPageDTO";
import { GeneralPageModel } from "@/models/GeneralPageModel";
import {
  selectAllGeneralPageQuery,
  insertNewPageQuery,
  deleteGeneralPageByIDQuery,
} from "@/queries/GeneralPageQuery";
import { fetchAll, executeQuery, fetchFirst } from "@/utils/QueryHelper";
import { GeneralPageMapper } from "@/utils/mapper/GeneralPageMapper";

/**
 * Retrieves all general page data from the database.
 *
 * @returns {Promise<GeneralPageDTO[]>} A promise that resolves to an array of GeneralPageDTO objects.
 */
const getAllGeneralPageData = async (): Promise<GeneralPageDTO[] | null> => {
  try {
    const rawData = await fetchAll<GeneralPageModel>(selectAllGeneralPageQuery);
    return rawData.map(GeneralPageMapper.toDTO);
  } catch (error) {
    console.error("Error getting all pages note:", error);
    return null;
  }
};

/**
 * Inserts a new page into the database and returns its ID.
 *
 * @param {GeneralPageDTO} generalPageDTO - The DTO representing the note to insert.
 * @returns {Promise<number | null>} A promise that resolves to the inserted note's ID, or null if the insertion fails.
 */
const insertGeneralPageAndReturnID = async (
  generalPageDTO: GeneralPageDTO,
): Promise<number | null> => {
  try {
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
    const pageID = await fetchFirst<{ id: number }>(
      "SELECT last_insert_rowid() as id",
    );

    if (pageID?.id) {
      return pageID.id;
    } else {
      console.error("Failed to fetch inserted page ID");
      return null;
    }
  } catch (error) {
    console.error("Error inserting note:", error);
    return null;
  }
};

/**
 * Deletes a page based on its ID from DB.
 *
 * @param {pageID} number - The pageID of the page to be deleted.
 * @returns {Promise<boolean>} A promise that resolves to a boolean, dependent on the success.
 */
const deleteGeneralPage = async (pageID: number): Promise<boolean> => {
  try {
    await executeQuery(deleteGeneralPageByIDQuery, [pageID]);
    return true;
  } catch (error) {
    console.error("Error deleting page:", error);
    return false;
  }
};

export {
  getAllGeneralPageData,
  insertGeneralPageAndReturnID,
  deleteGeneralPage,
};
