// CollectionService.ts
import { CollectionDTO } from "@/dto/CollectionDTO";
import { CollectionModel } from "@/models/CollectionModel";
import { insertAttribute } from "@/queries/AttributeQuery";
import {
  collectionSelectByPageIdQuery,
  insertCollection,
} from "@/queries/CollectionQuery";
import { insertNewPageQuery } from "@/queries/GeneralPageQuery";
import { insertItemTemplate } from "@/queries/ItemTemplateQuery";
import {
  fetchAll,
  fetchFirst,
  executeQuery,
  executeTransaction,
  getLastInsertId,
} from "@/utils/QueryHelper";
import { CollectionMapper } from "@/utils/mapper/CollectionMapper";
import { insertGeneralPageAndReturnID } from "./GeneralPageService";
// import { getItemTemplateWithAttributesById } from './ItemTemplateService';

/**
 * Retrieves all collections associated with a specific page.
 *
 * @param {number} pageId - The ID of the page.
 * @returns {Promise<CollectionDTO[]>} A promise that resolves to an array of CollectionDTO objects.
 */
const getCollectionByPageId = async (
  pageID: number,
): Promise<CollectionDTO | null> => {
  const collection = await fetchFirst<CollectionModel>(
    collectionSelectByPageIdQuery,
    [pageID],
  );
  if (!collection) return null;

  return CollectionMapper.toDTO(collection);
};

/**
 * Inserts a new collection into the database and returns its ID.
 *
 * @param {CollectionDTO} collectionDTO - The DTO representing the collection to insert.
 * @returns {Promise<number | null>} A promise that resolves to the inserted collection's ID, or null if the insertion fails.
 */
const insertCollectionAndReturnID = async (
  collectionDTO: CollectionDTO,
): Promise<number | null> => {
  try {
    const collectionID = await executeTransaction<number | null>(async () => {
      await executeQuery(insertCollection, [
        collectionDTO.pageID,
        collectionDTO.template.item_templateID,
      ]);

      // get inserted collection ID
      const lastInsertedID = await getLastInsertId();
      return lastInsertedID;
    });

    if (collectionID) {
      return collectionID;
    } else {
      console.error("Failed to fetch inserted collection ID");
      return null;
    }
  } catch (error) {
    console.error("Error inserting collection:", error);
    return null;
  }
};

// EXAMPLE FLOW
export const saveAndRetrieveCollection = async (
  collectionDTO: CollectionDTO,
): Promise<void> => {
  try {
    console.log(JSON.stringify(collectionDTO));
    // 1. Insert General Page and get the pageID
    const pageID = await insertGeneralPageAndReturnID(collectionDTO);

    if (!pageID) throw new Error("Page ID could not be retrieved");

    // 2. Insert Template (if needed) and get template ID
    const templateID = collectionDTO.template.item_templateID ?? undefined;

    if (!templateID) {
      await executeQuery(insertItemTemplate, [
        collectionDTO.template.template_name,
      ]);

      const templateIDResult = await getLastInsertId();
      if (templateIDResult !== null) {
        collectionDTO.template.item_templateID = templateIDResult;
      }

      if (!collectionDTO.template.item_templateID)
        throw new Error("Template ID could not be retrieved");

      // 3. Insert Attributes for the template
      if (collectionDTO.template.attributes) {
        for (const attr of collectionDTO.template.attributes) {
          await executeQuery(insertAttribute, [
            attr.attributeLabel,
            attr.attributeType,
            attr.preview ? 1 : 0,
            collectionDTO.template.item_templateID,
          ]);
        }
      }
    }

    // 4. Insert into collection table
    await executeQuery(insertCollection, [
      collectionDTO.template.item_templateID,
      pageID,
    ]);

    // 5. Fetch collection by page ID (with all joins)
    // 6. Map and log
    const fullCollectionDTO = await getCollectionByPageId(pageID);
    console.log("Full Collection Retrieved:", fullCollectionDTO);
    fullCollectionDTO?.template.attributes?.forEach((attribute) => {
      console.log(attribute);
    });
  } catch (error) {
    console.error("Error in saveAndRetrieveCollection:", error);
  }
};

export { getCollectionByPageId, insertCollectionAndReturnID };
