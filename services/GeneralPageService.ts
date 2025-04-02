import { GeneralPageDTO } from '@/dto/GeneralPageDTO';
import { GeneralPageModel } from '@/models/GeneralPageModel';
import { generalPageSelectAllQuery, insertNewPage } from '@/queries/GeneralPageQuery';
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

export {
    getAllGeneralPageData
}