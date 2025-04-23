import { executeQuery } from "@/utils/QueryHelper";
import { CollectionCategoryDTO } from "@/dto/CollectionCategoryDTO";
import { insertCollectionCategoryQuery } from "@/queries/CollectionCategoryQuery";

/**
 * Inserts a new attribute into the database and returns its ID.
 *
 * @param {CollectionCategoryDTO} categoryDTO - The DTO representing the categorxy to insert.
 * @returns {Promise<void>}  A promise that resolves to void.
 */
const isnertCollectionCategory = async (
  categoryDTO: CollectionCategoryDTO,
): Promise<void> => {
  try {
    console.log(categoryDTO);
    await executeQuery(insertCollectionCategoryQuery, [
      categoryDTO.category_name,
      categoryDTO.collectionID,
    ]);
  } catch (error) {
    console.error("Error inserting list:", error);
  }
};

export { isnertCollectionCategory };
