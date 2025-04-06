// CollectionService.ts
import { CollectionDTO } from '@/dto/CollectionDTO';
import { CollectionModel } from '@/models/CollectionModel';
import { 
    collectionSelectByIdQuery,
    collectionSelectByPageIdQuery,
    insertCollection
} from '@/queries/CollectionQuery';
import { 
    fetchAll, 
    fetchFirst, 
    executeQuery, 
    executeTransaction,
    getLastInsertId
} from '@/utils/QueryHelper';
import { CollectionMapper } from '@/utils/mapper/CollectionMapper';
// import { getItemTemplateWithAttributesById } from './ItemTemplateService';

/**
 * Retrieves a single collection by its ID.
 * 
 * @param {number} id - The ID of the collection to retrieve.
 * @returns {Promise<CollectionDTO | null>} A promise that resolves to a CollectionDTO object or null if not found.
 */
const getCollectionById = async (id: number): Promise<CollectionDTO | null> => {
    const result = await fetchFirst<CollectionModel>(collectionSelectByIdQuery, [id]);
    return result ? CollectionMapper.toDTO(result) : null;
};

/**
 * Retrieves all collections associated with a specific page.
 * 
 * @param {number} pageId - The ID of the page.
 * @returns {Promise<CollectionDTO[]>} A promise that resolves to an array of CollectionDTO objects.
 */
const getCollectionsByPageId = async (pageId: number): Promise<CollectionDTO[]> => {
    const rawData = await fetchAll<CollectionModel>(collectionSelectByPageIdQuery, [pageId]);
    return rawData.map(row => CollectionMapper.toDTO(row));
};

// /**
//  * Retrieves a collection by its ID and includes the associated item template with attributes.
//  * 
//  * @param {number} id - The ID of the collection to retrieve.
//  * @returns {Promise<CollectionDTO | null>} A promise that resolves to a CollectionDTO object with itemTemplate property or null if not found.
//  */
// const getCollectionWithTemplateById = async (id: number): Promise<CollectionDTO | null> => {
//     const collection = await getCollectionById(id);
    
//     if (!collection) {
//         return null;
//     }
    
//     // Get the associated item template with its attributes
//     if (collection.template.item_templateID) {
//         const itemTemplate = await getItemTemplateWithAttributesById(collection.template.item_templateID);
//         if (itemTemplate) {
//             collection.template = itemTemplate;
//         }
//     }
    
//     return collection;
// };

/**
 * Inserts a new collection into the database and returns its ID.
 * 
 * @param {CollectionDTO} collectionDTO - The DTO representing the collection to insert.
 * @returns {Promise<number | null>} A promise that resolves to the inserted collection's ID, or null if the insertion fails.
 */
const insertCollectionAndReturnID = async (collectionDTO: CollectionDTO): Promise<number | null> => {
    try {

        await executeQuery(insertCollection, [
            collectionDTO.pageID,
            collectionDTO.template.item_templateID
        ]);

        // get inserted collection ID
        const result = await getLastInsertId();

        if (result) {
            console.log("Inserted Collection ID:", result);
            return result;
        } else {
            console.error("Failed to fetch inserted collection ID");
            return null;
        }
    } catch (error) {
        console.error("Error inserting collection:", error);
        return null;
    }
};

export {
    getCollectionById,
    getCollectionsByPageId,
    // getCollectionWithTemplateById,
    insertCollectionAndReturnID
}