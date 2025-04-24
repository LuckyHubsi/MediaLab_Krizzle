import { CollectionDTO } from "@/dto/CollectionDTO";
import { CollectionModel } from "@/models/CollectionModel";
import {
  collectionSelectByPageIdQuery,
  insertCollection,
} from "@/queries/CollectionQuery";
import {
  fetchFirst,
  executeQuery,
  executeTransaction,
  getLastInsertId,
} from "@/utils/QueryHelper";
import { CollectionMapper } from "@/utils/mapper/CollectionMapper";
import { insertGeneralPageAndReturnID } from "./GeneralPageService";
import { insertItemTemplateAndReturnID } from "./ItemTemplateService";
import { insertAttribute, insertMultiselectOptions } from "./AttributeService";
import { insertCollectionCategory } from "./CollectionCategoriesService";
import { AttributeType } from "@/utils/enums/AttributeType";
import { DatabaseError } from "@/utils/DatabaseError";
import { ItemTemplateDTO } from "@/dto/ItemTemplateDTO";

/**
 * Retrieves a collection associated with a specific page.
 *
 * @param {number} pageId - The ID of the page.
 * @returns {Promise<CollectionDTO>} A promise that resolves to a CollectionDTO.
 *
 * @throws {DatabaseError} If the fetch fails.
 */
const getCollectionByPageId = async (
  pageID: number,
): Promise<CollectionDTO | null> => {
  try {
    const collection = await fetchFirst<CollectionModel>(
      collectionSelectByPageIdQuery,
      [pageID],
    );
    if (!collection) return null;
    return CollectionMapper.toDTO(collection);
  } catch (error) {
    throw new DatabaseError("Failed to retrieve collection");
  }
};

/**
 * Inserts a new collection into the database and returns its ID.
 *
 * @param {CollectionDTO} collectionDTO - The DTO representing the collection to insert.
 * @returns {Promise<number | null>} A promise that resolves to the inserted collection's ID, or null if the insertion fails.
 *
 * @throws {DatabaseError} If the insert or fetch inserted id fails.
 *
 */
const insertCollectionAndReturnID = async (
  collectionDTO: CollectionDTO,
): Promise<number> => {
  try {
    const collectionID = await executeTransaction<number>(async () => {
      await executeQuery(insertCollection, [
        collectionDTO.pageID,
        collectionDTO.templateID,
      ]);

      // get inserted collection ID
      const lastInsertedID = await getLastInsertId();
      return lastInsertedID;
    });

    if (collectionID) {
      return collectionID;
    } else {
      throw new DatabaseError("Failed to insert collection");
    }
  } catch (error) {
    throw new DatabaseError("Failed to insert collection");
  }
};

/**
 * Saves a new collection to the database within a transaction.
 *
 * This function performs a multi-step process to persist a `CollectionDTO` object:
 * 1. Inserts a general page and obtains its ID.
 * 2. Inserts the associated template and gets its ID.
 * 3. Inserts all attributes related to the template, including multiselect options.
 * 4. Inserts the actual collection using the page and template IDs.
 * 5. Inserts all related categories, linking them to the collection.
 *
 * If any step fails, the entire transaction is rolled back to maintain database integrity.
 *
 * @param {CollectionDTO} collectionDTO - The collectionDTO containing all data needed to create the collection.
 * @returns {Promise<void>} A promise that resolves if the collection is saved successfully, or rejects with an error.
 *
 * @throws {DatabaseError} If the overall transaction fails.
 */
export const saveCollection = async (
  collectionDTO: CollectionDTO,
  templateDTO: ItemTemplateDTO,
): Promise<void> => {
  try {
    console.log(JSON.stringify(collectionDTO));
    const pageID = await executeTransaction<number | null>(async () => {
      // 1. Insert General Page and get the pageID
      const pageID = await insertGeneralPageAndReturnID(collectionDTO);
      if (pageID) {
        collectionDTO.pageID = pageID;
      }

      // 2. Insert Template and get template ID
      const templateID = await insertItemTemplateAndReturnID(templateDTO);

      // 3. Insert Attributes for the template and possibly multiselect options
      if (templateDTO.attributes) {
        for (const attr of templateDTO.attributes) {
          if (templateID) {
            attr.itemTemplateID = templateID;
            await insertAttribute(attr);
            if (
              attr.attributeType == AttributeType.Multiselect &&
              attr.options
            ) {
              const attributeID = await getLastInsertId();
              if (attributeID) {
                attr.options.forEach((option) => {
                  insertMultiselectOptions(option, attributeID);
                });
              }
            }
          }
        }
      }

      // 4. Insert Collection and get collection ID
      if (templateID) {
        collectionDTO.templateID = templateID;
      }
      const collectionID = await insertCollectionAndReturnID(collectionDTO);

      // 5. Insert Categories
      if (collectionDTO.categories) {
        for (const category of collectionDTO.categories) {
          if (collectionID) {
            category.collectionID = collectionID;
            await insertCollectionCategory(category);
          }
        }
      }

      return pageID;
    });

    if (pageID) {
      const collection = await getCollectionByPageId(pageID);
      console.log("Retrieved collection: ", collection);
    }
  } catch (error) {
    new DatabaseError("Failed to create a new collection", error);
  }
};

export { getCollectionByPageId, insertCollectionAndReturnID };
