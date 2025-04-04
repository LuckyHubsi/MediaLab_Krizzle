import { GeneralPageDTO } from '@/dto/GeneralPageDTO';
import { GeneralPageModel } from '@/models/GeneralPageModel';
import { generalPageSelectAllQuery, insertNewPageQuery } from '@/queries/GeneralPageQuery';
import { fetchAll, executeQuery, fetchFirst } from '@/utils/QueryHelper';
import { GeneralPageMapper } from '@/utils/mapper/GeneralPageMapper';

/**
 * Retrieves all general page data from the database.
 *
 * @returns {Promise<GeneralPageDTO[]>} A promise that resolves to an array of GeneralPageDTO objects.
 */
const getAllGeneralPageData = async (): Promise<GeneralPageDTO[]> => {
    const rawData = await fetchAll<GeneralPageModel>(generalPageSelectAllQuery);
    return rawData.map(row => GeneralPageMapper.toDTO(row));
};

/**
 * Inserts a new page into the database and returns its ID.
 *
 * @param {GeneralPageDTO} generalPageDTO - The DTO representing the note to insert.
 * @returns {Promise<number | null>} A promise that resolves to the inserted note's ID, or null if the insertion fails.
 */
const insertGeneralPageAndReturnID = async (generalPageDTO: GeneralPageDTO): Promise<number | null> => {
    try {
        const generalPageModel = GeneralPageMapper.toModel(generalPageDTO);
        generalPageModel.date_created = new Date().toISOString(),
        generalPageModel.date_modified = generalPageModel.date_created,

        await executeQuery(insertNewPageQuery, [
            generalPageModel.page_type,
            generalPageModel.page_title,
            generalPageModel.page_icon,
            generalPageModel.page_color,
            generalPageModel.date_created,
            generalPageModel.date_modified,
            generalPageModel.archived,
            generalPageModel.pinned
        ]);

        // get inserted page ID
        const pageID = await fetchFirst<{ id: number }>("SELECT last_insert_rowid() as id");

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


export {
    getAllGeneralPageData,
    insertGeneralPageAndReturnID
}